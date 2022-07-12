import ApolloClient, { gql } from 'apollo-boost'
import axios from 'axios'
import i18n from '../languages/i18n'
import { graphqlUrl, postDocumentUrl } from '../config/urls'
import { ACCESS_TOKEN } from '@env'
import { CredentialsType } from '../stores'

interface BasicObject {
  [key: string]: any
}

const setClient = (language: string) => {
  return new ApolloClient({
    uri: graphqlUrl,
    request: (operation) => {
      operation.setContext({
        headers: {
          'Authorization': ACCESS_TOKEN,
          'Accept-Language': language
        }
      })
    }
  })
}

export const getSchemas = async (language: string, formId: string) => {
  const client = setClient(language)
  const query = gql`
    query {
      form(id: "${formId}") {
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

export const postObservationEvent = async (observationEvent: BasicObject, credentials: CredentialsType) => {
  if (!credentials.token) {
    throw new Error(`${i18n.t('credentials missing')}`)
  }

  const params = {
    personToken: credentials.token,
    access_token: ACCESS_TOKEN,
    validationErrorFormat: 'remote'
  }

  await axios.post(postDocumentUrl, observationEvent, { params })
}