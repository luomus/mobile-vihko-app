import { accessToken, localityUrl } from '../config/urls'
import axios from 'axios'
import { LineString } from 'geojson'

export const getLocalityDetails = async (geometry: LineString, lang: string) => {

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