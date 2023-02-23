import ApolloClient, { gql } from 'apollo-boost'
import { get, post } from '../helpers/axiosHelper'
import i18n from '../languages/i18n'
import { graphqlUrl, postDocumentUrl, sentDocumentsUrl } from '../config/urls'
import { ACCESS_TOKEN, SOURCE_ID } from 'react-native-dotenv'
import { CredentialsType } from '../stores'
import AppJSON from '../../app.json'

const setClient = (language: string) => {
  return new ApolloClient({
    uri: graphqlUrl,
    request: (operation) => {
      operation.setContext({
        headers: {
          'Authorization': ACCESS_TOKEN,
          'Accept-Language': language,
          'User-Agent': 'Mobiilivihko/' + AppJSON.expo.version
        }
      })
    }
  })
}

export const getSchemas = async (language: string, formId: string) => {
  const client = setClient(language)
  const query = gql`
    query {
      form(id: "${formId}", format: "schema") {
        schema
        uiSchema
      }
    }
  `

  const response = await client.query({ query })
  if (response.data) {
    return response.data.form
  } else if (response.errors) {
    throw response.errors
  }
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

  await post(postDocumentUrl, observationEvent, { params })
}

export const getSentEvents = async (credentials: CredentialsType) => {
  const params = {
    'format': 'json',
    'aggregateBy': 'document.createdDate,document.documentId,document.formId',
    'orderBy': 'document.createdDate DESC',
    'pageSize': 5,
    'sourceId': SOURCE_ID,
    'editorId': credentials.user?.id,
    'editorPersonToken': credentials.token,
    'access_token': ACCESS_TOKEN
  }

  const result = await get(sentDocumentsUrl, { params })
  return result.data.results
}