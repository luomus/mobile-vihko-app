import axios from 'axios'
import { postImageUrl } from '../config/urls'
import { accessToken } from '../config/keys'

export const sendImages = async (formDataBody: FormData, token: string) => {
  return await axios.post(
    postImageUrl,
    formDataBody,
    {
      params: {
        'personToken': token,
        'access_token': accessToken
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
        'access_token': accessToken
      },
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      }
    }
  )
}