import { accessToken, autocompleteTaxonUrl } from '../config/urls'
import axios from 'axios'

export const getTaxonAutocomplete = async (q: string, lang: string) => {
  const params = {
    'q': q,
    'lang': lang,
    'limit': 10,
    'includePayload': true,
    'access_token': accessToken
  }
  const header = {
    'Accept': 'application/json'
  }

  const result = await axios.get(autocompleteTaxonUrl, {params})
  return result
}