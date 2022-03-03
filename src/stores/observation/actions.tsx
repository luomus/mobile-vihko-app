import { Point, Geometry, LineString, MultiLineString } from 'geojson'
import { ThunkAction } from 'redux-thunk'
import { clone, cloneDeep } from 'lodash'
import i18n from 'i18next'
import { set } from 'lodash'
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
} from './types'
import { birdList } from '../../config/fields'
import { postObservationEvent } from '../../services/documentService'
import storageService from '../../services/storageService'
import userService from '../../services/userService'
import { netStatusChecker } from '../../helpers/netStatusHelper'
import { createUnitBoundingBox, overlapsFinland } from '../../helpers/geometryHelper'
import { log } from '../../helpers/logger'
import { definePublicity, loopThroughUnits, fetchFinland, fetchForeign } from '../../helpers/uploadHelper'
import { convertMultiLineStringToGCWrappedLineString } from '../../helpers/geoJSONHelper'
import { saveImages } from '../../helpers/imageHelper'
import { temporalOutlierFilter } from '../../helpers/pathFilters'
import { getTaxonAutocomplete } from '../../services/autocompleteService'

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

export const setObservationId = (id: Record<string, any>): observationActionTypes => ({
  type: SET_OBSERVATION_ID,
  payload: id
})

export const clearObservationId = (): observationActionTypes => ({
  type: CLEAR_OBSERVATION_ID
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

export const initObservationEvents = (): ThunkAction<Promise<void>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials } = getState()

    try {
      const observationEvents: Array<Object> = await storageService.fetch('observationEvents')
      if (observationEvents !== null) {
        dispatch(replaceObservationEvents(observationEvents))
        return Promise.resolve()
      }
    } catch (error) {
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
    let units: Record<string, any>[] = event.gatherings[0].units

    //check that internet can be reached
    try {
      await netStatusChecker()
    } catch (error) {
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
          severity: 'low',
          message: i18n.t('user token has expired')
        })
      }
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('failed to check token')} ${error.message}`
      })
    }

    //define whether the event will be released publicly or privately
    event = definePublicity(event, isPublic)

    //define record basis for each unit, depending on whether the unit has images attached,
    //remove empty radius -fields
    //(skip this with flying squirrel form, which has already assigned the record basis)
    if (schema.formID !== 'MHL.45' && event.formID !== 'MHL.117') {
      event = loopThroughUnits(event)
    }

    //remove unused complete list observations from bird atlas events
    if (event.formID === 'MHL.117') {
      let filtered: Record<string, any>[] = []
      units.forEach((observation: Record<string, any>) => {
        if (observation.atlasCode || observation.count) {
          filtered.push(observation)
        }
      })
      units = filtered
    }

    //if there isn't an observation zone, use APIs to get a proper locality name
    //if event geometry overlaps finland, use fetchFinland, else use fetchForeign
    if (!event.namedPlaceID || event.namedPlaceID === '') {
      if (overlapsFinland(event.gatherings[0].geometry)) {
        await fetchFinland(event, lang, credentials)
      } else {
        await fetchForeign(event, lang, credentials)
      }
    }

    //filter out linestring points which are after document endDate and remove timestamps from coordinates,
    //add bounding box or first recorded point as geometry to lolife forms if path gets completly removed
    if (event.gatherings[0].geometry?.type === 'LineString' || event.gatherings[0].geometry?.type === 'MultiLineString') {
      const endDate = event.gatheringEvent.timeEnd ? event.gatheringEvent.dateEnd + 'T' + event.gatheringEvent.timeEnd : event.gatheringEvent.dateEnd
      const geometry = temporalOutlierFilter(event.gatherings[0].geometry, endDate)
      if (geometry) {
        event.gatherings[0].geometry = geometry
      } else {
        if (event.formID !== 'MHL.45') {
          delete event.gatherings[0].geometry
        } else {
          if (event.gatherings[0].units.length >= 1 && event.formID !== 'MHL.117') {
            event.gatherings[0].geometry = createUnitBoundingBox(event)
          } else {
            let firstLocation =
              event.gatherings[0].geometry.type === 'LineString' ?
                event.gatherings[0].geometry.coordinates[0] :
                event.gatherings[0].geometry.coordinates[0][0]

            event.gatherings[0].geometry = {
              coordinates: [
                firstLocation[0],
                firstLocation[1]
              ],
              type: 'Point'
            }
          }
        }
      }
    }

    if (event.gatherings[1]?.geometry?.type === 'LineString' || event.gatherings[1]?.geometry?.type === 'MultiLineString') {
      const geometry = temporalOutlierFilter(event.gatherings[1].geometry, event.gatheringEvent.dateEnd)
      if (geometry) {
        event.gatherings[1].geometry = geometry
      } else {
        if (Object.keys(event.gatherings[1]).length > 1) {
          delete event.gatherings[1].geometry
        } else {
          event.gatherings = [event.gatherings[0]]
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

    //for each observation in observation event try to send images to server
    //using saveImages, and clean out local properties
    try {
      let newUnits = await Promise.all(units.map(async (unit: Record<string, any>) => {
        let newUnit: Record<string, any>
        let newImages

        if (unit.images && unit.images?.length > 0) {
          try {
            newImages = await saveImages(unit.images, credentials)
          } catch (error) {
            return Promise.reject(error)
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

        return Promise.resolve(newUnit)
      }))

      event.gatherings[0].units = newUnits

      if (event.gatherings[0].units.length < 1) {
        if (event.formID !== 'MHL.45') {
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

      delete event.id
      delete event.grid

    } catch (error) {
      return Promise.reject({
        severity: 'low',
        message: error.message
      })
    }

    try {
      await postObservationEvent(event, credentials)
    } catch (error) {
      if (error.response?.status.toString() === '422') {
        log.error({
          location: '/stores/observation/actions.tsx uploadObservationEvent()/postObservationEvent()',
          error: error,
          data: event,
          user_id: credentials.user.id
        })
      } else {
        log.error({
          location: '/stores/observation/actions.tsx uploadObservationEvent()/postObservationEvent()',
          error: error,
          user_id: credentials.user.id
        })
      }

      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('post failure')}  ${error.message}`
      })
    }

    try {
      await dispatch(deleteObservationEvent(id))
    } catch (error) {
      return Promise.reject(error)
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

export const newObservation = (unit: Record<string, any>, lineStringPath: MultiLineString | LineString | undefined): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials, observationEvent } = getState()

    const newEvents = clone(observationEvent.events)
    const newEvent = cloneDeep(newEvents.pop())

    newEvent.gatherings[0].units.push(unit)
    if (lineStringPath) {
      newEvent.gatherings[0].geometry = lineStringPath
    }
    newEvents.push(newEvent)

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
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

    dispatch(replaceObservationEvents(newEvents))
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

