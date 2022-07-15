import axios from 'axios'
import { ACCESS_TOKEN } from 'react-native-dotenv'
import { getZonesUrl } from '../config/urls'

export const getZones = async () => {
  const params = {
    'collectionID': 'HR.2951',
    'includePublic': true,
    'includeUnits': false,
    'access_token': ACCESS_TOKEN,
    'pageSize': 1000
  }

  const fetchResult = await axios.get(getZonesUrl, { params })
  return fetchResult.data.results
}