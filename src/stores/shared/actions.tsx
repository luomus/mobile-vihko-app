import { ThunkAction } from 'redux-thunk'
import uuid from 'react-native-uuid'
import { clone, set } from 'lodash'
import { LocationObject } from 'expo-location'
import {
  toggleCentered,
  setFirstZoom,
  setCurrentObservationZone,
  clearRegion,
  setMessageState,
  clearObservationLocation,
  setObservationEventInterrupted,
  replaceObservationEventById,
  replaceObservationEvents,
  toggleObserving,
  clearObservationId,
  clearLocation,
  updateLocation,
  clearPath,
  setPath,
  setFirstLocation,
  mapActionTypes,
  messageActionTypes,
  observationActionTypes,
  locationActionTypes,
  PathType,
  ZoneType
} from '../../stores'
import i18n from '../../languages/i18n'
import storageService from '../../services/storageService'
import { parseSchemaToNewObject } from '../../helpers/parsers/SchemaObjectParser'
import { setDateForDocument } from '../../helpers/dateHelper'
import { log } from '../../helpers/logger'
import { stopLocationAsync, watchLocationAsync } from '../../helpers/geolocationHelper'
import { createUnitBoundingBox, removeDuplicatesFromPath } from '../../helpers/geometryHelper'
import { pathToLineStringConstructor, lineStringsToPathDeconstructor } from '../../helpers/geoJSONHelper'
import { sourceId } from '../../config/keys'
import userService from '../../services/userService'

export const resetReducer = () => ({
  type: 'RESET_STORE'
})

export const beginObservationEvent = (onPressMap: () => void, zoneUsed: boolean, title: string, body: string): ThunkAction<Promise<any>, any, void,
  mapActionTypes | observationActionTypes | locationActionTypes | messageActionTypes> => {
  return async (dispatch, getState) => {
    const { centered, credentials, observationEvent, observationZone, schema } = getState()
    const userId = credentials?.user?.id

    const region: ZoneType | undefined = observationZone.zones.find((region: Record<string, any>) => {
      return region.id === observationZone.currentZoneId
    })

    if (!userId || (zoneUsed && !region)) {
      return
    }

    //check that person token isn't expired
    try {
      await userService.checkTokenValidity(credentials.token)
    } catch (error) {
      log.error({
        location: '/stores/shared/actions.tsx beginObservationEvent()',
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('user token has expired')
      })
    }

    if (!zoneUsed) {
      dispatch(setCurrentObservationZone('empty'))
    }

    const lang = i18n.language

    let observationEventDefaults = {}
    set(observationEventDefaults, 'editors', [userId])
    set(observationEventDefaults, 'sourceID', sourceId)
    set(observationEventDefaults, ['gatheringEvent', 'leg'], [userId])
    set(observationEventDefaults, ['gatheringEvent', 'dateBegin'], setDateForDocument())

    let parsedObservationEvent = parseSchemaToNewObject(observationEventDefaults, ['gatherings_0_units'], schema[lang].schema)

    const setGeometry = () => {
      set(parsedObservationEvent, ['gatherings', '1', 'geometry'], region?.geometry)
      set(parsedObservationEvent, ['gatherings', '1', 'locality'], region?.name)
      set(parsedObservationEvent, ['namedPlaceID'], region?.id)
    }

    if (zoneUsed) {
      setGeometry()
    }

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
        location: '/stores/shared/actions.tsx beginObservationEvent()',
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
      await watchLocationAsync(
        (location: LocationObject) => dispatch(updateLocation(location)),
        title,
        body
      )
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
    dispatch(setFirstZoom('not'))
    onPressMap()

    return Promise.resolve()
  }
}

export const continueObservationEvent = (onPressMap: () => void, title: string, body: string): ThunkAction<Promise<any>, any, void,
  locationActionTypes | mapActionTypes | messageActionTypes | observationActionTypes> => {
  return async (dispatch, getState) => {
    const { centered, credentials, observationEventInterrupted, observationEvent } = getState()

    if (!observationEventInterrupted) {
      onPressMap()
      return Promise.resolve()
    }

    //check that person token isn't expired
    try {
      await userService.checkTokenValidity(credentials.token)
    } catch (error) {
      log.error({
        location: '/stores/shared/actions.tsx beginObservationEvent()',
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('user token has expired')
      })
    }

    //atempt to start geolocation systems
    try {
      await watchLocationAsync((location: LocationObject) => dispatch(updateLocation(location)), title, body)
    } catch (error) {
      log.error({
        location: '/stores/shared/actions.tsx continueObservationEvent()',
        error: error
      })
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message
      }))
      return Promise.reject()
    }

    //reset map centering and zoom level
    !centered ? dispatch(toggleCentered()) : null
    dispatch(clearRegion())
    dispatch(setFirstZoom('not'))
    //set old path if exists
    const path: PathType | undefined = lineStringsToPathDeconstructor(observationEvent.events[observationEvent.events.length - 1].gatherings[0]?.geometry)

    if (path) {
      path.push([])
      dispatch(setPath(path))
    } else {
      dispatch(setPath([[]]))
    }
    dispatch(setObservationEventInterrupted(false))
    onPressMap()
    return Promise.resolve()
  }
}

export const finishObservationEvent = (): ThunkAction<Promise<any>, any, void,
  locationActionTypes | mapActionTypes | messageActionTypes | observationActionTypes> => {
  return async (dispatch, getState) => {
    const { firstLocation, observationEvent, path, observationEventInterrupted } = getState()

    dispatch(setObservationEventInterrupted(false))

    let event = clone(observationEvent.events?.[observationEvent.events.length - 1])

    if (event) {

      const setBoundingBoxGeometry = () => {
        let geometry

        if (event.gatherings[0].units.length >= 1) {
          geometry = createUnitBoundingBox(event)
        } else {
          geometry = {
            coordinates: [
              firstLocation[1],
              firstLocation[0]
            ],
            type: 'Point'
          }
        }

        if (geometry) {
          event.gatherings[0].geometry = geometry
        }
      }

      let lineStringPath = pathToLineStringConstructor(path)

      //remove duplicates from path
      lineStringPath = removeDuplicatesFromPath(lineStringPath)

      if (lineStringPath && event.formID !== 'MHL.45') {
        event.gatherings[0].geometry = lineStringPath

      } else {

        if (event.namedPlaceID && event.namedPlaceID !== '') {
          event.gatherings[0].geometry = event.gatherings[1].geometry
        } else if (lineStringPath) {
          event.gatherings[0].geometry = lineStringPath
        } else {
          setBoundingBoxGeometry()
        }

        if (event.formID === 'MHL.45') {

          if (lineStringPath) {
            if (event.gatherings[1]) {
              event.gatherings[1].geometry = lineStringPath
            } else {
              event.gatherings.push({ geometry: lineStringPath })
            }
          } else {
            event.gatherings = [event.gatherings[0]]
          }

        }
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
    dispatch(setFirstZoom('not'))
    dispatch(setFirstLocation([60.192059, 24.945831]))
    await stopLocationAsync(observationEventInterrupted)

    return Promise.resolve()
  }
}