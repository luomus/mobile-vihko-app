import { Point, Geometry, LineString } from 'geojson'
import { Store } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { clone, cloneDeep } from 'lodash'
import i18n from 'i18next'
import {
  observationActionTypes,
  SET_OBSERVATION,
  CLEAR_OBSERVATION,
  TOGGLE_OBSERVING,
  SET_OBSERVATION_EVENT_FINISHED,
  SET_OBSERVATION_EVENT_INTERRUPTED,
  REPLACE_OBSERVATION_EVENTS,
  CLEAR_OBSERVATION_EVENTS,
  SET_OBSERVATION_ID,
  CLEAR_OBSERVATION_ID,
  SET_SCHEMA
} from './types'
import { getSchemas, postObservationEvent } from '../../services/documentService'
import storageService from '../../services/storageService'
import { CredentialsType } from '../user/types'
import { parseUiSchemaToObservations } from '../../parsers/UiSchemaParser'
import { saveMedias } from '../../services/imageService'
import { netStatusChecker } from '../../utilities/netStatusCheck'
import { overlapsFinland } from '../../utilities/geometryCreator'
import { log } from '../../utilities/logger'
import { definePublicity, defineRecordBasis, fetchFinland, fetchForeign } from './helpers'

export const setObservationLocation = (point: Point | null): observationActionTypes => ({
  type: SET_OBSERVATION,
  payload: point,
})

export const clearObservationLocation = (): observationActionTypes => ({
  type: CLEAR_OBSERVATION
})

export const toggleObserving = (): observationActionTypes => ({
  type: TOGGLE_OBSERVING
})

export const setSchema = (schemas: Record<string, any>): observationActionTypes => ({
  type: SET_SCHEMA,
  payload: schemas
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

export const eventPathUpdate = (store: Store, lineStringPath: LineString | null): void => {
  const { observationEvent } = store.getState()

  const newEvents = clone(observationEvent.events)
  const newEvent = cloneDeep(newEvents.pop())

  if (lineStringPath) {
    newEvent.gatherings[0].geometry = lineStringPath

    newEvents.push(newEvent)

    storageService.save('observationEvents', newEvents)
    store.dispatch(replaceObservationEvents(newEvents))
  }
}

export const removeDuplicatesFromPath = (lineStringCoordinates: Array<Array<number>>): Array<Array<number>> => {
  let uniqueCoordinates: Array<Array<number>> = []

  //loop through each point in path's LineString
  lineStringCoordinates.forEach((point: Array<number>) => {
    let noDuplicates: boolean = true
    //use same decimals for all coordinates
    const coord0: number = Number(point[0].toFixed(5))
    const coord1: number = Number(point[1].toFixed(5))
    //check that the point isn't a duplicate of any of the unique coordinates
    uniqueCoordinates.forEach((uniquePoint: Array<number>) => {
      const uniqueCoord0: number = Number(uniquePoint[0].toFixed(5))
      const uniqueCoord1: number = Number(uniquePoint[1].toFixed(5))
      if (coord0 === uniqueCoord0 && coord1 === uniqueCoord1) {
        noDuplicates = false
      }
    })
    //if no duplicates were found, push the point to be a unique coordinate
    if (noDuplicates) {
      uniqueCoordinates.push(point)
    }
  })

  return uniqueCoordinates
}

export const initObservationEvents = (): ThunkAction<Promise<void>, any, void, observationActionTypes> => {
  return async dispatch => {
    try {
      const observationEvents: Array<Object> = await storageService.fetch('observationEvents')
      if (observationEvents !== null) {
        dispatch(replaceObservationEvents(observationEvents))
        return Promise.resolve()
      }
    } catch (error) {
      log.error({
        location: '/stores/observation/actions.tsx initObservationEvents()',
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('error on loading observation events, overwrite risk')
      })
    }
  }
}

export const uploadObservationEvent = (id: string, credentials: CredentialsType, lang: string, isPublic: boolean): ThunkAction<Promise<void>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { observationEvent } = getState()

    let event = cloneDeep(observationEvent.events.find((event: Record<string, any>) => event.id === id))
    let units = event.gatherings[0].units

    //check that internet can be reached
    try {
      await netStatusChecker()
    } catch (error) {
      log.error({
        location: '/stores/observation/actions.tsx uploadObservationEvent()',
        error: error.response.data.error
      })
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('post failure')} ${error.message}`
      })
    }

    //define whether the event will be released publicly or privately
    event = definePublicity(event, isPublic)

    //define record basis for each unit, depending on whether the unit has images attached
    event = defineRecordBasis(event)

    //if event geometry overlaps finland, use fetchFinland, else use fetchForeign
    if (overlapsFinland(event.gatherings[0].geometry)) {
      await fetchFinland(event, lang)
    } else {
      await fetchForeign(event, lang)
    }

    // //for each observation in observation event try to send images to server
    // //using saveMedias, and clean out local properties
    try {
      let newUnits = await Promise.all(units.map(async (unit: Record<string, any>) => {
        let newUnit: Record<string, any>
        let newImages

        if (unit.images?.length > 0) {
          try {
            newImages = await saveMedias(unit.images, credentials)
          } catch (error) {
            log.error({
              location: '/stores/observation/actions.tsx uploadObservationEvent()',
              error: error
            })
            return Promise.reject({
              severity: 'low',
              message: error.message
            })
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
      delete event.id

    } catch (error) {
      log.error({
        location: '/stores/observation/actions.tsx uploadObservationEvent()',
        error: 'Image error'
      })
      return Promise.reject({
        severity: 'low',
        message: error.message
      })
    }

    try {
      await postObservationEvent(event, credentials)
    } catch (error) {
      log.error({
        location: '/stores/observation/actions.tsx uploadObservationEvent()',
        error: error.response.data.error
      })
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('post failure')}: ${error.response.status}`
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
    const { observationEvent } = getState()
    const newEvents = observationEvent.events.concat(newEvent)

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
    return Promise.resolve()
  }
}

