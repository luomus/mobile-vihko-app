import uuid from 'react-native-uuid'
import { cloneDeep, set } from 'lodash'
import { LocationObject } from 'expo-location'
import {
  setCurrentObservationZone,
  clearRegion,
  setListOrder,
  clearObservationLocation,
  deleteObservationEvent,
  setObservationEventInterrupted,
  replaceObservationEventById,
  replaceObservationEvents,
  setObserving,
  setObservationEventId,
  setSingleObservation,
  initCompleteList,
  clearLocation,
  updateLocation,
  clearPath,
  setPath,
  setFirstLocation,
  switchSchema,
  clearGrid,
  setGrid,
  RootState
} from '../../stores'
import { PathType } from '../position/types'
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
import { biomonForms, forms } from '../../config/fields'
import { temporalOutlierFilter } from '../../helpers/pathFilters'
import { captureException } from '@sentry/react-native'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface beginObservationParams {
  onPressMap: () => void,
  title: string,
  body: string
}

interface beginSingleObservationParams {
  onPressMap: () => void
}

const resetSlice = createSlice({
  name: 'reset',
  initialState: {},
  reducers: {
    resetReducer() { }
  },
  extraReducers: (builder) => {
    builder
      .addCase(beginObservationEvent.fulfilled, () => { })
      .addCase(beginObservationEvent.rejected, () => { })
      .addCase(continueObservationEvent.fulfilled, () => { })
      .addCase(continueObservationEvent.rejected, () => { })
      .addCase(finishObservationEvent.fulfilled, () => { })
      .addCase(finishObservationEvent.rejected, () => { })
      .addCase(beginSingleObservation.fulfilled, () => { })
      .addCase(beginSingleObservation.rejected, () => { })
      .addCase(finishSingleObservation.fulfilled, () => { })
      .addCase(finishSingleObservation.rejected, () => { })
  }
})

