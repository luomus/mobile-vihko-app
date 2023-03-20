import { ACCESS_TOKEN } from 'react-native-dotenv'
import { getNewsUrl } from '../config/urls'
import { get } from '../helpers/axiosHelper'

export const getNews = async (lang: string, tag: string) => {
  const params = {
    access_token: ACCESS_TOKEN,
    lang,
    tag,
    page: 1
  }

  const result = await get(getNewsUrl, { params })

  return result.data
}