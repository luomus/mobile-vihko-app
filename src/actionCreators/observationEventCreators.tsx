import { ThunkAction } from 'redux-thunk'
import uuid from 'react-native-uuid'
import { clone, set } from 'lodash'
import { LocationObject } from 'expo-location'
import {
  toggleCentered,
  clearRegion
} from '../stores/map/actions'
import {
  setMessageState
} from '../stores/message/actions'
import {
  removeDuplicatesFromPath,
  clearObservationLocation,
  setObservationEventFinished,
  replaceObservationEventById,
  replaceObservationEvents,
  toggleObserving,
  clearObservationId
} from '../stores/observation/actions'
import {
  clearLocation,
  updateLocation,
  clearPath
} from '../stores/position/actions'
import { mapActionTypes } from '../stores/map/types'
import { messageActionTypes } from '../stores/message/types'
import { observationActionTypes } from '../stores/observation/types'
import i18n from '../language/i18n'
import storageService from '../services/storageService'
import { parseSchemaToNewObject } from '../parsers/SchemaObjectParser'
import { setDateForDocument } from '../utilities/dateHelper'
import { log } from '../utilities/logger'
import { stopLocationAsync, watchLocationAsync } from '../geolocation/geolocation'
import { locationActionTypes } from '../stores/position/types'
import { createUnitBoundingBox } from '../utilities/geometryCreator'
import { lineStringConstructor } from '../converters/geoJSONConverters'

export const beginObservationEvent = (onPressMap: () => void): ThunkAction<Promise<any>, any, void,
  mapActionTypes | observationActionTypes | locationActionTypes | messageActionTypes> => {
  return async (dispatch, getState) => {
    const { centered, credentials, observationEvent, schema } = getState()
    const userId = credentials?.user?.id

    if (!userId) {
      return
    }

    const lang = i18n.language

    let observationEventDefaults = {}
    set(observationEventDefaults, 'editors', [userId])
    set(observationEventDefaults, ['gatheringEvent', 'leg'], [userId])
    set(observationEventDefaults, ['gatheringEvent', 'dateBegin'], setDateForDocument())

    let parsedObservationEvent = parseSchemaToNewObject(observationEventDefaults, ['gatherings_0_units'], schema[lang].schema)

    const observationEventObject = {
      id: 'observationEvent_' + uuid.v4(),
      formID: schema.formID,
      ...parsedObservationEvent
    }

    const newEvents = observationEvent.events.concat(observationEventObject)

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
      log.error({
        location: '/stores/observation/actions.tsx newObservationEvent()',
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('could not save new event to long term memory, discarding modifications')
      })
    }

    dispatch(replaceObservationEvents(newEvents))

    //attempt to start geolocation systems
    try {
      await watchLocationAsync((location: LocationObject) => dispatch(updateLocation(location)))
    } catch (error) {
      log.error({
        location: '/components/HomeComponent.tsx beginObservationEvent()',
        error: error
      })
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message
      }))
      return Promise.reject()
    }

    //reset map centering and zoom level, redirect to map
    !centered ? dispatch(toggleCentered()) : null
    dispatch(clearRegion())
    dispatch(toggleObserving())
    dispatch(setObservationEventFinished(false))
    onPressMap()

    return Promise.resolve()
  }
}

export const finishObservationEvent = (): ThunkAction<Promise<any>, any, void,
  locationActionTypes | mapActionTypes | messageActionTypes | observationActionTypes> => {
  return async (dispatch, getState) => {
    const { observationEvent, path } = getState()

    let event = clone(observationEvent.events?.[observationEvent.events.length - 1])

    if (event) {
      const oldGathering = event.gatheringEvent
      event.gatheringEvent = {
        ...oldGathering,
        dateEnd: setDateForDocument()
      }

      const setBoundingBoxGeometry = () => {
        const geometry = createUnitBoundingBox(event)

        if (geometry) {
          event.gatherings[0].geometry = geometry
        }
      }

      let lineStringPath = lineStringConstructor(path)

      if (lineStringPath) {
        //remove duplicates from path
        lineStringPath.coordinates = removeDuplicatesFromPath(lineStringPath.coordinates)

        if (lineStringPath.coordinates.length >= 2) {
          event.gatherings[0].geometry = lineStringPath
        } else {
          setBoundingBoxGeometry()
        }
      } else {
        setBoundingBoxGeometry()
      }

      dispatch(clearPath())
      dispatch(clearLocation())

      //replace events with modified list
      try {
        dispatch(replaceObservationEventById(event, event.id))
      } catch (error) {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message
        }))
        return Promise.reject()
      }
    }

    dispatch(setObservationEventFinished(true))
    dispatch(toggleObserving())
    dispatch(clearObservationLocation())
    dispatch(clearObservationId())
    await stopLocationAsync()

    return Promise.resolve()
  }
}