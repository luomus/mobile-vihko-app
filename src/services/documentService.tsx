import { get, post } from '../helpers/axiosHelper'
import i18n from '../languages/i18n'
import { documentsUrl, formsUrl } from '../config/urls'
import Config from '../config/env'
import { CredentialsType } from '../stores'

export const getSchemas = async (language: string, formId: string) => {
  const params = {
    access_token: Config.ACCESS_TOKEN,
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
    access_token: Config.ACCESS_TOKEN
  }

  await post(documentsUrl, observationEvent, { params })
}

export const getSentEvents = async (credentials: CredentialsType) => {
  const params = {
    'personToken': credentials.token,
    'access_token': Config.ACCESS_TOKEN,
    'pageSize': 10,
    'sourceID': Config.SOURCE_ID,
    'selectedFields': 'id,formID,dateCreated,publicityRestrictions'
  }

  const result = await get(documentsUrl, { params })
  return result.data.results
}