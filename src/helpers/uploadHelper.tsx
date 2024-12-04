import { Point, LineString, MultiLineString } from 'geojson'
import moment from 'moment'
import { getLocalityDetailsFromLajiApi, getLocalityDetailsFromGoogleAPI } from '../services/localityService'
import { centerOfBoundingBox, centerOfGeometry } from './geometryHelper'
import { log } from '../helpers/logger'
import i18n from 'i18next'
import { CredentialsType } from '../stores'
import { captureException } from './sentry'

//define whether the event will be released publicly or privately
export const definePublicity = (event: Record<string, any>, isPublic: boolean): Record<string, any> => {
  let publicityRestrictions: string = ''

  if (isPublic) {
    publicityRestrictions = 'MZ.publicityRestrictionsPublic'
  } else {
    publicityRestrictions = 'MZ.publicityRestrictionsPrivate'
  }

  return {
    ...event,
    publicityRestrictions
  }
}

export const loopThroughUnits = (event: Record<string, any>): Record<string, any> => {
  event.gatherings[0].units.forEach((unit: Record<string, any>) => {
    if (unit.images && unit.images.length > 0) {
      unit.recordBasis = 'MY.recordBasisHumanObservationPhoto'
    } else {
      unit.recordBasis = 'MY.recordBasisHumanObservation'
    }
    if (unit.unitGathering.geometry.radius === '') {
      delete unit.unitGathering.geometry.radius
    }
    if (!unit.unitGathering.dateBegin || !(moment(unit.unitGathering.dateBegin).isValid())) {
      delete unit.unitGathering.dateBegin
    }
  })

  const gatherings = [
    { ...event.gatherings[0], units: event.gatherings[0].units },
    ...event.gatherings.slice(1)
  ]

  return {
    ...event,
    gatherings
  }
}

export const loopThroughBirdUnits = (event: Record<string, any>): Record<string, any> => {
  const units = event.gatherings[0].units

  units.forEach((unit: Record<string, any>) => {
    if (unit.scientificName) {
      delete unit.scientificName
    }
    if (unit.taxonomicOrder) {
      delete unit.taxonomicOrder
    }
  })

  const gatherings = [
    { ...event.gatherings[0], units },
    ...event.gatherings.slice(1)
  ]

  return {
    ...event,
    gatherings
  }
}

//calls the helper function for fetching and processing locality details for finnish events
export const fetchFinland = async (event: Record<string, any>, lang: string, credentials: CredentialsType) => {
  let localityDetails
  try {
    localityDetails = await defineLocalityInFinland(event.gatherings[0].geometry, lang, credentials)
  } catch (error: any) {
    return Promise.reject({
      severity: error.severity,
      message: error.message
    })
  }

  //if it turns out that country wasn't finland, fetch foreign
  if (!localityDetails) {
    return
  } else if (localityDetails.status === 'fail') {
    await fetchForeign(event, lang, credentials)
  } else {
    const gatherings = [
      {
        ...event.gatherings[0],
        biologicalProvince: localityDetails.biologicalProvince,
        country: localityDetails.country,
        municipality: localityDetails.municipality
      },
      ...event.gatherings.slice(1)
    ]

    return {
      ...event,
      gatherings
    }
  }
}

//calls the helper function for fetching and processing locality details for foreign country events
export const fetchForeign = async (event: Record<string, any>, lang: string, credentials: CredentialsType) => {
  const boundingBox: Point | null = centerOfGeometry(event.gatherings[0].geometry, event.gatherings[0].units)

  //can't fetch foreign, unless there's a geometry for the event
  if (!boundingBox) { return }

  //foreign country details are fetched based on the center point of combined bounding box
  const center = centerOfBoundingBox(boundingBox)
  let localityDetails
  try {
    localityDetails = await defineLocalityForeign(center, lang, credentials)
  } catch (error: any) {
    return Promise.reject({
      severity: error.severity,
      message: error.message
    })
  }

  const gatherings = [
    {
      ...event.gatherings[0],
      biologicalProvince: localityDetails.biologicalProvince,
      country: localityDetails.country,
      municipality: localityDetails.municipality
    },
    ...event.gatherings.slice(1)
  ]

  return {
    ...event,
    gatherings
  }
}

//if observation event was made in finland, this function will be called
//and it processes the localities fetched from laji-api
export const defineLocalityInFinland = async (geometry: MultiLineString | LineString | Point, lang: string,
  credentials: CredentialsType): Promise<Record<string, string>> => {

  let localityDetails

  //call the service to fetch from Laji API
  try {
    localityDetails = await getLocalityDetailsFromLajiApi(geometry, lang)
  } catch (error: any) {
    captureException(error)
    log.error({
      location: '/stores/observation/actions.tsx defineLocalityInFinland()',
      error: error,
      user_id: credentials.user?.id
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

  if (localityDetails.result.status === 'INVALID_REQUEST') {
    // captureException(localityDetails.result.error_message)
    log.error({
      location: '/stores/observation/actions.tsx defineLocalityInFinland()',
      error: localityDetails.result.error_message,
      data: geometry,
      user_id: credentials.user?.id
    })
    return Promise.reject({
      severity: 'low',
      message: `${i18n.t('locality failure')} ${localityDetails.result.error_message}`
    })
  }

  //store list of provinces and municipalities in string variables
  let biologicalProvince = ''
  const country: string = i18n.t('finland') //because country is always finland here, just use the translation
  let municipality = ''

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
export const defineLocalityForeign = async (geometry: Point, lang: string, credentials: CredentialsType): Promise<Record<string, string>> => {

  let localityDetails

  //call the service to fetch from Google Geocoding API
  try {
    const response = await getLocalityDetailsFromGoogleAPI(geometry, lang)
    localityDetails = response.data.results
  } catch (error: any) {
    captureException(error)
    log.error({
      location: '/stores/observation/actions.tsx defineLocalityForeign()',
      error: error,
      user_id: credentials.user?.id
    })
    return Promise.reject({
      severity: 'low',
      message: `${i18n.t('locality failure')} ${error.message}`
    })
  }

  //store list of provinces, countries and municipalities in string arrays
  const administrativeProvinceArray: Array<string> = []
  const countryArray: Array<string> = []
  const municipalityArray: Array<string> = []

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
  const administrativeProvince: string = administrativeProvinceArray.join(', ')
  const country: string = countryArray.join(', ')
  const municipality: string = municipalityArray.join(', ')

  return {
    administrativeProvince: administrativeProvince,
    country: country,
    municipality: municipality,
  }
}