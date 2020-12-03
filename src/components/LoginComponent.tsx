import React, { useState, useEffect } from 'react'
import { View, Button, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getTempTokenAndLoginUrl } from '../controllers/userController'
import { connect, ConnectedProps } from 'react-redux'
import { initSchema, initObservationEvents } from '../stores/observation/actions'
import { setCredentials, loginUser, logoutUser, initLocalCredentials } from '../stores/user/actions'
import { setMessageState, clearMessageState } from '../stores/message/actions'
import { resetReducer } from '../stores/combinedActions'
import Colors from '../styles/Colors'
import Cs from '../styles/ContainerStyles'
import Bs from '../styles/ButtonStyles'
import Ts from '../styles/TextStyles'
import i18n from '../language/i18n'
import { CredentialsType } from '../stores/user/types'
import ActivityComponent from './ActivityComponent'
import MessageComponent from './MessageComponent'
import { netStatusChecker } from '../utilities/netStatusCheck'
import AppJSON from '../../app.json'
import { log } from '../utilities/logger'

interface RootState {
  credentials: CredentialsType,
}

const mapStateToProps = (state: RootState) => {
  const { credentials } = state
  return { credentials }
}

const mapDispatchToProps = {
  initObservationEvents,
  initSchema,
  setCredentials,
  loginUser,
  logoutUser,
  setMessageState,
  clearMessageState,
  resetReducer,
  initLocalCredentials
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  loginAccepted?: boolean,
  onPressLogin: (loginURL: string) => void,
  onSuccessfulLogin: () => void,
  onReset: () => void,
}

const LoginComponent = (props: Props) => {
  const { t } = useTranslation()
  const [loggingIn, setLoggingIn] = useState<boolean>(true)
  const [tempToken, setTempToken] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [props.loginAccepted || props.credentials])

  const showError = (error: string) => {
    props.setMessageState({
      type: 'err',
      messageContent: error
    })
  }

  const showFatalError = (error: string) => {
    props.setMessageState({
      type: 'err',
      messageContent: error,
      onOk: onFatalError
    })
  }

  //logout user and reset reducers on fatal error
  const onFatalError = async () => {
    await props.logoutUser()
    props.resetReducer()
    props.onReset()
  }

  //check if user has previously logged in, redirect to home screen if is
  const loadData = async () => {
    setLoggingIn(true)
    if (!props.credentials.token) {
      if (props.loginAccepted === undefined) {
        try {
          await props.initLocalCredentials()
          await initializeApp()
        } catch (error) {
          if (error?.severity) {
            showError(error.message)
          }
          setLoggingIn(false)
        }
      } else if (props.loginAccepted) {
        try {
          await props.loginUser(tempToken)
        } catch (error) {
          if (error.severity === 'fatal') {
            showFatalError(`${t('critical error')}:\n ${error.message}`)
            setLoggingIn(false)
            return
          } else {
            showError(error.message)
          }
        }
        await initializeApp()
      }
    }
  }

  const initializeApp = async () => {
    try {
      await props.initObservationEvents()
    } catch (error) {
      showError(error.message)
    }

    try {
      await props.initSchema(false)
    } catch (errors) {
      if (errors[errors.length - 1].severity === 'fatal') {
        errors.forEach((error: Record<string, any>, index: number) => {
          if (index === errors.length - 1) {
            showFatalError(`${t('critical error')}:\n ${error.message}`)
          } else {
            showError(error.message)
          }
        })
        setLoggingIn(false)
        return

      } else {
        errors.forEach((error: Record<string, any>) => {
          showError(error.message)
        })
      }
    }

    props.onSuccessfulLogin()
    setLoggingIn(false)
  }

  const login = async () => {
    setLoggingIn(true)
    //check internet status and attempt to get temporary login url for webview
    try {
      await netStatusChecker()
      const result = await getTempTokenAndLoginUrl()
      setTempToken(result.tmpToken)
      props.onPressLogin(result.loginURL)
      setLoggingIn(false)
    } catch (error) {
      log.error({
        location: '/components/LoginComponent.tsx login()', 
        error: error.response.data.error
      })
      setLoggingIn(false)
      showFatalError(`${t('critical error')}:\n ${t('getting temp token failed with')} ${error.message ? error.message : i18n.t('status code') + error.response.status}`)
    }
  }

  if (loggingIn) {
    return (
      <ActivityComponent text={'loading'} />
    )
  } else {
    return (
      <View style={Cs.outerVersionContainer}>
        <View style={Cs.loginViewContainer}>
          <View style={Cs.loginContainer}>
            <Text style={Ts.loginHeader}>{t('login')}</Text>
            <View style={Cs.inputContainer}>
              <Text style={Ts.loginText}>{t('login text')}</Text>
            </View>
            <View style={Bs.loginButton}>
              <Button onPress={login} title={t('login')} color={Colors.neutralColor} />
            </View>
          </View>
          <View style={Cs.loginLanguageContainer}>
            <Text style={Ts.loginLanguage} onPress={() => i18n.changeLanguage('fi')}>FI</Text>
            <Text style={Ts.loginLanguage} onPress={() => i18n.changeLanguage('sv')}>SV</Text>
            <Text style={Ts.loginLanguage} onPress={() => i18n.changeLanguage('en')}>EN</Text>
          </View>
        </View>
        <MessageComponent />
        <View style={Cs.versionContainer}>
          <Text style={Ts.alignedRightText}>{t('version')} {AppJSON.expo.version}</Text>
        </View>
      </View>
    )
  }
}

export default connector(LoginComponent)