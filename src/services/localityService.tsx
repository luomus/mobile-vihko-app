import { localityUrl, googleGeocodingAPIURL } from '../config/urls'
import { ACCESS_TOKEN, GEOCODING_API_KEY } from 'react-native-dotenv'
import { get, post } from '../helpers/axiosHelper'
import { LineString, MultiLineString, Point } from 'geojson'

export const getLocalityDetailsFromLajiApi = async (geometry: MultiLineString | LineString | Point, lang: string) => {

  const params = {
    'lang': lang,
    'access_token': ACCESS_TOKEN
  }

  const headers = {
    'Accept': 'application/json'
  }

  const result = await post(
    localityUrl,
    geometry,
    {
      params,
      headers
    }
  )

  return {
    result: result.data
  }
}

export const getLocalityDetailsFromGoogleAPI = async (point: Point, lang: string) => {

  const params = {
    'latlng': point.coordinates[1] + ',' + point.coordinates[0],
    'key': GEOCODING_API_KEY,
    'language': lang
  }

  const result = await get(googleGeocodingAPIURL, {
    params
  })

  return result
}