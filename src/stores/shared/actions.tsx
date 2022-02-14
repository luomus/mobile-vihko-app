import { ThunkAction } from 'redux-thunk'
import uuid from 'react-native-uuid'
import { clone, set } from 'lodash'
import { LocationObject } from 'expo-location'
import {
  toggleCentered,
  setFirstZoom,
  setCurrentObservationZone,
  clearRegion,
  clearObservationLocation,
  deleteObservationEvent,
  setObservationEventInterrupted,
  replaceObservationEventById,
  replaceObservationEvents,
  setObserving,
  clearObservationId,
  clearLocation,
  updateLocation,
  clearPath,
  setPath,
  setFirstLocation,
  switchSchema,
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
import { convertWGS84ToYKJ, getCurrentLocation, stopLocationAsync, watchLocationAsync } from '../../helpers/geolocationHelper'
import { createUnitBoundingBox, removeDuplicatesFromPath } from '../../helpers/geometryHelper'
import { pathToLineStringConstructor, lineStringsToPathDeconstructor } from '../../helpers/geoJSONHelper'
import { sourceId } from '../../config/keys'
import userService from '../../services/userService'
import { clearGrid, setGrid } from '../position/actions'
import { initCompleteList } from '../../stores/observation/actions'

export const resetReducer = () => ({
  type: 'RESET_STORE'
})

export const beginObservationEvent = (onPressMap: () => void, zoneUsed: boolean, title: string, body: string): ThunkAction<Promise<any>, any, void,
  mapActionTypes | observationActionTypes | locationActionTypes | messageActionTypes> => {
  return async (dispatch, getState) => {
    const { centered, credentials, observationEvent, observationZone, schema, grid } = getState()
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
        location: '/stores/shared/actions.tsx beginObservationEvent()/checkTokenValidity()',
        error: error,
        user_id: credentials.user.id
      })
      if (error.message?.includes('INVALID TOKEN')) {
        return Promise.reject({
          severity: 'high',
          message: i18n.t('user token has expired')
        })
      }
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('failed to check token')} ${error.message}`
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

    const dateTime = setDateForDocument()
    if (schema.formID === 'MHL.117') {
      set(observationEventDefaults, ['gatheringEvent', 'dateBegin'], dateTime.substring(0, 10))
      set(observationEventDefaults, ['gatheringEvent', 'timeStart'], dateTime.substring(11, 16))

    } else {
      set(observationEventDefaults, ['gatheringEvent', 'dateBegin'], dateTime)
    }

    let parsedObservationEvent = parseSchemaToNewObject(observationEventDefaults, ['gatherings_0_units'], schema[lang].schema)

    const setGeometry = () => {
      set(parsedObservationEvent, ['gatherings', '1', 'geometry'], region?.geometry)
      set(parsedObservationEvent, ['gatherings', '1', 'locality'], region?.name)
      set(parsedObservationEvent, ['namedPlaceID'], region?.id)
    }

    if (zoneUsed) {
      setGeometry()
    }

    const newID = 'observationEvent_' + uuid.v4()

    const observationEventObject = {
      id: newID,
      formID: schema.formID,
      grid: grid ? { n: grid.n, e: grid.e } : undefined,
      ...parsedObservationEvent
    }

    const newEvents = observationEvent.events.concat(observationEventObject)

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
      log.error({
        location: '/stores/shared/actions.tsx beginObservationEvent()/save()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('could not save new event to long term memory')
      })
    }

    dispatch(replaceObservationEvents(newEvents))

    //initialize complete list for bird atlas
    if (schema.formID === 'MHL.117') { await dispatch(initCompleteList(lang)) }

    //attempt to start geolocation systems
    try {
      await watchLocationAsync(
        (location: LocationObject) => dispatch(updateLocation(location)),
        title,
        body
      )
    } catch (error) {
      //delete the new event if gps can't be launched
      await dispatch(deleteObservationEvent(newID))
      log.error({
        location: '/components/HomeComponent.tsx beginObservationEvent()/watchLocationAsync()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('could not use gps so event was not started')} ${error.message}`
      })
    }

    //reset map centering and zoom level, redirect to map
    !centered ? dispatch(toggleCentered()) : null
    dispatch(clearRegion())
    dispatch(setObserving(true))
    dispatch(setFirstZoom('not'))
    onPressMap()

    return Promise.resolve()
  }
}

export const continueObservationEvent = (onPressMap: () => void, title: string, body: string): ThunkAction<Promise<any>, any, void,
  locationActionTypes | mapActionTypes | messageActionTypes | observationActionTypes> => {
  return async (dispatch, getState) => {
    const { centered, credentials, observationEventInterrupted, observationEvent } = getState()

    //switch schema
    dispatch(switchSchema(observationEvent.events[observationEvent.events.length - 1].formID))

    if (observationEvent.events[observationEvent.events.length - 1].grid) {
      const grid = observationEvent.events[observationEvent.events.length - 1].grid
      const location = await getCurrentLocation()
      const ykjCoords = convertWGS84ToYKJ([location.coords.longitude, location.coords.latitude])

      dispatch(setGrid({
        n: grid.n,
        e: grid.e,
        pauseGridCheck: Math.trunc(ykjCoords[0] / 100000) !== grid.e || Math.trunc(ykjCoords[1] / 10000) !== grid.n
      }))
    }

    if (!observationEventInterrupted) {
      onPressMap()
      return Promise.resolve()
    }

    //check that person token isn't expired
    try {
      await userService.checkTokenValidity(credentials.token)
    } catch (error) {
      log.error({
        location: '/stores/shared/actions.tsx beginObservationEvent()/checkTokenValidity()',
        error: error,
        user_id: credentials.user.id
      })
      if (error.message?.includes('INVALID TOKEN')) {
        return Promise.reject({
          severity: 'high',
          message: i18n.t('user token has expired')
        })
      }
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('failed to check token')} ${error.message}`
      })
    }

    //attempt to start geolocation systems
    try {
      await watchLocationAsync((location: LocationObject) => dispatch(updateLocation(location)), title, body)
    } catch (error) {
      log.error({
        location: '/stores/shared/actions.tsx continueObservationEvent()/watchLocationAsync()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('could not use gps so event was not started')} ${error.message}`
      })
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
    const { firstLocation, observationEvent, path, observationEventInterrupted, schema } = getState()

    dispatch(setObservationEventInterrupted(false))

    let event = clone(observationEvent.events?.[observationEvent.events.length - 1])

    if (event) {
      const setBoundingBoxGeometry = () => {
        let geometry

        if (event.gatherings[0].units.length >= 1 && schema.formID !== 'MHL.117') {
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
        return Promise.reject(error)
      }
    }

    dispatch(setObserving(false))
    dispatch(clearObservationLocation())
    dispatch(clearObservationId())
    dispatch(clearGrid())
    dispatch(setFirstZoom('not'))
    dispatch(setFirstLocation([60.192059, 24.945831]))
    await stopLocationAsync(observationEventInterrupted)

    return Promise.resolve()
  }
}