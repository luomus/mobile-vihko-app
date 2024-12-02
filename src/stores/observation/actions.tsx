import { LineString, MultiLineString } from 'geojson'
import { clone, cloneDeep, set } from 'lodash'
import i18n from 'i18next'
import uuid from 'react-native-uuid'
import moment from 'moment'
import { RootState, replaceObservationEvents, clearObservationEventId } from '..'
import { biomonForms, forms } from '../../config/fields'
import { getCompleteList } from '../../services/atlasService'
import { postObservationEvent } from '../../services/documentService'
import storageService from '../../services/storageService'
import userService from '../../services/userService'
import { netStatusChecker } from '../../helpers/netStatusHelper'
import { overlapsFinland } from '../../helpers/geometryHelper'
import { log } from '../../helpers/logger'
import { definePublicity, loopThroughUnits, fetchFinland, fetchForeign, loopThroughBirdUnits } from '../../helpers/uploadHelper'
import { convertMultiLineStringToGCWrappedLineString } from '../../helpers/geoJSONHelper'
import { saveImages } from '../../helpers/imageHelper'
import { getTaxonAutocomplete } from '../../services/autocompleteService'
import { captureException } from '../../helpers/sentry'
import { createAsyncThunk } from '@reduxjs/toolkit'

interface uploadObservationParams {
  event: Record<string, any>,
  lang: string,
  isPublic: boolean
}

interface replaceObservationEventByIdParams {
  newEvent: Record<string, any>,
  eventId: string
}

interface deleteObservationEventParams {
  eventId: string
}

interface eventPathUpdateParams {
  lineStringPath: LineString | MultiLineString | undefined
}

interface newObservationParams {
  unit: Record<string, any>
}

interface deleteObservationParams {
  eventId: string,
  unitId: string
}

interface replaceObservationByIdParams {
  newUnit: Record<string, any>,
  eventId: string,
  unitId: string
}

interface initCompleteListParams {
  lang: string,
  formID: string,
  gridNumber: string
}

export const initObservationEvents = createAsyncThunk<void, undefined, { rejectValue: Record<string, any> }>(
  'observationEvents/initObservationEvents',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { credentials } = getState() as RootState

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    let observationEvents: Array<Record<string, any>>

    try {
      observationEvents = await storageService.fetch('observationEvents')
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/observation/actions.tsx initObservationEvents()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: i18n.t('error on loading observation events, overwrite risk')
      })
    }

    if (observationEvents) {
      dispatch(replaceObservationEvents(observationEvents))
    } else {
      rejectWithValue({ message: 'no events' })
    }
  }
)

