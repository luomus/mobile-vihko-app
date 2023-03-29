import { get } from '../helpers/axiosHelper'
import { birdListUrl, completeListUrl, gridNameUrl } from '../config/urls'

export const getBirdList = async () => {
  const result = await get(birdListUrl)
  return result.data
}

export const getCompleteList = async (taxonSetId: string, grid: string) => {
  const result = await get(completeListUrl + '/' + taxonSetId + '/' + grid)
  return result.data
}

export const getGridName = async (gridId: string) => {
  const result = await get(gridNameUrl + gridId)
  return result.data
}