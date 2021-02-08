import { ThunkAction } from 'redux-thunk'
import uuid from 'react-native-uuid'
import { clone, set } from 'lodash'
import { LocationObject } from 'expo-location'
import {
  toggleCentered,
  setFirstZoom,
  clearRegion
} from '../stores/map/actions'
import {
  setMessageState
} from '../stores/message/actions'
import {
  removeDuplicatesFromPath,
  clearObservationLocation,
  setObservationEventInterrupted,
  replaceObservationEventById,
  replaceObservationEvents,
  toggleObserving,
  clearObservationId
} from '../stores/observation/actions'
import {
  clearLocation,
  updateLocation,
  clearPath,
  setPath
} from '../stores/position/actions'
import { mapActionTypes } from '../stores/map/types'
import { messageActionTypes } from '../stores/message/types'
import { observationActionTypes } from '../stores/observation/types'
import { PathType } from '../stores/position/types'
import i18n from '../language/i18n'
import storageService from '../services/storageService'
import { parseSchemaToNewObject } from '../parsers/SchemaObjectParser'
import { setDateForDocument } from '../utilities/dateHelper'
import { log } from '../utilities/logger'
import { stopLocationAsync, watchLocationAsync } from '../geolocation/geolocation'
import { locationActionTypes } from '../stores/position/types'
import { createUnitBoundingBox } from '../utilities/geometryCreator'
import { lineStringConstructor } from '../converters/geoJSONConverters'
import { sourceId } from '../config/keys'

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
    set(observationEventDefaults, 'sourceID', sourceId)
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
        location: '/actionCreators/observationEventCreators.tsx beginObservationEvent()',
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
    onPressMap()

    return Promise.resolve()
  }
}

export const continueObservationEvent = (onPressMap: () => void): ThunkAction<Promise<any>, any, void,
  locationActionTypes | mapActionTypes | messageActionTypes | observationActionTypes> => {
  return async (dispatch, getState) => {
    const { centered, observationEventInterrupted, observationEvent } = getState()

    if (!observationEventInterrupted) {
      onPressMap()
      return
    }

    //atempt to start geolocation systems
    try {
      await watchLocationAsync((location: LocationObject) => dispatch(updateLocation(location)))
    } catch (error) {
      log.error({
        location: '/actionCreators/observationEventCreators continueObservationEvent()',
        error: error
      })
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message
      }))
      return
    }

    dispatch(setObservationEventInterrupted(false))
    //reset map centering and zoom level
    !centered ? dispatch(toggleCentered()) : null
    dispatch(clearRegion())

    //set old path if exists
    const path: PathType = observationEvent.events?.[observationEvent.events.length - 1].gatherings[0]?.geometry.coordinates
    if (path) {
      dispatch(setPath(path))
    }

    onPressMap()
  }
}

export const finishObservationEvent = (): ThunkAction<Promise<any>, any, void,
  locationActionTypes | mapActionTypes | messageActionTypes | observationActionTypes> => {
  return async (dispatch, getState) => {
    const { observationEvent, path } = getState()

    dispatch(setObservationEventInterrupted(false))

    let event = clone(observationEvent.events?.[observationEvent.events.length - 1])

    if (event) {

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

    dispatch(toggleObserving())
    dispatch(clearObservationLocation())
    dispatch(clearObservationId())
    dispatch(setFirstZoom(true))
    await stopLocationAsync()

    return Promise.resolve()
  }
}