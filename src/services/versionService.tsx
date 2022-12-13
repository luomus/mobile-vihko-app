import { get } from '../helpers/axiosHelper'
import { versionNumberUrl } from '../config/urls'

export const getVersionNumber = async () => {
  const result = await get(versionNumberUrl, { headers: { 'Cache-Control': 'no-cache' } })
  return result.data
}