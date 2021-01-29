import { autocompleteUrl } from '../config/urls'
import { accessToken } from '../config/keys'
import axios, { Canceler } from 'axios'

const CancelToken = axios.CancelToken

export const getTaxonAutocomplete = async (target: string, q: string, filters: Record<string, any> | null, lang: string, setCancelToken: (c: Canceler) => void) => {
  let params = {
    'q': q,
    'lang': lang,
    'limit': 5,
    'includePayload': true,
    'matchType': 'exact,partial',
    'includeHidden': false,
    'excludeNameTypes': 'MX.hasMisappliedName,MX.hasMisspelledName,MX.hasUncertainSynonym,MX.hasOrthographicVariant',
    'access_token': accessToken
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
    const result = await axios.get(autocompleteUrl + target, {
      params,
      headers,
      cancelToken: new CancelToken((c) => setCancelToken(c)),
    })

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