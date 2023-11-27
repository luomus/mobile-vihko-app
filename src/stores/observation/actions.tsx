import { Point, Geometry, LineString, MultiLineString } from 'geojson'
import { ThunkAction } from 'redux-thunk'
import { clone, cloneDeep, set } from 'lodash'
import i18n from 'i18next'
import uuid from 'react-native-uuid'
import {
  observationActionTypes,
  SET_OBSERVATION,
  CLEAR_OBSERVATION,
  SET_OBSERVING,
  SET_OBSERVATION_EVENT_INTERRUPTED,
  REPLACE_OBSERVATION_EVENTS,
  CLEAR_OBSERVATION_EVENTS,
  SET_OBSERVATION_ID,
  CLEAR_OBSERVATION_ID,
  SET_OBSERVATION_EVENT_ID,
  CLEAR_OBSERVATION_EVENT_ID,
  SET_SINGLE_OBSERVATION
} from './types'
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

export const setObservationLocation = (point: Point | null): observationActionTypes => ({
  type: SET_OBSERVATION,
  payload: point,
})

export const clearObservationLocation = (): observationActionTypes => ({
  type: CLEAR_OBSERVATION
})

export const setObserving = (observing: boolean): observationActionTypes => ({
  type: SET_OBSERVING,
  payload: observing
})

export const setObservationId = (id: string): observationActionTypes => ({
  type: SET_OBSERVATION_ID,
  payload: id
})

export const clearObservationId = (): observationActionTypes => ({
  type: CLEAR_OBSERVATION_ID
})

export const setObservationEventId = (id: string): observationActionTypes => ({
  type: SET_OBSERVATION_EVENT_ID,
  payload: id
})

export const clearObservationEventId = (): observationActionTypes => ({
  type: CLEAR_OBSERVATION_EVENT_ID
})

export const setObservationEventInterrupted = (interrupted: boolean): observationActionTypes => ({
  type: SET_OBSERVATION_EVENT_INTERRUPTED,
  payload: interrupted
})

export const clearObservationEvents = (): observationActionTypes => ({
  type: CLEAR_OBSERVATION_EVENTS
})

export const replaceObservationEvents = (events: Record<string, any>[]): observationActionTypes => ({
  type: REPLACE_OBSERVATION_EVENTS,
  payload: events
})

export const setSingleObservation = (isSingleObservation: boolean): observationActionTypes => ({
  type: SET_SINGLE_OBSERVATION,
  payload: isSingleObservation
})

export const initObservationEvents = (): ThunkAction<Promise<void>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials } = getState()

    try {
      const observationEvents: Array<Record<string, any>> = await storageService.fetch('observationEvents')
      if (observationEvents !== null) {
        dispatch(replaceObservationEvents(observationEvents))
        return Promise.resolve()
      }
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/observation/actions.tsx initObservationEvents()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('error on loading observation events, overwrite risk')
      })
    }
  }
}

