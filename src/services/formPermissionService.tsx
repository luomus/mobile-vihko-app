import axios from 'axios'
import { accessToken } from '../config/keys'
import { formPermissionUrl } from '../config/urls'

export const getFormPermissions = async (personToken: string) => {
  let params = {
    'personToken': personToken,
    'access_token': accessToken
  }

  const result = await axios.get(formPermissionUrl, { params })

  return {
    result: result.data
  }
}