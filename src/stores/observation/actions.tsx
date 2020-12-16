import { Point, Polygon, Geometry, LineString } from 'geojson'
import { ThunkAction } from 'redux-thunk'
import { clone, cloneDeep } from 'lodash'
import i18n from 'i18next'
import {
  observationActionTypes,
  SET_OBSERVATION,
  CLEAR_OBSERVATION,
  TOGGLE_OBSERVING,
  REPLACE_OBSERVATION_EVENTS,
  CLEAR_OBSERVATION_EVENTS,
  SET_OBSERVATION_ID,
  CLEAR_OBSERVATION_ID,
  SET_SCHEMA,
} from './types'
import { getSchemas, postObservationEvent } from '../../controllers/documentController'
import { getLocalityDetailsFromLajiApi, getLocalityDetailsFromGoogleAPI } from '../../controllers/localityController'
import storageController from '../../controllers/storageController'
import { CredentialsType } from '../user/types'
import { parseUiSchemaToObservations } from '../../parsers/UiSchemaParser'
import { saveMedias } from '../../controllers/imageController'
import { netStatusChecker } from '../../utilities/netStatusCheck'
import { overlapsFinland, centerOfBoundingBox, createCombinedGeometry } from '../../utilities/geometryCreator'
import { Store } from 'redux'
import { log } from '../../utilities/logger'

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

export const eventPathUpdate = (store: Store, lineStringPath: LineString | null): void => {
  const { observationEvent } = store.getState()

  const newEvents = clone(observationEvent.events)
  const newEvent = cloneDeep(newEvents.pop())

  if (lineStringPath) {
    newEvent.gatherings[0].geometry = lineStringPath

    newEvents.push(newEvent)

    storageController.save('observationEvents', newEvents)
    store.dispatch(replaceObservationEvents(newEvents))
  }
}

//if observation event was made in finland, this function will be called
//and it processes the localities fetched from laji-api
export const defineLocalityInFinland = async (geometry: LineString | Point, lang: string): Promise<Record<string, string>> => {

  let localityDetails

  //call the controller to fetch from Laji API
  try {
    localityDetails = await getLocalityDetailsFromLajiApi(geometry, lang)
  } catch (error) {
    log.error({
      location: '/stores/observation/actions.tsx defineLocalityInFinland()',
      error: error.response.data.error
    })
    return Promise.reject({
      severity: 'low',
      message: `${i18n.t('locality failure')} ${error.message}`
    })
  }

  //if no response, return status: 'fail' so it can be handled in uploadObservationEvent -action
  if (localityDetails.result.status === 'ZERO_RESULTS') {
    return {
      status: 'fail'
    }
  }

  //store list of provinces and municipalities in string variables
  let biologicalProvince: string = ''
  let country: string = i18n.t('finland') //because country is always finland here, just use the translation
  let municipality: string = ''

  //loop through results and add provinces and municipalities to the list, separated by commas
  localityDetails.result.results.forEach((result: Record<string, any>) => {
    if (result.types[0] === 'biogeographicalProvince') {
      if (biologicalProvince === '') {
        biologicalProvince = result.formatted_address
      } else {
        biologicalProvince = biologicalProvince + ', ' + result.formatted_address
      }
    } else if (result.types[0] === 'municipality') {
      if (municipality === '') {
        municipality = result.formatted_address
      } else {
        municipality = municipality + ', ' + result.formatted_address
      }
    }
  })

  return {
    biologicalProvince: biologicalProvince,
    country: country,
    municipality: municipality,
  }
}

//if observation event was made in a foreign country, this function will be called
//and it processes the localities fetched from google geocoding api
export const defineLocalityForeign = async (geometry: Point, lang: string): Promise<Record<string, string>> => {

  let localityDetails

  //call the controller to fetch from Google Geocoding API
  try {
    const response = await getLocalityDetailsFromGoogleAPI(geometry, lang)
    localityDetails = response.data.results
  } catch (error) {
    log.error({
      location: '/stores/observation/actions.tsx defineLocalityForeign()',
      error: error.response.data.error
    })
    return Promise.reject({
      severity: 'low',
      message: `${i18n.t('locality failure')} ${error.message}`
    })
  }

  //store list of provinces, countries and municipalities in string arrays
  let administrativeProvinceArray: Array<string> = []
  let countryArray: Array<string> = []
  let municipalityArray: Array<string> = []

  //loop through results and add provinces, countries and municipalities to the arrays, without duplicates
  localityDetails.forEach((point: Record<string, any>) => {
    point.address_components.forEach((component: Record<string, any>) => {
      component.types.forEach((type: string) => {
        if (type === 'administrative_area_level_1') {
          if (!administrativeProvinceArray.includes(component.long_name)) {
            administrativeProvinceArray.push(component.long_name)
          }
        } else if (type === 'country') {
          if (!countryArray.includes(component.long_name)) {
            countryArray.push(component.long_name)
          }
        } else if (type === 'administrative_area_level_2' || type === 'administrative_area_level_3') {
          if (!municipalityArray.includes(component.long_name)) {
            municipalityArray.push(component.long_name)
          }
        }
      })
    })
  })

  //form strings separated by commas from the arrays
  let administrativeProvince: string = administrativeProvinceArray.join(', ')
  let country: string = countryArray.join(', ')
  let municipality: string = municipalityArray.join(', ')

  return {
    administrativeProvince: administrativeProvince,
    country: country,
    municipality: municipality,
  }
}

