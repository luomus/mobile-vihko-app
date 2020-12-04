import { accessToken, autocompleteUrl } from '../config/urls'
import axios, { Canceler } from 'axios'

const CancelToken = axios.CancelToken

export const getTaxonAutocomplete = async (target: string, q: string, lang: string, cancel: undefined | Canceler) => {

  const params = {
    'q': q,
    'lang': lang,
    'limit': 5,
    'includePayload': true,
    'matchType': 'exact,partial',
    'access_token': accessToken
  }

  const headers = {
    'Accept': 'application/json'
  }

  const result = await axios.get(autocompleteUrl + target, {
    params,
    headers,
    cancelToken: new CancelToken((c) => {
      cancel = c
    }),
  })

  return {
    query: q,
    result: result.data
  }
}