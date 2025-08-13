import axios from 'axios'
import { loggerUrl } from '../config/urls'
import { ACCESS_TOKEN } from 'react-native-dotenv'
import { brand, modelName, osName, osVersion } from 'expo-device'
import AppJSON from '../../app.json'
// import { captureException } from '../helpers/sentry'

export const sendError = async (rawMsg: {error: string|undefined, data: string|undefined, location: string|undefined, user_id: string|undefined}) => {

  const errorData = {
    message: rawMsg ? rawMsg.toString() : 'Unknown error.',
    meta: {
      data: rawMsg.data ? rawMsg.data : 'No data.',
      location: rawMsg.location ? rawMsg.location : 'No location.',
      user_id: rawMsg.user_id ? rawMsg.user_id : 'No user id.',
      device_info: brand + ' ' + modelName + ' / ' + osName + ' ' + osVersion,
      version: AppJSON.expo.version
    }
  }

  try {
    return await axios.post(
      loggerUrl,
      errorData,
      {
        params: {
          access_token: ACCESS_TOKEN
        }
      }
    )
  } catch (e) {
    // captureException(e)
  }
}