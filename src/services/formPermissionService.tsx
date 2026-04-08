import { get } from '../helpers/axiosHelper'
import Config from '../config/env'
import { formPermissionUrl } from '../config/urls'

export const getFormPermissions = async (personToken: string): Promise<Record<string, any>> => {
  const params = {
    'personToken': personToken,
    'access_token': Config.ACCESS_TOKEN
  }

  const result = await get(formPermissionUrl, { params })
  return result.data
}