export const initObservationEvents = (): ThunkAction<Promise<void>, any, void, observationActionTypes> => {
  return async dispatch => {
    try {
      const observationEvents: Array<Object> = await storageController.fetch('observationEvents')
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

//define record basis for each unit, depending on whether the unit has images attached
const defineRecordBasis = (event: Record<string, any>): Record<string, any> => {

  let modifiedEvent: Record<string, any> = event

  modifiedEvent.gatherings[0].units.forEach((unit: Record<string, any>) => {
    if (unit.images.length > 0) {
      unit.recordBasis = 'MY.recordBasisHumanObservationPhoto'
    } else {
      unit.recordBasis = 'MY.recordBasisHumanObservation'
    }
  })

  return modifiedEvent
}

export const uploadObservationEvent = (id: string, credentials: CredentialsType, lang: string): ThunkAction<Promise<void>, any, void, observationActionTypes> => {
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

    //define record basis for each unit, depending on whether the unit has images attached
    event = defineRecordBasis(event)

    //calls the helper function for fetching and processing locality details for finnish events
    const fetchFinland = async () => {
      const localityDetails = await defineLocalityInFinland(event.gatherings[0].geometry, lang)

      //if it turns out that country wasn't finland, fetch foreign
      if (localityDetails.status === 'fail') {
        await fetchForeign(event)
      } else {
        //inserts the fetched values to the event
        event.gatherings[0].biologicalProvince = localityDetails.biologicalProvince
        event.gatherings[0].country = localityDetails.country
        event.gatherings[0].municipality = localityDetails.municipality
      }
    }

    //calls the helper function for fetching and processing locality details for foreign country events
    const fetchForeign = async () => {
      const boundingBox: Polygon | Point | null = createCombinedGeometry(event)

      //can't fetch foreign, unless there's a geometry for the event
      if (!boundingBox) { return }

      //foreign country details are fetched based on the center point of combined bounding box
      const center = centerOfBoundingBox(boundingBox)
      const localityDetails = await defineLocalityForeign(center, lang)

      //inserts the fetched values to the event
      event.gatherings[0].administrativeProvince = localityDetails.administrativeProvince
      event.gatherings[0].country = localityDetails.country
      event.gatherings[0].municipality = localityDetails.municipality
    }

    //if event geometry overlaps finland, use fetchFinland, else use fetchForeign
    if (overlapsFinland(event.gatherings[0].geometry)) {
      await fetchFinland()
    } else {
      await fetchForeign()
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
      await storageController.save('observationEvents', newEvents)
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
      await storageController.save('observationEvents', newEvents)
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
      await storageController.save('observationEvents', newEvents)
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
      await storageController.save('observationEvents', newEvents)
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
      await storageController.save('observationEvents', newEvents)
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
      await storageController.save('observationEvents', newEvents)
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
      await storageController.save('observationEvents', newEvents)
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

export const initSchema = (useUiSchema: boolean): ThunkAction<Promise<void>, any, void, observationActionTypes> => {
  return async dispatch => {
    let languages: string[] = ['fi', 'en', 'sv']
    let schemas: Record<string, any> = {
      'fi': null,
      'en': null,
      'sv': null
    }
    let storageKeys: Record<string, string> = {
      fi: 'schemaFi',
      en: 'schemaEn',
      sv: 'schemaSv'
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
        tempSchemas = await getSchemas(lang)
      } catch (netError) {
        try {
          //try loading schema from internal storage, if success inform user
          //of use of old stored version, if error warn user of total failure
          tempSchemas = await storageController.fetch(storageKeys[lang])

          //warn user of using internally stored schema
          langError = {
            severity: 'low',
            message: `${i18n.t(`error loading ${lang} schemas from server`)} ${netError.message
              ? netError.message
              : i18n.t('status code') + netError.response.status
            }`
          }
          log.error({
            location: '/stores/observation/actions.tsx initSchema()',
            error: netError.response.data.error,
            details: 'While downloading ' + lang + ' schema.'
          })
        } catch (locError) {
          langError = {
            severity: 'high',
            message: `${i18n.t(`error loading ${lang} schemas from server and internal`)} ${netError.message
              ? netError.message
              : i18n.t('status code') + netError.response.status
            }`
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
            await storageController.save(storageKeys[lang], tempSchemas)
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
    dispatch(setSchema({ schemas }))

    //if non-fatal errors present reject and send errors
    if (errors.length > 0) {
      return Promise.reject(errors)
    }
    return Promise.resolve()
  }
}

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