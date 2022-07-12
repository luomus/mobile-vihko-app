import axios from 'axios'
import { postImageUrl } from '../config/urls'
import { ACCESS_TOKEN } from '@env'

export const sendImages = async (formDataBody: FormData, token: string) => {
  return await axios.post(
    postImageUrl,
    formDataBody,
    {
      params: {
        'personToken': token,
        'access_token': ACCESS_TOKEN
      }
    }
  )
}

export const sendMetadata = async (tempId: string, metadata: object, token: string) => {
  return await axios.post(
    postImageUrl + '/' + tempId,
    JSON.stringify(metadata),
    {
      params: {
        'personToken': token,
        'access_token': ACCESS_TOKEN
      },
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      }
    }
  )
}