export const beginObservationEvent = createAsyncThunk<void, beginObservationParams, { rejectValue: Record<string, any> }>(
  'reset/beginObservationEvent',
  async ({ onPressMap, title, body }, { dispatch, getState, rejectWithValue }) => {
    const { credentials, observationEvent, observationZone, schema, grid, tracking } = getState() as RootState
    const userId = credentials?.user?.id

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    const region: Record<string, any> | undefined = observationZone.zones.find((region: Record<string, any>) => {
      return region.id === observationZone.currentZoneId
    })

    storageService.save('currentZoneId', observationZone.currentZoneId)

    if (!userId || (schema.formID === forms.lolife && !region)) {
      return
    }

    //check that person token isn't expired
    try {
      await dispatch(userService.checkTokenValidity({ credentials })).unwrap()
    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/stores/shared/actions.tsx beginObservationEvent()/checkTokenValidity()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue(error)
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
      return rejectWithValue({
        severity: 'low',
        message: i18n.t('could not save new event to long term memory')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
    dispatch(setObservationEventId(newID))

    //initialize complete list
    if (schema.formID === forms.birdAtlas || Object.values(biomonForms).includes(schema.formID)) {
      try {
        const gridNumber = grid !== null
          ? grid.n.toString().slice(0, 2) + ':' + grid.e.toString().slice(0, 2)
          : ''
        await dispatch(initCompleteList({ lang, formID: schema.formID, gridNumber })).unwrap()
        if (Object.values(biomonForms).includes(schema.formID)) dispatch(clearGrid())
      } catch (error: any) {
        await dispatch(deleteObservationEvent({ eventId: newID })).unwrap()
        return rejectWithValue({
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
      await dispatch(deleteObservationEvent({ eventId: newID })).unwrap()
      log.error({
        location: '/stores/shared/actions.tsx beginObservationEvent()/watchLocationAsync()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('could not use gps so event was not started')} ${error.message}`
      })
    }

    //reset map centering and redirect to map
    dispatch(setListOrder({ class: '' }))
    dispatch(setSingleObservation(false))
    dispatch(clearRegion())
    dispatch(setObserving(true))
    onPressMap()
  }
)

export const continueObservationEvent = createAsyncThunk<any, beginObservationParams, { rejectValue: Record<string, any> }>(
  'reset/continueObservationEvent',
  async ({ onPressMap, title, body }, { dispatch, getState, rejectWithValue }) => {
    const { credentials, observationEventInterrupted, observationEvent, tracking } = getState() as RootState

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    if (!observationEventInterrupted) {
      dispatch(setObservationEventId(observationEvent.events[observationEvent.events.length - 1].id))
      onPressMap()
      return Promise.resolve()
    }

    await stopLocationAsync() // cleans up tracking

    const formID = observationEvent.events[observationEvent.events.length - 1].formID

    //switch schema
    const lang = i18n.language
    await dispatch(switchSchema({ formID, lang })).unwrap()

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
        return rejectWithValue({
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
      await dispatch(userService.checkTokenValidity({ credentials })).unwrap()
    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/stores/shared/actions.tsx continueObservationEvent()/checkTokenValidity()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue(error)
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
      return rejectWithValue({
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

    dispatch(setObservationEventId(observationEvent.events[observationEvent.events.length - 1].id))
    dispatch(setObservationEventInterrupted(false))
    if (observationEvent.events[observationEvent.events.length - 1].singleObservation) {
      dispatch(setSingleObservation(observationEvent.events[observationEvent.events.length - 1].singleObservation))
    }
    onPressMap()
  }
)

export const finishObservationEvent = createAsyncThunk<Record<string, any>, undefined, { rejectValue: Record<string, any> | unknown }>(
  'reset/finishObservationEvent',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { credentials, grid, firstLocation, observationEvent, path } = getState() as RootState

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    try {
      await stopLocationAsync()
    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/stores/shared/actions.tsx finishObservationEvent()/stopLocationAsync()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: (`${i18n.t('failed to stop location updates')} ${error}`)
      })
    }

    dispatch(setObservationEventInterrupted(false))

    const event = cloneDeep(observationEvent.events?.[observationEvent.events.length - 1])

    let lineStringPath = pathToLineStringConstructor(path)

    if (!event) {
      return rejectWithValue({
        severity: 'low',
        message: (i18n.t('failed to stop location updates'))
      })
    }

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

    const eventWithGeometry = setEventGeometry(event, lineStringPath, firstLocation, grid)

    dispatch(clearPath())
    dispatch(clearLocation())

    //replace events with modified list
    try {
      await dispatch(replaceObservationEventById({ newEvent: eventWithGeometry, eventId: eventWithGeometry.id })).unwrap()
    } catch (error) {
      captureException(error)
      return rejectWithValue(error)
    }

    dispatch(setObserving(false))
    dispatch(clearObservationLocation())
    dispatch(clearGrid())
    dispatch(setFirstLocation([60.192059, 24.945831]))

    return eventWithGeometry
  }
)

export const beginSingleObservation = createAsyncThunk<void, beginSingleObservationParams, { rejectValue: Record<string, any> }>(
  'reset/beginSingleObservationEvent',
  async ({ onPressMap }, { dispatch, getState, rejectWithValue }) => {
    const { credentials, observationEvent, schema, grid } = getState() as RootState

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    const userId = credentials?.user?.id

    //check that person token isn't expired
    try {
      await dispatch(userService.checkTokenValidity({ credentials })).unwrap()
    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/stores/shared/actions.tsx beginSingleObservation()/checkTokenValidity()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue(error)
    }

    const lang = i18n.language

    const observationEventDefaults = {}
    set(observationEventDefaults, 'editors', [userId])
    set(observationEventDefaults, 'sourceID', SOURCE_ID)
    set(observationEventDefaults, ['gatheringEvent', 'leg'], [userId])

    const dateTime = setDateForDocument()
    set(observationEventDefaults, ['gatheringEvent', 'dateBegin'], dateTime)

    const parsedObservationEvent = parseSchemaToNewObject(observationEventDefaults, ['gatherings_0_units'], schema[lang].schema)

    const newID = 'observationEvent_' + uuid.v4()

    const observationEventObject = {
      id: newID,
      formID: schema.formID,
      grid: grid ? grid : undefined,
      singleObservation: true,
      ...parsedObservationEvent
    }

    const newEvents = observationEvent.events.concat(observationEventObject)

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/shared/actions.tsx beginSingleObservation()/save()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: i18n.t('could not save new event to long term memory')
      })
    }

    dispatch(setObservationEventId(newID))
    dispatch(replaceObservationEvents(newEvents))

    //attempt to start geolocation systems
    try {
      await watchLocationAsync((location: LocationObject) => dispatch(updateLocation(location)), '', '', false)
    } catch (error: any) {
      await dispatch(deleteObservationEvent({ eventId: newID })).unwrap()
      log.error({
        location: '/stores/shared/actions.tsx beginSingleObservation()/watchLocationAsync()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('could not use gps so event was not started')} ${error.message}`
      })
    }

    //reset map centering and redirect to map
    dispatch(setSingleObservation(true))
    dispatch(clearRegion())
    dispatch(setObserving(true))
    onPressMap()
  }
)

export const finishSingleObservation = createAsyncThunk<Record<string, any>, undefined, { rejectValue: Record<string, any> | unknown }>(
  'reset/finishSingleObservationEvent',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { credentials, grid, firstLocation, observationEvent } = getState() as RootState

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    try {
      await stopLocationAsync()
    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/stores/shared/actions.tsx finishObservationEvent()/stopLocationAsync()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: (`${i18n.t('failed to stop location updates')} ${error}`)
      })
    }

    dispatch(setObservationEventInterrupted(false))

    const event = cloneDeep(observationEvent.events?.[observationEvent.events.length - 1])

    if (!event) {
      return rejectWithValue({
        severity: 'low',
        message: (i18n.t('failed to stop location updates'))
      })
    }

    const eventWithGeometry = setEventGeometry(event, undefined, firstLocation, grid)

    dispatch(clearPath())
    dispatch(clearLocation())

    //replace events with modified list
    try {
      dispatch(replaceObservationEventById({ newEvent: eventWithGeometry, eventId: eventWithGeometry.id })).unwrap()
    } catch (error) {
      captureException(error)
      return rejectWithValue(error)
    }

    dispatch(setObserving(false))
    dispatch(clearObservationLocation())
    dispatch(setFirstLocation([60.192059, 24.945831]))

    return eventWithGeometry
  }
)

export const { resetReducer } = resetSlice.actions