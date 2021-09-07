import {
  userActionTypes,
  SET_CREDENTIALS,
  CLEAR_CREDENTIALS,
  CredentialsType,
} from './types'
import { ThunkAction } from 'redux-thunk'
import userService, { pollUserLogin } from '../../services/userService'
import { getFormPermissions } from '../../services/formPermissionService'
import storageService from '../../services/storageService'
import i18n from '../../languages/i18n'
import { log } from '../../helpers/logger'

export const loginUser = (tmpToken: string, setCanceler: any): ThunkAction<Promise<any>, any, void, userActionTypes> => {
  return async dispatch => {
    let credentials: CredentialsType | null = null
    try {
      //start polling for credentials from server, error thrown when timeout of 180 seconds reached,
      //else dispatch to store
      credentials = await pollUserLogin(tmpToken, setCanceler)
      dispatch(setCredentials(credentials))

      //if timeout or other error inform user of error, credentials stay null
    } catch (netError) {
      if (netError.canceled) {
        return Promise.reject({ canceled: true })
      }
      if (!netError.timeout) {
        log.error({
          location: '/stores/user/actions.tsx loginUser()',
          error: netError.response.data.error
        })
        return Promise.reject({
          severity: 'fatal',
          message: i18n.t('failed to load credentials from server')
        })
      }

      return Promise.reject({
        severity: 'fatal',
        message: i18n.t('login timed out')
      })
    }

    //try to fetch users form permissions to join into the credentials
    try {
      const permissions = await getFormPermissions(credentials.token)
      const permissionsArr = [ ...permissions.result.admins, ...permissions.result.editors ]

      credentials.permissions = permissionsArr

    } catch (error) {
      log.error({
        location: '/stores/user/actions.tsx loginUser()',
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('failed to load permissions')
      })
    }

    //try to save credentials to asyncstorage to remember logged in user after app shutdown
    try {
      storageService.save('credentials', credentials)
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
  return async (dispatch, getState) => {
    const { credentials } = getState()

    try {
      storageService.remove('credentials')
      dispatch(clearCredentials())

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

    try {
      await userService.logout(credentials)

    } catch (error) {
      log.error({
        location: '/stores/user/actions.tsx logoutUser()',
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('failed to logout from laji.fi server')
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

      if (!credentials) {
        return Promise.reject()
      }

    } catch (error) {
      log.error({
        location: '/stores/user/actions.tsx initLocalCredentials()',
        error: error
      })
      return Promise.reject({
        severity: 'high',
        message: i18n.t('failed to load credentials from local')
      })
    }

    //loading and saving user's form permissions to storage
    try {
      const permissions = await getFormPermissions(credentials.token)
      const permissionsArr = [ ...permissions.result.admins, ...permissions.result.editors ]

      credentials.permissions = permissionsArr

    } catch (error) {
      log.error({
        location: '/stores/user/actions.tsx getUserPermissions()',
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('failed to update permissions')
      })
    }

    dispatch(setCredentials(credentials))

    try {
      storageService.save('credentials', credentials)

      //if asyncstorage fails set error as such, allows user to continue anyway
    } catch (error) {
      log.error({
        location: '/stores/user/actions.tsx initLocalCredentials',
        error: error
      })
      return Promise.reject({
        severity: 'low',
        message: i18n.t('failed to save updated permissions locally')
      })
    }

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