export const replaceObservationEventById = (newEvent: Record<string, any>, eventId: string): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { observationEvent } = getState()
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
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('could not save modifications to long term memory, discarding modifications')
      })
    }

    dispatch(replaceObservationEvents(newEvents))

    return Promise.resolve()
  }
}

export const replaceObservationEvents = (events: Record<string, any>[]): observationActionTypes => ({
  type: REPLACE_OBSERVATION_EVENTS,
  payload: events
})

export const deleteObservationEvent = (eventId: string): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { observationEvent } = getState()
    const newEvents = observationEvent.events.filter((event: Record<string, any>) => event.id !== eventId)

    try {
      await storageService.save('observationEvents', newEvents)
    } catch (error) {
      log.error({
        location: '/stores/observation/actions.tsx deleteObservationEvent()',
        error: error
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

export const clearObservationEvents = (): observationActionTypes => ({
  type: CLEAR_OBSERVATION_EVENTS
})

export const newObservation = (unit: Record<string, any>, lineStringPath: LineString | null): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { observationEvent } = getState()

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
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('could not save modifications to long term memory, discarding modifications')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
    Promise.resolve()
  }
}

export const deleteObservation = (eventId: string, unitId: string): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { observationEvent } = getState()
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
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('could not save modifications to long term memory discarding modifications')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
    return Promise.resolve()
  }
}

export const replaceLocationById = (geometry: Geometry, eventId: string, unitId: string): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { observationEvent } = getState()
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
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('could not save modifications to long term memory discarding modifications')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
    return Promise.resolve()
  }
}

export const replaceObservationById = (newUnit: Record<string, any>, eventId: string, unitId: string): ThunkAction<Promise<any>, any, void, observationActionTypes> => {
  return async (dispatch, getState) => {
    const { observationEvent } = getState()

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
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('could save modifications to long term memory discarding modifications')
      })
    }

    dispatch(replaceObservationEvents(newEvents))
    return Promise.resolve()
  }
}

