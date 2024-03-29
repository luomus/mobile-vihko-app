import {
  userActionTypes,
  SET_CREDENTIALS,
  CLEAR_CREDENTIALS,
  CredentialsType,
} from './types'
import { ThunkAction } from 'redux-thunk'
import userService, { getProfile, pollUserLogin } from '../../services/userService'
import { getFormPermissions } from '../../services/formPermissionService'
import storageService from '../../services/storageService'
import i18n from '../../languages/i18n'
import { stopLocationAsync } from '../../helpers/geolocationHelper'
import { log } from '../../helpers/logger'
import { captureException } from '../../helpers/sentry'

export const loginUser = (tmpToken: string, setCanceler: any): ThunkAction<Promise<any>, any, void, userActionTypes> => {
  return async dispatch => {

    let credentials: CredentialsType

    try {
      //start polling for credentials from server, error thrown when timeout of 180 seconds reached,
      //else dispatch credetials to store
      credentials = await pollUserLogin(tmpToken, setCanceler)
      dispatch(setCredentials(credentials))

      //in case of error, credentials stay null
    } catch (error: any) {
      if (error.canceled) {
        return Promise.reject({ canceled: true })
      }

      if (error.timeout) {
        log.error({
          location: '/stores/user/actions.tsx loginUser()',
          error: error
        })
        return Promise.reject({
          severity: 'fatal',
          message: i18n.t('login timed out'),
          user_id: 'undefined'
        })
      }

      if (error.message?.includes('INVALID TOKEN')) {
        return Promise.reject({
          severity: 'low',
          message: i18n.t('user token has expired')
        })
      }

      if (error.message?.includes('WRONG SOURCE')) {
        return Promise.reject({
          severity: 'fatal',
          message: i18n.t('person token is given for a different app')
        })
      }

      //error from server
      captureException(error)
      log.error({
        location: '/stores/user/actions.tsx loginUser()',
        error: error,
        user_id: 'undefined'
      })
      return Promise.reject({
        severity: 'fatal',
        message: `${i18n.t('failed to load credentials from server')} ${error.message}`
      })
    }

    //try to save credentials to asyncstorage to remember logged in user after app shutdown
    try {
      await storageService.save('credentials', credentials)

      //if asyncstorage fails, set error as such, allows user to continue anyway
    } catch (locError) {
      captureException(locError)
      log.error({
        location: '/stores/user/actions.tsx loginUser()',
        error: locError,
        user_id: 'undefined'
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('failed to save credentials locally')
      })
    }

    return Promise.resolve()
  }
}

export const getPermissions = (): ThunkAction<Promise<any>, any, void, userActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials } = getState()

    let permissionsArr = []

    //try to fetch users form permissions to join into the credentials
    try {
      const permissions = await getFormPermissions(credentials.token)
      permissionsArr = [...permissions.admins, ...permissions.editors]

    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/stores/user/actions.tsx getPermissions()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('failed to load permissions')} ${error.message}`
      })
    }

    const newCredentials = {
      ...credentials,
      permissions: permissionsArr
    }

    dispatch(setCredentials(newCredentials))

    //try to save credentials to asyncstorage to remember logged in user after app shutdown
    try {
      await storageService.save('credentials', newCredentials)

      //if asyncstorage fails set error as such, allows user to continue anyway
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/user/actions.tsx getPermissions()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('failed to save credentials locally')
      })
    }

    return Promise.resolve()
  }
}

export const getMetadata = (): ThunkAction<Promise<any>, any, void, userActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials } = getState()

    let metadata

    //try to get users media metadata
    try {
      const profile = await getProfile(credentials.token)
      metadata = profile.settings?.defaultMediaMetadata

    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/stores/user/actions.tsx getMetadata()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('failed to load metadata')} ${error.message}`
      })
    }

    const newCredentials = {
      ...credentials,
      metadata
    }

    dispatch(setCredentials(newCredentials))

    //try to save credentials to asyncstorage to remember logged in user after app shutdown
    try {
      await storageService.save('credentials', newCredentials)

      //if asyncstorage fails set error as such, allows user to continue anyway
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/user/actions.tsx getMetadata()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('failed to save credentials locally')
      })
    }

    return Promise.resolve()
  }
}

export const logoutUser = (): ThunkAction<Promise<any>, any, void, userActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials, observing } = getState()

    const credentialsCopy = credentials

    //stop recording when logging out
    if (observing) {
      await stopLocationAsync()
    }

    //clear credentials
    try {
      storageService.remove('credentials')
      dispatch(clearCredentials())

    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/user/actions.tsx logoutUser()',
        error: error,
        user_id: credentials.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('failed to remove credentials from local storage')
      })
    }

    if (!credentialsCopy.token) return Promise.resolve // don't try to log out if there's no token

    //logout from the API
    try {
      await userService.logout(credentialsCopy)

    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/stores/user/actions.tsx logoutUser()',
        error: error,
        user_id: credentialsCopy.user.id
      })
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('failed to logout from laji.fi server')} ${error.message}`
      })
    }

    return Promise.resolve
  }
}

export const initLocalCredentials = (): ThunkAction<Promise<any>, any, void, userActionTypes> => {
  return async dispatch => {
    let credentials

    try {
      credentials = await storageService.fetch('credentials')

      //managed to fetch credentials from storage, but user was not logged in
      if (!credentials) {
        return Promise.reject()
      }

      //failed to fetch credentials from storage
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/user/actions.tsx initLocalCredentials()',
        error: error,
        user_id: 'undefined'
      })
      return Promise.reject({
        severity: 'high',
        message: i18n.t('failed to load credentials from local')
      })
    }

    dispatch(setCredentials(credentials))

    return Promise.resolve()
  }
}

export const setCredentials = (credentials: CredentialsType): userActionTypes => ({
  type: SET_CREDENTIALS,
  payload: credentials,
})

export const clearCredentials = (): userActionTypes => ({
  type: CLEAR_CREDENTIALS
})