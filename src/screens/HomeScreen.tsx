import React from 'react'
import { CommonActions, ParamListBase } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import HomeComponent from '../components/home/HomeComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>
}

const HomeScreen = (props: Props) => {

  const { dispatch, isFocused, navigate, replace } = props.navigation
  return (
    <HomeComponent
      isFocused={() => isFocused()}
      onPressMap={() => navigate('map')}
      onLogout={() => {
        dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'login' }]
          })
        )
      }}
      onPressObservationEvent={(id: string) => replace('overview', { id })}
      onPressFinishObservationEvent={(sourcePage: string) => {
        props.navigation.navigate('document', { sourcePage })
      }}
    />
  )
}

export default HomeScreen