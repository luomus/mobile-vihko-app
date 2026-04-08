import { get, post, axiosDelete } from '../helpers/axiosHelper'
import { getLoginUrl, pollLoginUrl, getUserUrl, personTokenUrl } from '../config/urls'
import Config from '../config/env'
import { CredentialsType } from '../stores'
import { captureException } from '../helpers/sentry'

export const getTempTokenAndLoginUrl = async () => {
  const params = {
    'access_token': Config.ACCESS_TOKEN
  }
  const result = await get(getLoginUrl, { params })

  return result.data
}

export const postTmpToken = async (tmpToken: string) => {
  const params = {
    'tmpToken': tmpToken,
    'access_token': Config.ACCESS_TOKEN
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
    'access_token': Config.ACCESS_TOKEN
  }
  const fetchResult = await get(getUserUrl + '/' + personToken, { params })
  return fetchResult.data
}

export const pollUserLogin = async (tmpToken: string, setCanceler: any) => {
  let poller: ReturnType<typeof setInterval>
  let timeout: ReturnType<typeof setTimeout>

  const userPromise = new Promise<CredentialsType> ((resolve, reject) => {
    const poll = async () => {
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
    }

    //starts a 180 second timeout which stops above polling interval
    timeout = setTimeout(() => {
      clearInterval(poller)
      reject({
        timeout: true
      })
    }, 180000)

    //poll immediately, then every 3 seconds
    poll()
    poller = setInterval(poll, 3000)

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
    'access_token': Config.ACCESS_TOKEN
  }

  const result = await get(personTokenUrl + '/' + personToken, { params })
  if (Config.SOURCE_ID && result.data.target !== Config.SOURCE_ID) throw new Error('WRONG SOURCE')

  return result.data
}

export const getProfile = async (personToken: string) => {
  const params = {
    'access_token': Config.ACCESS_TOKEN
  }
  const result = await get(getUserUrl + '/' + personToken + '/profile', { params })

  return result.data
}

export const logout = async (credentials: CredentialsType) => {
  const params = {
    'access_token': Config.ACCESS_TOKEN
  }
  const result = await axiosDelete(personTokenUrl + '/' + credentials.token, { params })

  return result.data
}

export default { getTempTokenAndLoginUrl, postTmpToken, getUserByPersonToken, getTokenValidity, getProfile, logout }