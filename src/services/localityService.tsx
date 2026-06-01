import { googleGeocodingAPIURL } from '../config/urls'
import Config from '../config/env'
import { get } from '../helpers/axiosHelper'
import { Point } from 'geojson'

export const getLocalityDetailsFromGoogleAPI = async (point: Point, lang: string) => {

  const params = {
    'latlng': point.coordinates[1] + ',' + point.coordinates[0],
    'key': Config.GEOCODING_API_KEY,
    'language': lang
  }

  const result = await get(googleGeocodingAPIURL, {
    params
  })

  return result
}