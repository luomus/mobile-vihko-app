import {
  userActionTypes,
  SET_CREDENTIALS,
  CLEAR_CREDENTIALS,
  CredentialsType,
} from './types'
import { ThunkAction } from 'redux-thunk'
import { pollUserLogin } from '../../controllers/userController'
import storageController from '../../controllers/storageController'
import i18n from '../../language/i18n'
import { log } from '../../utilities/logger'

export const loginUser = (tmpToken: string): ThunkAction<Promise<any>, any, void, userActionTypes> => {
  return async dispatch => {
    let credentials: CredentialsType | null = null
    try {
      //start polling for credentials from server, error thrown when timeout of 180 seconds reached,
      //else dispatch to store
      credentials = await pollUserLogin(tmpToken)
      dispatch(setCredentials(credentials))

    //if timeout or other error inform user of error, credentials stay null
    } catch (netError) {
      if (netError.timeout) {
        log.error({
          location: '/stores/user/actions.tsx loginUser()',
          error: netError.response.data.error
        })
        return Promise.reject({
          severity: 'fatal',
          message: i18n.t('login timed out')
        })
      }

      return Promise.reject({
        severity: 'fatal',
        message: i18n.t('failed to load credentials from server')
      })
    }

    //try to save credentials to asyncstorage to remember logged in user after app shutdown
    try {
      storageController.save('credentials', credentials)
      return Promise.resolve()

    //if asyncstorage fails set error as such, allows user to continue anyway
    } catch (locError) {
      log.error({
        location: '/stores/user/actions.tsx loginUser()',
        error: locError
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('failed to save credentials locally')
      })
    }
  }
}

export const logoutUser = (): ThunkAction<Promise<any>, any, void, userActionTypes> => {
  return async dispatch => {
    try {
      storageController.remove('credentials')
      dispatch(clearCredentials())
      return Promise.resolve()

    } catch (error) {
      log.error({
        location: '/stores/user/actions.tsx logoutUser()',
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('failed to remove credentials from local storage')
      })
    }
  }
}

export const initLocalCredentials = (): ThunkAction<Promise<any>, any, void, userActionTypes> => {
  return async dispatch => {
    try {
      const credentials = await storageController.fetch('credentials')

      if (!credentials) {
        return Promise.reject()
      }

      dispatch(setCredentials(credentials))
      return Promise.resolve()
    } catch (error) {
      log.error({
        location: '/stores/user/actions.tsx initLocalCredentials()',
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('failed to load credentials from local')
      })
    }
  }
}

export const setCredentials = (credentials: CredentialsType): userActionTypes => ({
  type: SET_CREDENTIALS,
  payload: credentials,
})

export const clearCredentials = (): userActionTypes => ({
  type: CLEAR_CREDENTIALS
})