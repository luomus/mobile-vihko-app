import { post } from '../helpers/axiosHelper'
import { postImageUrl } from '../config/urls'
import { ACCESS_TOKEN } from 'react-native-dotenv'

export const sendImages = async (formDataBody: FormData, token: string) => {
  return await post(
    postImageUrl,
    formDataBody,
    {
      params: {
        'personToken': token,
        'access_token': ACCESS_TOKEN
      },
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
  )
}

export const sendMetadata = async (tempId: string, metadata: object, token: string) => {
  return await post(
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