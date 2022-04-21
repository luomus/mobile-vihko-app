import axios from 'axios'
import { birdListUrl, gridNameUrl } from '../config/urls'

export const getBirdList = async () => {
  const result = await axios.get(birdListUrl)
  return result.data
}

export const getGridName = async (gridId: string) => {
  const result = await axios.get(gridNameUrl + gridId)
  return result.data
}