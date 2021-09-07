import axios from 'axios'
import { accessToken } from '../config/keys'
import { getZonesUrl } from '../config/urls'

const getZones = async () => {
  const params = {
    'collectionID': 'HR.2951',
    'includePublic': true,
    'includeUnits': false,
    'access_token': accessToken
  }

  const fetchResult = await axios.get(getZonesUrl, { params })
  return fetchResult.data.results
}

export default { getZones }