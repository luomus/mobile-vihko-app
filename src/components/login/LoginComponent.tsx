import React, { useState, useEffect } from 'react'
import { View, Button, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getTempTokenAndLoginUrl } from '../../services/userService'
import { useDispatch, useSelector } from 'react-redux'
import {
  rootState,
  initObservationEvents,
  initSchema,
  resetReducer,
  loginUser,
  logoutUser,
  initLocalCredentials,
  setMessageState
} from '../../stores'
import Colors from '../../styles/Colors'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import i18n from '../../languages/i18n'
import ActivityComponent from '../general/ActivityComponent'
import MessageComponent from '../general/MessageComponent'
import { netStatusChecker } from '../../helpers/netStatusHelper'
import AppJSON from '../../../app.json'
import { log } from '../../helpers/logger'
import { availableForms } from '../../config/fields'

type Props = {
  loginAccepted?: boolean,
  onPressLogin: (loginURL: string) => void,
  onSuccessfulLogin: () => void,
  onReset: () => void,
}

const LoginComponent = (props: Props) => {

  const [loggingIn, setLoggingIn] = useState<boolean>(true)
  const [tempToken, setTempToken] = useState<string>('')

  const credentials = useSelector((state: rootState) => state.credentials)

  const dispatch = useDispatch()

  const { t } = useTranslation()

  useEffect(() => {
    loadData()
  }, [props.loginAccepted || credentials])

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
    dispatch(logoutUser())
    dispatch(resetReducer())
    props.onReset()
  }

  //check if user has previously logged in, redirect to home screen if is
  const loadData = async () => {
    setLoggingIn(true)
    if (!credentials.token) {
      if (props.loginAccepted === undefined) {
        try {
          dispatch(initLocalCredentials())
          await initializeApp()
        } catch (error) {
          if (error?.severity) {
            showError(error.message)
          }
          setLoggingIn(false)
        }
      } else if (props.loginAccepted) {
        try {
          dispatch(loginUser(tempToken))
        } catch (error) {
          if (error.severity === 'fatal') {
            showFatalError(`${t('critical error')}:\n${error.message}`)
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
      dispatch(initObservationEvents())
    } catch (error) {
      showError(error.message)
    }

    await Promise.all(availableForms.map(async formId => {
      try {
        dispatch(initSchema(false, formId))
      } catch (errors) {
        if (errors[errors.length - 1].severity === 'fatal') {
          errors.forEach((error: Record<string, any>, index: number) => {
            if (index === errors.length - 1) {
              showFatalError(`${t('critical error')}:\n${error.message}`)
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
    })
    )

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
      showFatalError(`${t('critical error')}:\n${t('getting temp token failed with')} ${error.message ? error.message : i18n.t('status code') + error.response.status}`)
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

export default LoginComponent