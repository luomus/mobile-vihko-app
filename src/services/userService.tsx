import lajiApiService from '../api/services/lajiApiService'
import { CredentialsType } from '../stores'
import { captureException } from '../helpers/sentry'

export const pollUserLogin = async (tmpToken: string, setCanceler: any) => {
  let poller: ReturnType<typeof setInterval>
  let timeout: ReturnType<typeof setTimeout>

  const userPromise = new Promise<CredentialsType> ((resolve, reject) => {
    const poll = async () => {
      let result
      try {
        result = await lajiApiService.postLoginCheck(tmpToken)
      } catch (error) {
        //did not get the token in this poll
        result = { token: undefined }
      }
      if (result.token) {
        try {
          await lajiApiService.getAuthenticationEvent(result.token)
          const userData = await lajiApiService.getPerson(result.token)
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
