import axios from 'axios'
import { getZonesUrl } from '../config/urls'

const getZones = async () => {
  const url = getZonesUrl
  const fetchResult = await axios.get(url)
  return fetchResult.data.results
}

export default { getZones }