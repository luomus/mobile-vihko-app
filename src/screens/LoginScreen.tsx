import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CommonActions, ParamListBase } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import LoginComponent from '../components/login/LoginComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>
}

const LoginScreen = (props: Props) => {

  const { dispatch } = props.navigation
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['right', 'bottom', 'left']}>
      <LoginComponent
        onSuccessfulLogin={() => {
          dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'home' }]
            })
          )
        }}
        onReset={() => {
          dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'login' }]
            })
          )
        }}
      />
    </SafeAreaView>
  )
}

export default LoginScreen