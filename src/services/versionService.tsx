import axios from 'axios'
import { versionNumberUrl } from '../config/urls'

export const getVersionNumber = async () => {
  const result = await axios.get(versionNumberUrl, { headers: { 'Cache-Control': 'no-cache' }})
  return result.data
}