export const uploadObservationEvent = createAsyncThunk<void, uploadObservationParams, { rejectValue: Record<string, any> | unknown }>(
  'observationEvents/uploadObservationEvent',
  async ({ event, lang, isPublic }, { dispatch, getState, rejectWithValue }) => {
    const { credentials, schema } = getState() as RootState
    const eventClone = cloneDeep(event)

    if (credentials.token === null || credentials.user === null || eventClone === undefined) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    //check that internet can be reached
    try {
      await netStatusChecker()
    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/stores/observation/actions.tsx uploadObservationEvent()/netStatusChecker()',
        error: 'Network error (no connection)',
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: error.message
      })
    }

    //check that person token isn't expired
    try {
      await userService.checkTokenValidity(credentials.token)
    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/stores/observation/actions.tsx uploadObservationEvent()/checkTokenValidity()',
        error: error,
        user_id: credentials.user.id
      })
      if (error.message?.includes('INVALID TOKEN')) {
        return rejectWithValue({
          severity: 'high',
          message: i18n.t('user token has expired')
        })
      }
      if (error.message?.includes('WRONG SOURCE')) {
        return rejectWithValue({
          severity: 'high',
          message: i18n.t('person token is given for a different app')
        })
      }
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to check token')} ${error.message}`
      })
    }

    //define whether the event will be released publicly or privately
    const eventWithPublicity = definePublicity(eventClone, isPublic)

    let eventWithLoop: Record<string, any> | undefined = {}
    if (schema.formID !== forms.lolife && eventWithPublicity.formID !== forms.birdAtlas && !Object.values(biomonForms).includes(eventWithPublicity.formID)) {
      eventWithLoop = loopThroughUnits(eventWithPublicity)
    } else if (eventWithPublicity.formID === forms.birdAtlas || Object.values(biomonForms).includes(eventWithPublicity.formID)) {
      eventWithLoop = loopThroughBirdUnits(eventWithPublicity)
    }

    let localityErrorMessage = ''

    let eventWithLocality: Record<string, any> | undefined = {}
    //if there isn't an observation zone, use APIs to get a proper locality name
    //if event geometry overlaps finland, use fetchFinland, else use fetchForeign
    if (eventWithLoop.formID && eventWithLoop.formID !== forms.lolife) {
      if (overlapsFinland(eventWithLoop.gatherings[0].geometry)) {
        try {
          eventWithLocality = await fetchFinland(eventWithLoop, lang, credentials)
        } catch (error: any) {
          if (error.severity && error.severity === 'low') {
            localityErrorMessage = error.message
          }
        }
      } else {
        try {
          eventWithLocality = await fetchForeign(eventWithLoop, lang, credentials)
        } catch (error: any) {
          if (error.severity && error.severity === 'low') {
            localityErrorMessage = error.message
          }
        }
      }
    } else {
      eventWithLocality = eventWithPublicity
    }

    if (!eventWithLocality) return
    //convert possible MultiLineStrings to GeometryCollections containing LineStrings which laji-map can edit properly
    if (eventWithLocality.gatherings[0].geometry?.type === 'MultiLineString') {
      eventWithLocality.gatherings[0].geometry = convertMultiLineStringToGCWrappedLineString(eventWithLocality.gatherings[0].geometry)
    }

    if (eventWithLocality.gatherings[1]?.geometry?.type === 'MultiLineString') {
      eventWithLocality.gatherings[1].geometry = convertMultiLineStringToGCWrappedLineString(eventWithLocality.gatherings[1].geometry)
    }

    let imageErrorMessage = ''

    //for each observation in observation event try to send images to server
    //using saveImages, and clean out local properties
    try {
      const newUnits = await Promise.all(eventWithLocality.gatherings[0].units.map(async (unit: Record<string, any>) => {
        let newUnit: Record<string, any>
        let newImages

        if (unit.images && unit.images?.length > 0) {
          try {
            newImages = await saveImages(unit.images, credentials)
          } catch (error: any) {
            captureException(error)
            if (error.severity && error.severity === 'low') {
              imageErrorMessage = error.message
            } else {
              return Promise.reject(error)
            }
          }

          newUnit = {
            ...unit,
            images: newImages
          }
        } else {
          newUnit = {
            ...unit
          }
        }

        //remove unnecessary fields
        delete newUnit.id
        delete newUnit.rules
        delete newUnit.color
        if (eventWithLocality.singleObservation) delete newUnit.unitGathering

        return Promise.resolve(newUnit)
      }))

      eventWithLocality.gatherings[0].units = newUnits

      if (eventWithLocality.gatherings[0].units.length < 1) {
        if (eventWithLocality.formID !== forms.lolife) {
          eventWithLocality.gatherings[0].units.push({
            'taxonConfidence': 'MY.taxonConfidenceSure',
            'recordBasis': 'MY.recordBasisHumanObservation'
          })
        } else {
          eventWithLocality.gatherings[0].units.push({
            'taxonConfidence': 'MY.taxonConfidenceSure',
            'recordBasis': ''
          })
        }
      }

      //add ykjSquareNumber to bird atlas events
      if (eventWithLocality.formID === 'MHL.117' && eventWithLocality.grid.n && eventWithLocality.grid.e) {
        set(eventWithLocality, 'gatherings[0].gatheringFact.ykjSquareNumber', '' + eventWithLocality.grid.n + ':' + eventWithLocality.grid.e)
      }

      delete eventWithLocality.id
      delete eventWithLocality.grid
      if (eventWithLocality.namedPlaceID && eventWithLocality.namedPlaceID === 'empty') {
        delete eventWithLocality.namedPlaceID
        eventWithLocality.gatherings.pop()
      }
      if (
        !eventWithLocality.gatheringEvent.dateBegin
        || eventWithLocality.gatheringEvent.dateBegin === ''
        || !(moment(eventWithLocality.gatheringEvent.dateBegin).isValid())
      ) {
        delete eventWithLocality.gatheringEvent.dateBegin
      }
      if (
        !eventWithLocality.gatheringEvent.dateEnd
        || eventWithLocality.gatheringEvent.dateEnd === ''
        || !(moment(eventWithLocality.gatheringEvent.dateEnd).isValid())
      ) {
        delete eventWithLocality.gatheringEvent.dateEnd
      }
      if (eventWithLocality.singleObservation) delete eventWithLocality.singleObservation

    } catch (error: any) {
      captureException(error)
      return rejectWithValue({
        severity: 'low',
        message: error.message
      })
    }

    try {
      await postObservationEvent(eventWithLocality, credentials)
    } catch (error: any) {
      if (error.response?.status.toString() === '422') {
        captureException({
          error,
          extra: {
            payload: JSON.stringify(eventWithLocality),
          }
        })
        log.error({
          location: '/stores/observation/actions.tsx uploadObservationEvent()/postObservationEvent()',
          error: error.response.data.error,
          data: eventWithLocality,
          user_id: credentials.user.id
        })
      } else {
        captureException(error)
        log.error({
          location: '/stores/observation/actions.tsx uploadObservationEvent()/postObservationEvent()',
          error: error,
          user_id: credentials.user.id
        })
      }

      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('post failure')} ${error.message}`
      })
    }

    dispatch(clearObservationEventId())

    try {
      await dispatch(deleteObservationEvent({ eventId: event.id })).unwrap()
    } catch (error: unknown) {
      captureException(error)
      return rejectWithValue(error)
    }

    if (localityErrorMessage !== '') {
      return rejectWithValue({
        severity: 'low',
        message: localityErrorMessage
      })
    }

    if (imageErrorMessage !== '') {
      return rejectWithValue({
        severity: 'low',
        message: imageErrorMessage
      })
    }
  }
)

export const replaceObservationEventById = createAsyncThunk<void, replaceObservationEventByIdParams, { rejectValue: Record<string, any> }>(
  'observationEvents/replaceObservationEventById',
  async ({ newEvent, eventId }, { dispatch, getState, rejectWithValue }) => {
    const { credentials, observationEvent } = getState() as RootState

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    const newEvents = observationEvent.events.map((event: Record<string, any>) => {
      if (event.id === eventId) {
        return newEvent
      } else {
        return event
      }
    })

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/observation/actions.tsx replaceObservationEventById()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: i18n.t('could not save event to storage')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
  }
)

export const deleteObservationEvent = createAsyncThunk<void, deleteObservationEventParams, { rejectValue: Record<string, any> }>(
  'observationEvents/deleteObservationEvent',
  async ({ eventId }, { dispatch, getState, rejectWithValue }) => {
    const { credentials, observationEvent } = getState() as RootState

    const eventsCopy = cloneDeep(observationEvent)

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    const filteredEvents = eventsCopy.events.filter((event: Record<string, any>) => event.id !== eventId)
    const newEvents = filteredEvents ? filteredEvents : []

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/observation/actions.tsx deleteObservationEvent()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: i18n.t('error removing observation event')
      })
    }
    dispatch(replaceObservationEvents(newEvents))
  }
)

export const eventPathUpdate = createAsyncThunk<void, eventPathUpdateParams, { rejectValue: Record<string, any> }>(
  'observationEvents/eventPathUpdate',
  async ({ lineStringPath }, { dispatch, getState, rejectWithValue }) => {
    const { credentials, observationEvent } = getState() as RootState

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    const newEvents = clone(observationEvent.events)
    const newEvent = cloneDeep(newEvents.pop())

    if (newEvent === undefined) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    if (lineStringPath) {
      newEvent.gatherings[0].geometry = lineStringPath
      newEvents.push(newEvent)
      dispatch(replaceObservationEvents(newEvents))
    }
  }
)

export const newObservation = createAsyncThunk<void, newObservationParams, { rejectValue: Record<string, any> }>(
  'observation/newObservation',
  async ({ unit }, { dispatch, getState, rejectWithValue }) => {
    const { credentials, observationEvent } = getState() as RootState

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    const events = clone(observationEvent.events)
    const event = cloneDeep(events.pop())

    if (event === undefined) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    event.gatherings[0].units.push(unit)
    events.push(event)

    try {
      await storageService.save('observationEvents', events)
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/observation/actions.tsx newObservation()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: i18n.t('error saving new observation')
      })
    }

    dispatch(replaceObservationEvents(events))
  }
)

export const deleteObservation = createAsyncThunk<void, deleteObservationParams, { rejectValue: Record<string, any> }>(
  'observation/deleteObservation',
  async ({ eventId, unitId }, { dispatch, getState, rejectWithValue }) => {
    const { credentials, observationEvent } = getState() as RootState

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    const newEvents = observationEvent.events.map((event: Record<string, any>) => {
      if (event.id === eventId) {
        const newEvent = cloneDeep(event)
        const units = newEvent.gatherings[0].units
        newEvent.gatherings[0].units = units.filter((unit: any) =>
          unit.id !== unitId
        )
        return newEvent
      } else {
        return event
      }
    })

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/observation/actions.tsx deleteObservation()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: i18n.t('error deleting observation')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
  }
)

export const replaceObservationById = createAsyncThunk<void, replaceObservationByIdParams, { rejectValue: Record<string, any> }>(
  'observation/replaceObservationById',
  async ({ newUnit, eventId, unitId }, { dispatch, getState, rejectWithValue }) => {
    const { credentials, observationEvent } = getState() as RootState

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    const newEvents = observationEvent.events.map((event: Record<string, any>) => {
      if (event.id === eventId) {
        const newEvent = cloneDeep(event)
        newEvent.gatherings[0].units.forEach((unit: Record<string, any>, index: number, arr: Record<string, any>) => {
          if (unit.id === unitId) {
            arr[index] = newUnit
          }
        })

        return newEvent
      } else {
        return event
      }
    })

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/observation/actions.tsx replaceObservationById()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: i18n.t('error modifying observation')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
  }
)

export const initCompleteList = createAsyncThunk<void, initCompleteListParams, { rejectValue: Record<string, any> }>(
  'observation/initCompleteList',
  async ({ lang, formID, gridNumber }, { dispatch, getState, rejectWithValue }) => {
    const { credentials, observationEvent } = getState() as RootState

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    const mapInformalTaxonGroups = (informalTaxonGroups: Record<string, any>) => {
      return informalTaxonGroups.map((group: any) => {
        return typeof group === 'string' ? group : group.id
      })
    }

    const newEvents = clone(observationEvent.events)
    const newEvent = cloneDeep(newEvents.pop())
    const observations: Record<string, any>[] = []

    if (newEvent === undefined) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    let taxonList: Record<string, any>[] = []

    let taxonSetID = 'BirdAtlas'
    if (formID === forms.dragonflyForm) taxonSetID = 'MX.taxonSetBiomonCompleteListOdonata'
    if (formID === forms.butterflyForm) taxonSetID = 'MX.taxonSetBiomonCompleteListButterflies'
    if (formID === forms.largeFlowersForm) taxonSetID = 'MX.taxonSetBiomonCompleteListLargeFlowers'
    if (formID === forms.mothForm) taxonSetID = 'MX.taxonSetBiomonCompleteListMoths'
    if (formID === forms.bumblebeeForm) taxonSetID = 'MX.taxonSetBiomonCompleteListBombus'
    if (formID === forms.herpForm) taxonSetID = 'MX.taxonSetBiomonCompleteListAmphibiaReptilia'
    if (formID === forms.subarcticForm) taxonSetID = 'MX.taxonSetBiomonCompleteListSubarcticPlants'
    if (formID === forms.macrolichenForm) taxonSetID = 'MX.taxonSetBiomonCompleteListMacrolichens'
    if (formID === forms.bracketFungiForm) taxonSetID = 'MX.taxonSetBiomonCompleteListBracketFungi'
    if (formID === forms.practicalFungiForm) taxonSetID = 'MX.taxonSetBiomonCompleteListPracticalFungi'

    try {
      taxonList = await getCompleteList(taxonSetID, gridNumber)
      taxonList = taxonList.filter(taxon => { return taxon !== null })
    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/stores/observation/actions.tsx initCompleteList()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: i18n.t('failed to fetch taxon list')
      })
    }

    const getTaxonName = (taxon: Record<string, any>) => {
      let name = ''

      if (lang === 'fi') {
        name = taxon.vernacularName?.fi ? taxon.vernacularName.fi : taxon.scientificName
      } else if (lang === 'sv') {
        name = taxon.vernacularName?.sv ? taxon.vernacularName.sv : taxon.scientificName
      } else if (lang === 'en') {
        name = taxon.vernacularName?.en ? taxon.vernacularName.en : taxon.scientificName
      }

      return name
    }

    const nameList: Array<string> = taxonList.map(taxon => getTaxonName(taxon))

    //fetch taxon details concurrently and initialize bird list observations
    await Promise.all(taxonList.map(async (item: Record<string, any>) => {
      const res = await getTaxonAutocomplete('taxon', item.id, null, lang, 1, null)
      const observation = {}

      if (taxonSetID === 'BirdAtlas') {
        set(observation, 'id', `complete_list_${uuid.v4()}`)
        set(observation, 'identifications', [{ taxon: getTaxonName(item) }])
        set(observation, 'informalTaxonGroups', mapInformalTaxonGroups(res.result[0].payload.informalTaxonGroups))
        set(observation, 'scientificName', item.scientificName)
        set(observation, 'taxonomicOrder', item.taxonomicOrder)
        set(observation, 'unitFact', { autocompleteSelectedTaxonID: item.id })
      } else {
        set(observation, 'id', `complete_list_${uuid.v4()}`)
        set(observation, 'identifications', [{ taxonID: item.id, taxonVerbatim: getTaxonName(item) }])
        set(observation, 'informalTaxonGroups', mapInformalTaxonGroups(res.result[0].payload.informalTaxonGroups))
        set(observation, 'scientificName', item.scientificName)
        set(observation, 'taxonomicOrder', item.taxonomicOrder)
      }

      observations.push(observation)
    }))

    //sort the observations based on the correct order
    if (taxonSetID === 'BirdAtlas') {
      observations.sort((a, b) => {
        return nameList.indexOf(a.identifications[0].taxon) - nameList.indexOf(b.identifications[0].taxon)
      })
    } else {
      observations.sort((a, b) => {
        return nameList.indexOf(a.identifications[0].taxonVerbatim) - nameList.indexOf(b.identifications[0].taxonVerbatim)
      })
    }

    newEvent.gatherings[0].units = observations
    newEvents.push(newEvent)

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/observation/actions.tsx initCompleteList()',
        error: error,
        user_id: credentials.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: i18n.t('error saving new observation')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
  }
)