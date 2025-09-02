import { get, post } from '../helpers/axiosHelper'
import i18n from '../languages/i18n'
import { documentsUrl, formsUrl } from '../config/urls'
import { ACCESS_TOKEN, SOURCE_ID } from 'react-native-dotenv'
import { CredentialsType } from '../stores'

export const getSchemas = async (language: string, formId: string) => {
  const params = {
    access_token: ACCESS_TOKEN,
    lang: language
  }

  const response = await get(formsUrl + '/' + formId, { params })
  return response.data
}

export const postObservationEvent = async (observationEvent: Record<string, any>, credentials: CredentialsType) => {
  if (!credentials.token) {
    throw new Error(`${i18n.t('credentials missing')}`)
  }

  const params = {
    personToken: credentials.token,
    access_token: ACCESS_TOKEN,
    validationErrorFormat: 'remote'
  }

  await post(documentsUrl, observationEvent, { params })
}

export const getSentEvents = async (credentials: CredentialsType) => {
  const params = {
    'personToken': credentials.token,
    'access_token': ACCESS_TOKEN,
    'pageSize': 10,
    'sourceID': SOURCE_ID,
    'selectedFields': 'id,formID,dateCreated,publicityRestrictions'
  }

  const result = await get(documentsUrl, { params })
  return result.data.results
}