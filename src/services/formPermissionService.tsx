import { get } from '../helpers/axiosHelper'
import { ACCESS_TOKEN } from 'react-native-dotenv'
import { formPermissionUrl } from '../config/urls'

export const getFormPermissions = async (personToken: string): Promise<Record<string, any>> => {
  const params = {
    'personToken': personToken,
    'access_token': ACCESS_TOKEN
  }

  const result = await get(formPermissionUrl, { params })
  return result.data
}