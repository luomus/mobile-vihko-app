import { get } from '../helpers/axiosHelper'
import { completeListUrl, gridNameUrl } from '../config/urls'

export const getCompleteList = async (taxonSetId: string, grid: string) => {
  const result = await get(completeListUrl + '/' + taxonSetId + '/' + grid)
  return result.data
}

export const getGridName = async (gridId: string) => {
  const result = await get(gridNameUrl + gridId)
  return result.data
}