export const initSchema = (useUiSchema: boolean, formId: string): ThunkAction<Promise<void>, any, void, observationActionTypes> => {
  return async dispatch => {
    let languages: string[] = ['fi', 'en', 'sv']
    let schemas: Record<string, any> = {
      formID: formId,
      fi: null,
      en: null,
      sv: null
    }
    let storageKeys: Record<string, string> = {
      fi: `${formId}Fi`,
      en: `${formId}En`,
      sv: `${formId}Sv`
    }

    //try to load schemas from server, else case if error try to load schemas
    //from internal storage
    let errors: Record<string, any>[] = []
    let errorFatal: Record<string, boolean> = {
      fi: false,
      en: false,
      sv: false
    }

    //loop over each language initializing field parameters for each and schema for first existing
    for (let lang of languages) {
      let tempSchemas = null
      let langError: Record<string, string> | null = null

      try {
        //check network status and try loading schema and uiSchema from server
        await netStatusChecker()
        tempSchemas = await getSchemas(lang, formId)
      } catch (netError) {
        try {
          //try loading schema from internal storage, if success inform user
          //of use of old stored version, if error warn user of total failure
          tempSchemas = await storageService.fetch(storageKeys[lang])

          //warn user of using internally stored schema
          langError = {
            severity: 'low',
            message: `${netError.message
              ? netError.message
              : i18n.t('status code') + netError.response.status
            } ${i18n.t(`error loading ${lang} schema from server`)}`
          }
          log.error({
            location: '/stores/observation/actions.tsx initSchema()',
            error: netError.response.data.error,
            details: 'While downloading ' + lang + ' schema.'
          })
        } catch (locError) {
          langError = {
            severity: 'high',
            message: `${netError.message
              ? netError.message
              : i18n.t('status code') + netError.response.status
            } ${i18n.t(`error loading ${lang} schema from server and internal`)}`
          }
          log.error({
            location: '/stores/observation/actions.tsx initSchema()',
            error: locError,
            details: 'While fetching ' + lang + ' from AsyncStorage.'
          })

          errors.push(langError)
          errorFatal[lang] = true
          continue
        }
      }

      //schema was found try to parse necessary parameters and values for input creation from it
      if (tempSchemas) {
        let uiSchemaParams

        if (useUiSchema) {
          uiSchemaParams = parseUiSchemaToObservations(tempSchemas.uiSchema)

          //if parsing fails warn user that language is unusable
          if (!uiSchemaParams) {
            errors.push({
              severity: 'high',
              message: i18n.t(`could not parse ${lang} uiSchema to input`)
            })

            errorFatal[lang] = true
            continue
          }
        }

        //try to store schema to internal storage for use as backup, if schemas are from server (i.e. first try-catch has not set any error),
        //if fails set error message
        if (!langError) {
          try {
            await storageService.save(storageKeys[lang], tempSchemas)
          } catch (error) {
            langError = {
              severity: 'low',
              message: i18n.t(`${lang} schema save to async failed`)
            }
            log.error({
              location: '/stores/observation/actions.tsx initSchema()',
              error: error,
              details: 'While saving ' + lang + ' to AsyncStorage.'
            })
          }
        }
        //if error was met push into errors-array for eventual return to user
        if (langError) {
          errors.push(langError)
        }

        if (useUiSchema) {
          schemas[lang] = {
            schema: tempSchemas.schema,
            uiSchemaParams: uiSchemaParams
          }
        } else {
          schemas[lang] = {
            schema: tempSchemas.schema,
          }
        }
      }
    }

    //check if every language suffered fatal errors resulting in no usable schemas or form parameter collections
    if (Object.keys(errorFatal).every(key => errorFatal[key])) {
      let fatalError: Record<string, any> = [{
        severity: 'fatal',
        message: i18n.t('could not load any schemas')
      }]

      errors = errors.concat(fatalError)

      return Promise.reject(errors)
    }

    //schema and field parameters to correct language choice
    dispatch(setSchema(schemas))

    //if non-fatal errors present reject and send errors
    if (errors.length > 0) {
      return Promise.reject(errors)
    }
    return Promise.resolve()
  }
}

export const switchSchema = (formId: string): ThunkAction<Promise<void>, any, void, observationActionTypes> => {
  return async dispatch => {
    let languages: string[] = ['Fi', 'En', 'Sv']

    let schemas: Record<string, any> = {
      formID: formId,
      fi: null,
      en: null,
      sv: null
    }

    for (let lang of languages) {
      schemas[lang.toLowerCase()] = await storageService.fetch(`${formId}${lang}`)
    }

    dispatch(setSchema(schemas))
    Promise.resolve()
  }
}