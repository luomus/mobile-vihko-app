import axios from 'axios'
import { getLoginUrl, pollLoginUrl, getUserUrl, personTokenUrl } from '../config/urls'
import { accessToken } from '../config/keys'
import { CredentialsType } from '../stores'

export const getTempTokenAndLoginUrl = async () => {
  const params = {
    'access_token': accessToken
  }
  const result = await axios.get(getLoginUrl, { params })

  return result.data
}

export const postTmpToken = async (tmpToken: string) => {
  const params = {
    'tmpToken': tmpToken,
    'access_token': accessToken
  }
  try {
    const result = await axios.post(pollLoginUrl, null, { params })
    //successfully received the token
    return result.data
  } catch (error) {
    //did not get the token in this poll
    return { token: undefined }
  }
}

export const getUserByPersonToken = async (personToken: string) => {
  const params = {
    'access_token': accessToken
  }
  const fetchResult = await axios.get(getUserUrl + '/' + personToken, { params })
  return fetchResult.data
}

export const pollUserLogin = async (tmpToken: string) => {
  let poller: NodeJS.Timeout
  let timeout: NodeJS.Timeout

  let userPromise = new Promise<CredentialsType>((resolve, reject) => {
    //starts a 180 second timout which stops above polling interval
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
          const userData = await getUserByPersonToken(result.token)
          clearInterval(poller)
          clearTimeout(timeout)
          resolve({
            user: userData,
            token: result.token,
          })
        } catch (error) {
          clearInterval(poller)
          clearTimeout(timeout)
          reject(error)
        }
      }
    }, 3000)
  })

  return userPromise
}

export const checkTokenValidity = async (personToken: string) => {
  const params = {
    'access_token': accessToken
  }
  const result = await axios.get(personTokenUrl + '/' + personToken, { params })

  return result.data
}

export const logout = async (credentials: CredentialsType) => {
  const params = {
    'access_token': accessToken
  }
  const result = await axios.delete(personTokenUrl + '/' + credentials.token, { params })

  return result.data
}

export default { getTempTokenAndLoginUrl, postTmpToken, getUserByPersonToken, checkTokenValidity, logout }