import ApolloClient, { gql } from 'apollo-boost'
import axios from 'axios'
import i18n from '../language/i18n'
import { graphqlUrl, postDocumentUrl, accessToken } from '../config/urls'
import { CredentialsType } from '../stores/user/types'

interface BasicObject {
  [key: string]: any
}

const setClient = (language: string) => {
  return new ApolloClient({
    uri: graphqlUrl,
    request: (operation) => {
      operation.setContext({
        headers: {
          'Authorization': accessToken,
          'Accept-Language': language
        }
      })
    }
  })
}

export const getSchemas = async (language: string) => {
  const client = setClient(language)
  const query = gql`
    query {
      form(id: "JX.519") {
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
    access_token: accessToken,
    validationErrorFormat: 'remote'
  }

  await axios.post(postDocumentUrl, observationEvent, { params })
}