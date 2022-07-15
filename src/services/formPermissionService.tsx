import axios from 'axios'
import { ACCESS_TOKEN } from 'react-native-dotenv'
import { formPermissionUrl } from '../config/urls'

export const getFormPermissions = async (personToken: string): Promise<Record<string, any>> => {
  let params = {
    'personToken': personToken,
    'access_token': ACCESS_TOKEN
  }

  const result = await axios.get(formPermissionUrl, { params })
  return result.data
}