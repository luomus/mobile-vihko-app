import { autocompleteUrl } from '../config/urls'
import { ACCESS_TOKEN } from 'react-native-dotenv'
import axios, { AxiosResponse, Canceler } from 'axios'

const CancelToken = axios.CancelToken

export const getTaxonAutocomplete = async (target: string, q: string, filters: Record<string, any> | null, lang: string, limit: number, setCancelToken: ((c: Canceler) => void) | null) => {
  let params = {
    'q': q,
    'lang': lang,
    'limit': 5,
    'includePayload': true,
    'matchType': 'exact,partial',
    'includeHidden': false,
    'excludeNameTypes': 'MX.hasMisappliedName,MX.hasMisspelledName,MX.hasUncertainSynonym,MX.hasOrthographicVariant',
    'access_token': ACCESS_TOKEN
  }

  if (filters) {
    params = {
      ...filters,
      ...params,
    }
  }

  const headers = {
    'Accept': 'application/json'
  }

  try {
    let result: AxiosResponse<any>

    if (setCancelToken !== null) {
      result = await axios.get(autocompleteUrl + target, {
        params,
        headers,
        cancelToken: new CancelToken((c) => setCancelToken(c))
      })
    } else {
      result = await axios.get(autocompleteUrl + target, {
        params,
        headers
      })
    }

    return {
      query: q,
      result: result.data
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      throw { isCanceled: true }
    } else {
      throw error
    }
  }
}