export const uploadObservationEvent = (id: string, lang: string, isPublic: boolean): ThunkAction<Promise<void>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials, observationEvent, schema } = getState()

    let event: Record<string, any> = cloneDeep(observationEvent.events.find((event: Record<string, any>) => event.id === id))
    const units: Record<string, any>[] = event.gatherings[0].units

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
      return Promise.reject({
        severity: 'low',
        message: error.message
      })
    }

    //check that person token isn't expired
    // try {
    //   await userService.checkTokenValidity(credentials.token)
    // } catch (error: any) {
    //   captureException(error)
    //   log.error({
    //     location: '/stores/shared/actions.tsx beginObservationEvent()/checkTokenValidity()',
    //     error: error,
    //     user_id: credentials.user.id
    //   })
    //   if (error.message?.includes('INVALID TOKEN')) {
    //     return Promise.reject({
    //       severity: 'high',
    //       message: i18n.t('user token has expired')
    //     })
    //   }
    //   if (error.message?.includes('WRONG SOURCE')) {
    //     return Promise.reject({
    //       severity: 'high',
    //       message: i18n.t('person token is given for a different app')
    //     })
    //   }
    //   return Promise.reject({
    //     severity: 'low',
    //     message: `${i18n.t('failed to check token')} ${error.message}`
    //   })
    // }

    //define whether the event will be released publicly or privately
    event = definePublicity(event, isPublic)

    if (schema.formID !== forms.lolife && event.formID !== forms.birdAtlas && !Object.values(biomonForms).includes(event.formID)) {
      event = loopThroughUnits(event)
    } else if (event.formID === forms.birdAtlas || Object.values(biomonForms).includes(event.formID)) {
      event = loopThroughBirdUnits(event)
    }

    let localityErrorMessage = ''

    //if there isn't an observation zone, use APIs to get a proper locality name
    //if event geometry overlaps finland, use fetchFinland, else use fetchForeign
    if (event.formID !== forms.lolife) {
      if (overlapsFinland(event.gatherings[0].geometry)) {
        try {
          await fetchFinland(event, lang, credentials)
        } catch (error: any) {
          if (error.severity && error.severity === 'low') {
            localityErrorMessage = error.message
          }
        }
      } else {
        try {
          await fetchForeign(event, lang, credentials)
        } catch (error: any) {
          if (error.severity && error.severity === 'low') {
            localityErrorMessage = error.message
          }
        }
      }
    }

    //convert possible MultiLineStrings to GeometryCollections containing LineStrings which laji-map can edit properly
    if (event.gatherings[0].geometry?.type === 'MultiLineString') {
      event.gatherings[0].geometry = convertMultiLineStringToGCWrappedLineString(event.gatherings[0].geometry)
    }

    if (event.gatherings[1]?.geometry?.type === 'MultiLineString') {
      event.gatherings[1].geometry = convertMultiLineStringToGCWrappedLineString(event.gatherings[1].geometry)
    }

    let imageErrorMessage = ''

    //for each observation in observation event try to send images to server
    //using saveImages, and clean out local properties
    try {
      const newUnits = await Promise.all(units.map(async (unit: Record<string, any>) => {
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
        if (event.singleObservation) delete newUnit.unitGathering

        return Promise.resolve(newUnit)
      }))

      event.gatherings[0].units = newUnits

      if (event.gatherings[0].units.length < 1) {
        if (event.formID !== forms.lolife) {
          event.gatherings[0].units.push({
            'taxonConfidence': 'MY.taxonConfidenceSure',
            'recordBasis': 'MY.recordBasisHumanObservation'
          })
        } else {
          event.gatherings[0].units.push({
            'taxonConfidence': 'MY.taxonConfidenceSure',
            'recordBasis': ''
          })
        }
      }

      //add ykjSquareNumber to bird atlas events
      if (event.formID === 'MHL.117' && event.grid.n && event.grid.e) {
        set(event, 'gatherings[0].gatheringFact.ykjSquareNumber', '' + event.grid.n + ':' + event.grid.e)
      }

      delete event.id
      delete event.grid
      if (event.namedPlaceID && event.namedPlaceID === 'empty') {
        delete event.namedPlaceID
        event.gatherings.pop()
      }
      if (event.singleObservation) delete event.singleObservation

    } catch (error: any) {
      captureException(error)
      return Promise.reject({
        severity: 'low',
        message: error.message
      })
    }

    try {
      await postObservationEvent(event, credentials)
    } catch (error: any) {
      if (error.response?.status.toString() === '422') {
        captureException({
          error,
          extra: {
            payload: JSON.stringify(event),
          }
        })
        log.error({
          location: '/stores/observation/actions.tsx uploadObservationEvent()/postObservationEvent()',
          error: error.response.data.error,
          data: event,
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

      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('post failure')} ${error.message}`
      })
    }

    dispatch(clearObservationEventId())

    try {
      await dispatch(deleteObservationEvent(id))
    } catch (error) {
      captureException(error)
      return Promise.reject(error)
    }

    if (localityErrorMessage !== '') {
      return Promise.reject({
        severity: 'low',
        message: localityErrorMessage
      })
    }

    if (imageErrorMessage !== '') {
      return Promise.reject({
        severity: 'low',
        message: imageErrorMessage
      })
    }

    return Promise.resolve()
  }
}

export const newObservationEvent = (newEvent: Record<string, any>): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials, observationEvent } = getState()
    const newEvents = observationEvent.events.concat(newEvent)

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/observation/actions.tsx newObservationEvent()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('could not save new event to long term memory')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
    return Promise.resolve()
  }
}

export const replaceObservationEventById = (newEvent: Record<string, any>, eventId: string): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials, observationEvent } = getState()
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
      return Promise.reject({
        severity: 'low',
        message: i18n.t('could not save event to storage')
      })
    }

    dispatch(replaceObservationEvents(newEvents))

    return Promise.resolve()
  }
}

export const deleteObservationEvent = (eventId: string): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials, observationEvent } = getState()
    const newEvents = observationEvent.events.filter((event: Record<string, any>) => event.id !== eventId)

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/observation/actions.tsx deleteObservationEvent()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('error removing observation event')
      })
    }
    dispatch(replaceObservationEvents(newEvents))
    return Promise.resolve()
  }
}

export const eventPathUpdate = (lineStringPath: LineString | MultiLineString | undefined): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { observationEvent } = getState()

    const newEvents = clone(observationEvent.events)
    const newEvent = cloneDeep(newEvents.pop())

    if (lineStringPath) {
      newEvent.gatherings[0].geometry = lineStringPath

      newEvents.push(newEvent)

      storageService.save('observationEvents', newEvents)
      dispatch(replaceObservationEvents(newEvents))
    }
  }
}

export const newObservation = (unit: Record<string, any>): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials, observationEvent } = getState()

    const events = clone(observationEvent.events)
    const event = cloneDeep(events.pop())

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
      return Promise.reject({
        severity: 'low',
        message: i18n.t('error saving new observation')
      })
    }

    dispatch(replaceObservationEvents(events))
    Promise.resolve()
  }
}

export const deleteObservation = (eventId: string, unitId: string): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials, observationEvent } = getState()
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
      return Promise.reject({
        severity: 'low',
        message: i18n.t('error deleting observation')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
    return Promise.resolve()
  }
}

export const replaceLocationById = (geometry: Geometry, eventId: string, unitId: string): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials, observationEvent } = getState()
    const newEvents = observationEvent.events.map((event: Record<string, any>) => {
      if (event.id === eventId) {
        const newEvent = cloneDeep(event)
        newEvent.gatherings[0].units.forEach((unit: Record<string, any>) => {
          if (unit.id === unitId) {
            unit.unitGathering.geometry = geometry
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
        location: '/stores/observation/actions.tsx replaceLocationById()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('could not save modifications to long term memory')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
    return Promise.resolve()
  }
}

export const replaceObservationById = (newUnit: Record<string, any>, eventId: string, unitId: string): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials, observationEvent } = getState()

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
      return Promise.reject({
        severity: 'low',
        message: i18n.t('error modifying observation')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
    return Promise.resolve()
  }
}

export const initCompleteList = (lang: string, formID: string, gridNumber: string):
  ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials, observationEvent } = getState()

    const mapInformalTaxonGroups = (informalTaxonGroups: Record<string, any>) => {
      return informalTaxonGroups.map((group: any) => {
        return typeof group === 'string' ? group : group.id
      })
    }

    const newEvents = clone(observationEvent.events)
    const newEvent = cloneDeep(newEvents.pop())
    const observations: Record<string, any>[] = []

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
      return Promise.reject({
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
      return Promise.reject({
        severity: 'low',
        message: i18n.t('error saving new observation')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
    Promise.resolve()
  }
}