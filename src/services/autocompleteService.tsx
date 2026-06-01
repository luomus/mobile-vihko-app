import lajiApiService from '../api/services/lajiApiService'
import axios from 'axios'

export const getTaxonAutocomplete = async (q: string, filters: Record<string, any> | null, setCancelFn: ((c: () => void) => void) | null) => {
  try {
    let response: any

    if (setCancelFn !== null) {
      const controller = new AbortController()
      setCancelFn(() => controller.abort())
      response = await lajiApiService.getAutocomplete(q, filters ? filters : undefined, controller.signal)
    } else {
      response = await lajiApiService.getAutocomplete(q, filters ? filters : undefined)
    }

    return {
      query: q,
      results: response.results
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      throw { isCanceled: true }
    } else {
      throw error
    }
  }
}
