import { ThunkAction } from 'redux-thunk'
import uuid from 'react-native-uuid'
import { clone, set } from 'lodash'
import { LocationObject } from 'expo-location'
import { setCurrentObservationZone, clearRegion, setListOrder } from '../map/actions'
import {
  clearObservationLocation, deleteObservationEvent, setObservationEventInterrupted,
  replaceObservationEventById, replaceObservationEvents, setObserving, clearObservationId
} from '../../stores/observation/actions'
import { clearLocation, updateLocation, clearPath, setPath, setFirstLocation } from '../position/actions'
import { switchSchema } from '../schema/actions'
import { mapActionTypes } from '../map/types'
import { messageActionTypes } from '../message/types'
import { observationActionTypes } from '../observation/types'
import { locationActionTypes, PathType } from '../position/types'
import i18n from '../../languages/i18n'
import storageService from '../../services/storageService'
import { parseSchemaToNewObject } from '../../helpers/parsers/SchemaObjectParser'
import { setDateForDocument } from '../../helpers/dateHelper'
import { log } from '../../helpers/logger'
import { convertWGS84ToYKJ, getCurrentLocation, stopLocationAsync, watchLocationAsync, YKJCoordinateIntoWGS84Grid } from '../../helpers/geolocationHelper'
import { removeDuplicatesFromPath, setEventGeometry } from '../../helpers/geometryHelper'
import { pathToLineStringConstructor, lineStringsToPathDeconstructor } from '../../helpers/geoJSONHelper'
import { SOURCE_ID } from 'react-native-dotenv'
import userService from '../../services/userService'
import { clearGrid, setGrid } from '../position/actions'
import { initCompleteList } from '../../stores/observation/actions'
import { biomonForms, forms } from '../../config/fields'
import { temporalOutlierFilter } from '../../helpers/pathFilters'
import { captureException } from '@sentry/react-native'

export const resetReducer = () => ({
  type: 'RESET_STORE'
})

export const beginObservationEvent = (onPressMap: () => void, title: string, body: string): ThunkAction<Promise<any>, any, void,
  mapActionTypes | observationActionTypes | locationActionTypes | messageActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials, observationEvent, observationZone, schema, grid, tracking } = getState()
    const userId = credentials?.user?.id

    const region: Record<string, any> | undefined = observationZone.zones.find((region: Record<string, any>) => {
      return region.id === observationZone.currentZoneId
    })

    storageService.save('currentZoneId', observationZone.currentZoneId)

    if (!userId || (schema.formID === forms.lolife && !region)) {
      return
    }

    //check that person token isn't expired
    try {
      await userService.checkTokenValidity(credentials.token)
    } catch (error: any) {
      captureException(error)
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
      if (error.message?.includes('WRONG SOURCE')) {
        return Promise.reject({
          severity: 'high',
          message: i18n.t('person token is given for a different app')
        })
      }
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('failed to check token')} ${error.message}`
      })
    }

    if (schema.formID !== forms.lolife) {
      dispatch(setCurrentObservationZone('empty'))
    }

    const lang = i18n.language

    const observationEventDefaults = {}
    set(observationEventDefaults, 'editors', [userId])
    set(observationEventDefaults, 'sourceID', SOURCE_ID)
    set(observationEventDefaults, ['gatheringEvent', 'leg'], [userId])

    const dateTime = setDateForDocument()
    if (schema.formID === forms.birdAtlas || Object.values(biomonForms).includes(schema.formID)) {
      set(observationEventDefaults, ['gatheringEvent', 'dateBegin'], dateTime.substring(0, 10))
      set(observationEventDefaults, ['gatheringEvent', 'timeStart'], dateTime.substring(11, 16))

    } else {
      set(observationEventDefaults, ['gatheringEvent', 'dateBegin'], dateTime)
    }

    const parsedObservationEvent = parseSchemaToNewObject(observationEventDefaults, ['gatherings_0_units'], schema[lang].schema)

    const setGeometry = () => {
      set(parsedObservationEvent, ['gatherings', '1', 'geometry'], region?.geometry)
      set(parsedObservationEvent, ['gatherings', '1', 'locality'], region?.name)
      set(parsedObservationEvent, ['namedPlaceID'], region?.id)
    }

    if (schema.formID === forms.lolife) {
      setGeometry()
    }

    const newID = 'observationEvent_' + uuid.v4()

    const observationEventObject = {
      id: newID,
      formID: schema.formID,
      grid: grid ? grid : undefined,
      ...parsedObservationEvent
    }

    const newEvents = observationEvent.events.concat(observationEventObject)

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
      captureException(error)
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

    //initialize complete list
    if (schema.formID === forms.birdAtlas || Object.values(biomonForms).includes(schema.formID)) {
      try {
        await dispatch(initCompleteList(lang, schema.formID, grid.n.toString().slice(0, 2) + ':' + grid.e.toString().slice(0, 2)))
        if (Object.values(biomonForms).includes(schema.formID)) dispatch(clearGrid())
      } catch (error: any) {
        await dispatch(deleteObservationEvent(newID))
        return Promise.reject({
          severity: 'low',
          message: error.message
        })
      }
      //clear the grid in case it wasn't cleared due to errors
    } else {
      dispatch(clearGrid())
    }

    //attempt to start geolocation systems
    try {
      await watchLocationAsync(
        (location: LocationObject) => dispatch(updateLocation(location)),
        title,
        body,
        tracking
      )
    } catch (error: any) {
      await dispatch(deleteObservationEvent(newID))
      log.error({
        location: '/stores/shared/actions.tsx beginObservationEvent()/watchLocationAsync()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('could not use gps so event was not started')} ${error.message}`
      })
    }

    //reset map centering and redirect to map
    dispatch(setListOrder({ class: '' }))
    dispatch(clearRegion())
    dispatch(setObserving(true))
    onPressMap()

    return Promise.resolve()
  }
}

