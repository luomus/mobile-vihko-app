import moment from 'moment'
import lajiApiService from '../api/services/lajiApiService'
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

export const fetchLocality = async (event: Record<string, any>, credentials: CredentialsType) => {
  const geometry = event.gatherings[0].geometry
  let locality

  try {
    locality = await lajiApiService.postCoordinates(geometry)
  } catch (error: any) {
    captureException(error)
    log.error({
      location: '/stores/observation/actions.tsx defineLocality()',
      error: error,
      user_id: credentials.user?.id
    })
    return Promise.reject({
      severity: 'low',
      message: `${i18n.t('locality failure')} ${error.message}`
    })
  }

  if (locality.status === 'INVALID_REQUEST') {
    log.error({
      location: '/stores/observation/actions.tsx defineLocality()',
      error: locality.error_message,
      data: geometry,
      user_id: credentials.user?.id
    })
    return Promise.reject({
      severity: 'low',
      message: `${i18n.t('locality failure')} ${locality.error_message}`
    })
  }

  if (!locality || locality.status === 'ZERO_RESULTS') {
    return
  }

  let biologicalProvince = ''
  let country = ''
  let municipality = ''
  let administrativeProvince = ''

  locality.results.forEach((result: Record<string, any>) => {
    if (result.types[0] === 'biogeographicalProvince') {
      if (biologicalProvince === '') {
        biologicalProvince = result.formatted_address
      } else {
        biologicalProvince = biologicalProvince + ', ' + result.formatted_address
      }
    } else if (result.types[0] === 'country') {
      if (country === '') {
        country = result.formatted_address
      } else {
        country = country + ', ' + result.formatted_address
      }
    } else if (result.types[0] === 'municipality') {
      if (municipality === '') {
        municipality = result.formatted_address
      } else {
        municipality = municipality + ', ' + result.formatted_address
      }
    }
  })

  if (!biologicalProvince) {
    const administrativeProvinceArray: Array<string> = []
    const countryArray: Array<string> = []
    const municipalityArray: Array<string> = []

    //loop through results and add provinces, countries and municipalities to the arrays, without duplicates
    locality.results.forEach((result: Record<string, any>) => {
      result.address_components.forEach((component: Record<string, any>) => {
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
    administrativeProvince = administrativeProvinceArray.join(', ')
    country = countryArray.join(', ')
    municipality = municipalityArray.join(', ')
  }

  const localityFields: Record<string, string> = {}
  if (biologicalProvince) localityFields.biologicalProvince = biologicalProvince
  if (country) localityFields.country = country
  if (municipality) localityFields.municipality = municipality
  if (administrativeProvince) locality.administrativeProvince = administrativeProvince

  const gatherings = [
    {
      ...event.gatherings[0],
      ...localityFields
    },
    ...event.gatherings.slice(1)
  ]

  return {
    ...event,
    gatherings
  }
}
