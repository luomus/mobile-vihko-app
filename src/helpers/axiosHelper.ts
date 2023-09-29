import axios from 'axios'
import { log } from './logger'
import { captureException } from './sentry'
import { autocompleteUrl, pollLoginUrl } from '../config/urls'

export const get = async (url: string, config?: object) => {
  try {
    const promise = config ? axios.get(url, config) : axios.get(url)
    return await promise
  } catch (error) {
    if (url !== pollLoginUrl && url !== autocompleteUrl) {
      log.error({
        location: '/helpers/axiosHelper.ts get(' + url + ',' + config + ')',
        error: error
      })
      captureException(error)
    }
    throw error
  }
}

export const post = async (url: string, data: any, config?: object) => {
  try {
    const promise = config ? axios.post(url, data, config) : axios.post(url, data)
    return await promise
  } catch (error) {
    log.error({
      location: '/helpers/axiosHelper.ts post(' + url + ',' + data + ',' + config + ')',
      error: error
    })
    captureException(error)
    throw error
  }
}

export const axiosDelete = async (url: string, config?: object) => {
  try {
    const promise = config ? axios.delete(url, config) : axios.delete(url)
    return await promise
  } catch (error) {
    log.error({
      location: '/helpers/axiosHelper.ts delete(' + url + ',' + config + ')',
      error: error
    })
    captureException(error)
    throw error
  }
}