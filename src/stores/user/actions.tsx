import { clearCredentials, RootState, setCredentials } from '../'
import userService, { getProfile, pollUserLogin } from '../../services/userService'
import { getFormPermissions } from '../../services/formPermissionService'
import storageService from '../../services/storageService'
import i18n from '../../languages/i18n'
import { stopLocationAsync } from '../../helpers/geolocationHelper'
import { log } from '../../helpers/logger'
import { captureException } from '../../helpers/sentry'
import { CredentialsType } from './types'
import { createAsyncThunk } from '@reduxjs/toolkit'

interface loginUserParams {
  tmpToken: string,
  setCanceler: React.Dispatch<React.SetStateAction<(() => void | undefined) | undefined>>
}

interface checkTokenValidityParams {
  credentials: CredentialsType
}

export const loginUser = createAsyncThunk<void, loginUserParams, { rejectValue: Record<string, any> }>(
  'credentials/loginUser',
  async ({ tmpToken, setCanceler }, { dispatch, rejectWithValue }) => {
    let credentials: CredentialsType

    try {
      //start polling for credentials from server, error thrown when timeout of 180 seconds reached,
      //else dispatch credetials to store
      credentials = await pollUserLogin(tmpToken, setCanceler)

      //in case of error, credentials stay null
    } catch (error: any) {
      if (error.canceled) {
        return rejectWithValue({ canceled: true })
      }

      if (error.timeout) {
        log.error({
          location: '/stores/user/actions.tsx loginUser()',
          error: error
        })
        return rejectWithValue({
          severity: 'fatal',
          message: i18n.t('login timed out'),
          user_id: 'undefined'
        })
      }

      if (error.message?.includes('INVALID TOKEN')) {
        return rejectWithValue({
          severity: 'low',
          message: i18n.t('user token has expired')
        })
      }

      if (error.message?.includes('WRONG SOURCE')) {
        return rejectWithValue({
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
      return rejectWithValue({
        severity: 'fatal',
        message: `${i18n.t('failed to load credentials from server')} ${error.message}`
      })
    }

    //try to save credentials to asyncstorage to remember logged in user after app shutdown
    try {
      await storageService.save('credentials', credentials)

      //if asyncstorage fails, set error as such, allows user to continue anyway
    } catch (locError) {
      // captureException(locError)
      log.error({
        location: '/stores/user/actions.tsx loginUser()',
        error: locError,
        user_id: 'undefined'
      })
      return rejectWithValue({
        severity: 'low',
        message: i18n.t('failed to save credentials locally')
      })
    }

    if (!credentials) {
      return rejectWithValue({ message: 'no credentials' })
    } else {
      dispatch(setCredentials(credentials))
    }
  }
)

export const initLocalCredentials = createAsyncThunk<void, undefined, { rejectValue: Record<string, any> }>(
  'credentials/initLocalCredentials',
  async (_, { dispatch, rejectWithValue }) => {
    let localCredentials

    try {
      localCredentials = await storageService.fetch('credentials')
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/user/actions.tsx initLocalCredentials()',
        error: error,
        user_id: 'undefined'
      })
      return rejectWithValue({
        severity: 'high',
        message: i18n.t('failed to load credentials from local')
      })
    }

    if (!localCredentials) {
      return rejectWithValue({ message: 'no local credentials' })
    } else {
      dispatch(setCredentials(localCredentials))
    }
  }
)

export const getPermissions = createAsyncThunk<void, undefined, { rejectValue: Record<string, any> }>(
  'credentials/getPermissions',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { credentials } = getState() as RootState

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

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
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load permissions')} ${error.message}`
      })
    }

    const newCredentials = {
      ...credentials,
      permissions: permissionsArr
    }

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
      return rejectWithValue({
        severity: 'low',
        message: i18n.t('failed to save credentials locally')
      })
    }

    if (!newCredentials) {
      return rejectWithValue({ message: 'no credentials' })
    } else {
      dispatch(setCredentials(newCredentials))
    }
  }
)

export const getMetadata = createAsyncThunk<void, undefined, { rejectValue: Record<string, any> }>(
  'credentials/getMetadata',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { credentials } = getState() as RootState

    if (credentials.token === null || credentials.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

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
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load metadata')} ${error.message}`
      })
    }

    const newCredentials = {
      ...credentials,
      metadata
    }

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

    if (!newCredentials) {
      return rejectWithValue({ message: 'no credentials' })
    } else {
      dispatch(setCredentials(newCredentials))
    }
  }
)

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
      await userService.getTokenValidity(credentials.token)
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

export const logoutUser = createAsyncThunk<void, undefined, { rejectValue: Record<string, any> }>(
  'credentials/logoutUser',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { credentials, observing } = getState() as RootState

    const credentialsCopy = credentials

    if (credentialsCopy.token === null || credentialsCopy.user === null) {
      return rejectWithValue({
        severity: 'low',
        message: `${i18n.t('failed to load credentials from local')}`
      })
    }

    //stop recording when logging out
    if (observing) {
      await stopLocationAsync()
    }

    try {
      storageService.remove('credentials')
    } catch (error) {
      captureException(error)
      log.error({
        location: '/stores/user/actions.tsx logoutUser()',
        error: error,
        user_id: credentialsCopy.user.id
      })
      return rejectWithValue({
        severity: 'low',
        message: i18n.t('failed to remove credentials from local storage')
      })
    }

    if (credentialsCopy.token) {
      try {
        await userService.logout(credentialsCopy)
      } catch (error: any) {
        captureException(error)
        log.error({
          location: '/stores/user/actions.tsx logoutUser()',
          error: error,
          user_id: credentialsCopy.user.id
        })
        return rejectWithValue({
          severity: 'low',
          message: `${i18n.t('failed to logout from laji.fi server')} ${error.message}`
        })
      }
    }

    dispatch(clearCredentials())
  }
)