import React from 'react'
import { CommonActions, ParamListBase } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import LoginComponent from '../components/login/LoginComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>
}

const HomeScreen = (props: Props) => {

  const { dispatch } = props.navigation
  return (
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
  )
}

export default HomeScreen