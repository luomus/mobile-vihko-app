import { accessToken, localityUrl, googleGeocodingAPIURL } from '../config/urls'
import axios from 'axios'
import { Polygon, Point } from 'geojson'
import { geocodingAPIKey } from '../config/keys'

export const getLocalityDetails = async (geometry: Polygon | Point, lang: string) => {

  const params = {
    'lang': lang,
    'access_token': accessToken
  }

  const headers = {
    'Accept': 'application/json'
  }

  const result = await axios.post(
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
    'key': geocodingAPIKey,
    'language': lang
  }

  const result = await axios.get(googleGeocodingAPIURL, {
    params
  })

  return result
}