export const continueObservationEvent = (onPressMap: () => void, title: string, body: string): ThunkAction<Promise<any>, any, void,
  locationActionTypes | mapActionTypes | messageActionTypes | observationActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials, observationEventInterrupted, observationEvent, tracking } = getState()

    if (!observationEventInterrupted) {
      onPressMap()
      return Promise.resolve()
    }

    await stopLocationAsync() // cleans up tracking

    const formID = observationEvent.events[observationEvent.events.length - 1].formID

    //switch schema
    await dispatch(switchSchema(formID, i18n.language))

    if (formID === forms.lolife) {
      const currentObservationZone = await storageService.fetch('currentZoneId')
      dispatch(setCurrentObservationZone(currentObservationZone))
    }

    if (formID === forms.birdAtlas && observationEvent.events[observationEvent.events.length - 1].grid) {
      let location: LocationObject

      try {
        location = await getCurrentLocation()
      } catch (error: any) {
        // If the Location.getCurrentLocationAsync fails or times out, we don't need to spam Sentry, since it probably works on the next iteration.
        log.error({
          location: '/stores/shared/actions.tsx continueObservationEvent()',
          error: error,
          user_id: credentials.user.id
        })
        return Promise.reject({
          severity: 'low',
          message: `${i18n.t('could not use gps so event was not started')} ${error.message}`
        })
      }

      const grid = observationEvent.events[observationEvent.events.length - 1].grid

      const ykjCoords = convertWGS84ToYKJ([location.coords.longitude, location.coords.latitude])

      dispatch(setGrid({
        n: grid.n,
        e: grid.e,
        geometry: YKJCoordinateIntoWGS84Grid(grid.n, grid.e),
        name: grid.name,
        pauseGridCheck: Math.trunc(ykjCoords[0] / 10000) !== grid.e || Math.trunc(ykjCoords[1] / 10000) !== grid.n,
        outsideBorders: (Math.trunc(ykjCoords[0] / 10000) !== grid.e || Math.trunc(ykjCoords[1] / 10000) !== grid.n) ? 'true' : 'false'
      }))
    }

    //check that person token isn't expired
    try {
      await userService.checkTokenValidity(credentials.token)
    } catch (error: any) {
      captureException(error)
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
      if (error.message?.includes('WRONG SOURCE')) {
        return Promise.reject({
          severity: 'high',
          message: i18n.t('person token is given for a different app')
        })
      }
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('failed to check token')} ${error.message}`
      })
    }

    //attempt to start geolocation systems
    try {
      await watchLocationAsync((location: LocationObject) => dispatch(updateLocation(location)), title, body, tracking)
    } catch (error: any) {
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

    //reset map centering
    dispatch(clearRegion())

    //set old path if exists
    const path: PathType | undefined = lineStringsToPathDeconstructor(observationEvent.events[observationEvent.events.length - 1]?.gatherings[0]?.geometry)

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
    const { credentials, grid, firstLocation, observationEvent, path } = getState()

    try {
      await stopLocationAsync()
    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/stores/shared/actions.tsx finishObservationEvent()/stopLocationAsync()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: (`${i18n.t('failed to stop location updates')} ${error}`)
      })
    }

    dispatch(setObservationEventInterrupted(false))

    let event = clone(observationEvent.events?.[observationEvent.events.length - 1])
    let lineStringPath = pathToLineStringConstructor(path)

    //remove unused complete list observations from bird atlas events
    if (event.formID === forms.birdAtlas || Object.values(biomonForms).includes(event.formID)) {
      const filtered: Record<string, any>[] = []
      event.gatherings[0].units.forEach((observation: Record<string, any>) => {
        if (!observation.id.includes('complete_list') || observation.atlasCode || observation.count) {
          filtered.push(observation)
        }
      })
      event.gatherings[0].units = filtered
    }

    if (lineStringPath?.type === 'LineString' || lineStringPath?.type === 'MultiLineString') {
      lineStringPath = removeDuplicatesFromPath(lineStringPath)
      const endDate = event.gatheringEvent.timeEnd ? event.gatheringEvent.dateEnd + 'T' + event.gatheringEvent.timeEnd : event.gatheringEvent.dateEnd
      lineStringPath ? lineStringPath = temporalOutlierFilter(lineStringPath, endDate) : null
    }

    if (event) {
      event = setEventGeometry(event, lineStringPath, firstLocation, grid)

      dispatch(clearPath())
      dispatch(clearLocation())

      //replace events with modified list
      try {
        dispatch(replaceObservationEventById(event, event.id))
      } catch (error) {
        captureException(error)
        return Promise.reject(error)
      }
    }

    dispatch(setObserving(false))
    dispatch(clearObservationLocation())
    dispatch(clearObservationId())
    dispatch(clearGrid())
    dispatch(setFirstLocation([60.192059, 24.945831]))

    return Promise.resolve()
  }
}