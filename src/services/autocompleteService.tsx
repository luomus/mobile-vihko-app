import { autocompleteUrl } from '../config/urls'
import Config from '../config/env'
import { get } from '../helpers/axiosHelper'
import axios, { AxiosResponse } from 'axios'

export const getTaxonAutocomplete = async (target: string, q: string, filters: Record<string, any> | null, lang: string, limit: number, setCancelFn: ((c: () => void) => void) | null) => {
  let params = {
    'q': q,
    'lang': lang,
    'limit': 5,
    'includePayload': true,
    'matchType': 'exact,partial',
    'includeHidden': false,
    'excludeNameTypes': 'MX.hasMisappliedName,MX.hasMisspelledName,MX.hasUncertainSynonym,MX.hasOrthographicVariant',
    'access_token': Config.ACCESS_TOKEN
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

    if (setCancelFn !== null) {
      const controller = new AbortController()
      setCancelFn(() => controller.abort())
      result = await get(autocompleteUrl + target, {
        params,
        headers,
        signal: controller.signal
      })
    } else {
      result = await get(autocompleteUrl + target, {
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