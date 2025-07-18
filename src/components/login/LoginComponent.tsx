import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getTempTokenAndLoginUrl } from '../../services/userService'
import { useDispatch, useSelector } from 'react-redux'
import {
  RootState,
  DispatchType,
  initObservationEvents,
  resetReducer,
  loginUser,
  logoutUser,
  initLocalCredentials,
  setMessageState,
  getPermissions,
  getMetadata
} from '../../stores'
import Colors from '../../styles/Colors'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import LoadingComponent from '../general/LoadingComponent'
import MessageComponent from '../general/MessageComponent'
import { netStatusChecker } from '../../helpers/netStatusHelper'
import AppJSON from '../../../app.json'
import { log } from '../../helpers/logger'
import { openBrowserAsync } from 'expo-web-browser'
import ButtonComponent from '../general/ButtonComponent'
import storageService from '../../services/storageService'
import { initLanguage, saveLanguage } from '../../helpers/languageHelper'
import { captureException } from '../../helpers/sentry'

type Props = {
  onSuccessfulLogin: () => void,
  onReset: () => void,
  children?: JSX.Element | JSX.Element[]
}

const LoginComponent = (props: Props) => {
  const tmpTokenKey = 'TEMP_TOKEN_STORAGE_KEY'
  const [loggingIn, setLoggingIn] = useState<boolean>(true)
  const [polling, setPolling] = useState<boolean>(false)
  const [canceler, setCanceler] = useState<() => void | undefined>()
  const credentials = useSelector((state: RootState) => state.credentials)
  const dispatch: DispatchType = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    if (credentials.token) {
      initializeApp()
    } else {
      loadData()
    }
  }, [credentials.token])

  const showError = (error: string) => {
    dispatch(setMessageState({
      type: 'err',
      messageContent: error
    }))
  }

  const showFatalError = (error: string) => {
    dispatch(setMessageState({
      type: 'err',
      messageContent: error,
      onOk: onFatalError
    }))
  }

  //logout user and reset reducers on fatal error
  const onFatalError = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
    } catch (error: any) { //catch if logout fails
      captureException(error)
      showError(error.message)
    }
    dispatch(resetReducer())
    props.onReset()
  }

  //check if user has previously logged in, redirect to home screen if is
  const loadData = async () => {
    setLoggingIn(true)

    try {
      await dispatch(initLocalCredentials()).unwrap()
    } catch (error: any) {

      //failed to fetch credentials from storage
      if (error?.severity) {
        showError(error.message)
        setLoggingIn(false)
        return
      }

      //user was not logged in
      let tmpToken = null
      try {
        tmpToken = await storageService.fetch(tmpTokenKey)
      } catch (error) {
        setLoggingIn(false)
        return
      }

      if (tmpToken) {
        await pollLogin(tmpToken)
        await storageService.remove(tmpTokenKey)
      } else {
        setLoggingIn(false)
      }
    }
  }

  const initializeApp = async () => {
    const connected = await checkNetworkStatus()
    if (!connected) return

    await Promise.all([
      dispatch(initObservationEvents()).unwrap(),
      initLanguage()
    ]).catch((error: any) => {
      captureException(error)
      showError(error.message)
    })

    try {
      await dispatch(getPermissions()).unwrap()
      await dispatch(getMetadata()).unwrap()
    } catch (error: any) {
      captureException(error)
      showError(error.message)
    }

    props.onSuccessfulLogin()
    setLoggingIn(false)
  }

  const pollLogin = async (tmpToken: string) => {
    try {
      setPolling(true)
      await dispatch(loginUser({ tmpToken, setCanceler })).unwrap()

    } catch (error: any) {
      //stop polling if user canceled the login
      if (error.canceled) {
        setLoggingIn(false)
        return
      }

      //timeout or server error
      if (error.severity === 'fatal') {
        showFatalError(`${t('critical error')}:\n${error.message}`)
        setLoggingIn(false)
        return
        //storage fails
      } else {
        showError(error.message)
        setLoggingIn(false)
      }

    } finally {
      setPolling(false)
    }
  }

  const login = async () => {
    setLoggingIn(true)
    let result

    const connected = await checkNetworkStatus()
    if (!connected) return

    //attempt to get temporary login url for webview
    try {
      result = await getTempTokenAndLoginUrl()
      await storageService.save(tmpTokenKey, result.tmpToken)
    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/components/LoginComponent.tsx login()',
        error: error,
        user_id: credentials.user?.id
      })
      setLoggingIn(false)
      showFatalError(`${t('critical error')}:\n${t('getting temp token failed with')} ${error.message}`)
      return
    }

    //open browser for login
    try {
      await openBrowserAsync(result.loginURL, { toolbarColor: Colors.primary5, controlsColor: Colors.neutral2 })
    } catch (error) {
      captureException(error)
      log.error({
        location: 'components/LoginComponent.tsx login()',
        error: error,
        user_id: credentials.user?.id
      })
      setLoggingIn(false)
      showFatalError(`${t('critical error')}:\n${t('could not open browser for login')}`)
    }

    await pollLogin(result.tmpToken)
    await storageService.remove(tmpTokenKey)
  }

  //check that internet can be reached
  const checkNetworkStatus = async (): Promise<boolean> => {
    const delay = (milliseconds: number) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    try {
      await netStatusChecker()
    } catch (error) {
      captureException(error)
      await delay(5000)

      try {
        await netStatusChecker()
      } catch (error: any) {
        captureException(error)
        log.error({
          location: '/components/LoginComponent.tsx login()',
          error: 'Network error (no connection)',
          user_id: credentials.user?.id
        })
        setLoggingIn(false)
        showFatalError(`${t('critical error')}:\n${error.message}`)
        return false
      }
    }
    return true
  }

  if (polling) {
    return <>
      <LoadingComponent text={t('waiting for login')}>
        <View style={Bs.loginCancelButton}>
          <ButtonComponent
            onPressFunction={
              () => {
                if (canceler) {
                  canceler()
                }
              }}
            title={t('cancel')} height={40} width={150} buttonStyle={Bs.loginCancelButton}
            gradientColorStart={Colors.dangerButton1} gradientColorEnd={Colors.dangerButton2} shadowColor={Colors.dangerShadow}
            textStyle={Ts.buttonText} iconName={'cancel'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
          />
        </View>
      </LoadingComponent>
    </>

  } else if (loggingIn) {
    return (
      <LoadingComponent text={t('loading')} />
    )
  } else {
    return (
      <View style={Cs.contentAndVersionContainer}>
        <View style={Cs.loginContentContainer}>
          <Text style={Ts.loginHeader}>{t('mobile vihko')}</Text>
          <View style={Cs.inputContainer}>
            <Text style={Ts.loginText}>{t('login text')}</Text>
          </View>
          <View style={Cs.loginButtonContainer}>
            <ButtonComponent onPressFunction={async () => await login()} title={t('login')}
              height={40} width={200} buttonStyle={Bs.loginButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={22} contentColor={Colors.whiteText} testID='login-button'
            />
          </View>
          <View style={Cs.loginLanguageContainer}>
            <Text style={Ts.loginLanguage} onPress={async () => await saveLanguage('fi')}>FI</Text>
            <Text style={Ts.loginLanguage} onPress={async () => await saveLanguage('sv')}>SV</Text>
            <Text style={Ts.loginLanguage} onPress={async () => await saveLanguage('en')}>EN</Text>
          </View>
        </View>
        {props.children}
        <MessageComponent />
        <View style={Cs.versionContainer}>
          <Text style={Ts.alignedRightText}>{t('version')} {AppJSON.expo.version}</Text>
        </View>
      </View>
    )
  }
}

export default LoginComponent