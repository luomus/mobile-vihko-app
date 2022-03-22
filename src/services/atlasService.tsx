import axios from 'axios'
import { gridNameUrl } from '../config/urls'

export const getGridName = async (gridId: string) => {
  const result = await axios.get(gridNameUrl + gridId)
  return result.data
}