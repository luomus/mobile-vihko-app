import lajiApiService from '../api/services/lajiApiService'
import { brand, modelName, osName, osVersion } from 'expo-device'
import AppJSON from '../../app.json'
// import { captureException } from '../helpers/sentry'

export const sendError = async (rawMsg: {error: string|undefined, data: string|undefined, location: string|undefined, user_id: string|undefined}) => {

  const errorData = {
    message: rawMsg ? JSON.stringify(rawMsg) : 'Unknown error.',
    meta: {
      data: rawMsg.data ? rawMsg.data : 'No data.',
      location: rawMsg.location ? rawMsg.location : 'No location.',
      user_id: rawMsg.user_id ? rawMsg.user_id : 'No user id.',
      device_info: brand + ' ' + modelName + ' / ' + osName + ' ' + osVersion,
      version: AppJSON.expo.version
    }
  }

  try {
    return await lajiApiService.postError(errorData)
  } catch (e) {
    // captureException(e)
  }
}