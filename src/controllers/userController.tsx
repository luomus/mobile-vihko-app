import axios from 'axios'
import { getLoginUrl, pollLoginUrl, getUserUrl } from '../config/urls'
import { CredentialsType } from '../stores/user/types'

export const getTempTokenAndLoginUrl = async () => {
  const url = getLoginUrl
  const result = await axios.get(url)

  return result.data
}

export const postTmpToken = async (tmpToken: string) => {
  const url = pollLoginUrl.replace('$TEMPTOKEN', tmpToken)
  try {
    const result = await axios.post(url)
    //successfully received the token
    return result.data
  } catch (error) {
    //did not get the token in this poll
    return { token: undefined }
  }
}

export const getUserByPersonToken = async (personToken: string) => {
  const url = getUserUrl.replace('$TOKEN', personToken)
  const fetchResult = await axios.get(url)
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

export default { getTempTokenAndLoginUrl, postTmpToken, getUserByPersonToken }