export const initCompleteList = (lang: string): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
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

    //fetch taxon details concurrently and initialize bird list observations
    await Promise.all(birdList.map(async (item: Record<string, any>) => {
      let res = await getTaxonAutocomplete('taxon', item.key, null, lang, 1, null)
      let observation = {}
      let name: string = ''
      if (lang === 'fi') {
        name = item.nameFI
      } else if (lang === 'sv') {
        name = item.nameSV
      } else if (lang === 'en') {
        name = item.nameEN
      }
      set(observation, 'id', `complete_list_${uuid.v4()}`)
      set(observation, 'identifications', [{ taxon: name }])
      set(observation, 'informalTaxonGroups', mapInformalTaxonGroups(res.result[0].payload.informalTaxonGroups))
      set(observation, 'unitFact', { autocompleteSelectedTaxonID: res.result[0].key })
      observations.push(observation)
    }))

    //get list or bird names in the correct order
    const nameList = birdList.map((bird) => {
      if (lang === 'fi') {
        return bird.nameFI
      } else if (lang === 'sv') {
        return bird.nameSV
      } else if (lang === 'en') {
        return bird.nameEN
      }
    })

    //sort the observations based on the correct order
    observations.sort((a, b) => {
      return nameList.indexOf(a.identifications[0].taxon) - nameList.indexOf(b.identifications[0].taxon)
    })

    newEvent.gatherings[0].units = observations
    newEvents.push(newEvent)

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
      log.error({
        location: '/stores/observation/actions.tsx saveBirdList()',
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