import axios from 'axios'
import { ACCESS_TOKEN } from '@env'
import { formPermissionUrl } from '../config/urls'

export const getFormPermissions = async (personToken: string): Promise<{ result: { admins: string[], editors: string[] }}> => {
  let params = {
    'personToken': personToken,
    'access_token': ACCESS_TOKEN
  }

  const result = await axios.get(formPermissionUrl, { params })

  return {
    result: result.data
  }
}