import { get, post, axiosDelete } from '../helpers/axiosHelper'
import { getLoginUrl, pollLoginUrl, getUserUrl, personTokenUrl } from '../config/urls'
import { ACCESS_TOKEN, SOURCE_ID } from 'react-native-dotenv'
import { CredentialsType } from '../stores'
import { captureException } from '../helpers/sentry'
import { createAsyncThunk } from '@reduxjs/toolkit'
import i18n from '../languages/i18n'
import { log } from '../helpers/logger'

interface checkTokenValidityParams {
  credentials: CredentialsType
}

export const getTempTokenAndLoginUrl = async () => {
  const params = {
    'access_token': ACCESS_TOKEN
  }
  const result = await get(getLoginUrl, { params })

  return result.data
}

export const postTmpToken = async (tmpToken: string) => {
  const params = {
    'tmpToken': tmpToken,
    'access_token': ACCESS_TOKEN
  }
  //headers are required here to prevent 400 error until new API is finished
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': undefined
  }
  try {
    const result = await post(pollLoginUrl, null, { params, headers })
    //successfully received the token
    return result.data
  } catch (error) {
    //did not get the token in this poll
    return { token: undefined }
  }
}

export const getUserByPersonToken = async (personToken: string) => {
  const params = {
    'access_token': ACCESS_TOKEN
  }
  const fetchResult = await get(getUserUrl + '/' + personToken, { params })
  return fetchResult.data
}

export const pollUserLogin = async (tmpToken: string, setCanceler: any) => {
  let poller: NodeJS.Timeout
  let timeout: NodeJS.Timeout

  const userPromise = new Promise<CredentialsType> ((resolve, reject) => {
    //starts a 180 second timeout which stops above polling interval
    timeout = setTimeout(() => {
      clearInterval(poller)
      reject({
        timeout: true
      })
    }, 180000)

    //polls user token from server every 3 seconds until token is not null
    poller = setInterval(async () => {
      const result = await postTmpToken(tmpToken)
      if (result.token) {
        try {
          await getTokenValidity(result.token)
          const userData = await getUserByPersonToken(result.token)
          clearInterval(poller)
          clearTimeout(timeout)
          resolve({
            user: userData,
            token: result.token,
          })
        } catch (error) {
          captureException(error)
          clearInterval(poller)
          clearTimeout(timeout)
          reject(error)
        }
      }
    }, 3000)

    setCanceler(() => () => {
      clearInterval(poller)
      clearTimeout(timeout)
      reject({
        canceled: true
      })
    })
  })

  return userPromise
}

export const getTokenValidity = async (personToken: string) => {
  const params = {
    'access_token': ACCESS_TOKEN
  }

  const result = await get(personTokenUrl + '/' + personToken, { params })

  if (SOURCE_ID && result.data.target !== SOURCE_ID) throw new Error('WRONG SOURCE')

  return result.data
}

export const checkTokenValidity = createAsyncThunk<void, checkTokenValidityParams, { rejectValue: Record<string, any> }>(
  'userService/checkTokenValidity',
  async ({ credentials }, { rejectWithValue }) => {
    try {
      if (!credentials.token) {
        return rejectWithValue({
          severity: 'high',
          message: i18n.t('user token is missing')
        })
      }
      await getTokenValidity(credentials.token)
      return
    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/services/userService.tsx checkTokenValidity()',
        error: error,
        user_id: credentials.user?.id
      })
      if (error.message?.includes('INVALID TOKEN')) {
        return rejectWithValue({
          severity: 'high',
          message: i18n.t('user token has expired')
        })
      }
      if (error.message?.includes('WRONG SOURCE')) {
        return rejectWithValue({
          severity: 'high',
          message: i18n.t('person token is given for a different app')
        })
      }
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to check token')} ${error.message}`
      })
    }
  }
)

export const getProfile = async (personToken: string) => {
  const params = {
    'access_token': ACCESS_TOKEN
  }
  const result = await get(getUserUrl + '/' + personToken + '/profile', { params })

  return result.data
}

export const logout = async (credentials: CredentialsType) => {
  const params = {
    'access_token': ACCESS_TOKEN
  }
  const result = await axiosDelete(personTokenUrl + '/' + credentials.token, { params })

  return result.data
}

export default { getTempTokenAndLoginUrl, postTmpToken, getUserByPersonToken, checkTokenValidity, getProfile, logout }