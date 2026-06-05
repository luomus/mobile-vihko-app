import axios from 'axios'
import Config from '../config/env'

const createClient = (baseURL: string, defaultHeaders: Record<string, string> = {}) =>
  axios.create({
    baseURL,
    headers: defaultHeaders
  })

export const lajiApi = createClient(Config.API_URL)
export const atlasApi = createClient(Config.ATLAS_API_URL)
