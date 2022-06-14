import axios from 'axios'
import { loggerUrl } from '../config/urls'
import { accessToken } from '../config/keys'
import { brand, modelName, osName, osVersion } from 'expo-device'
import AppJSON from '../../app.json'

export const sendError = async (rawMsg: {}) => {

  const errorData = {
    message: rawMsg.error ? rawMsg.error.toString() : 'Unknown error.',
    meta: {
      data: rawMsg.data ? rawMsg.data : 'No data.',
      location: rawMsg.location ? rawMsg.location : 'No location.',
      user_id: rawMsg.user_id ? rawMsg.user_id : 'No user id.',
      device_info: brand + ' ' + modelName + ' / ' + osName + ' ' + osVersion,
      version: AppJSON.expo.version
    }
  }

  return await axios.post(
    loggerUrl,
    errorData,
    {
      params: {
        access_token: accessToken
      }
    }
  )
}