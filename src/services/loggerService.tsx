import axios from 'axios'
import { loggerUrl } from '../config/urls'
import { accessToken } from '../config/keys'
import { brand, modelName, osName, osVersion } from 'expo-device'

export const sendError = async (error: string, user_id: string) => {

  const errorData = {
    'message': error,
    'meta': {
      'user_id': user_id,
      'device_info': brand + ' ' + modelName + ' / ' + osName + ' ' + osVersion
    }
  }
  console.log(errorData)
  return await axios.post(
    loggerUrl,
    errorData,
    {
      params: {
        'access_token': accessToken
      }
    }
  )
}