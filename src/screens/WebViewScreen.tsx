import React, { Component } from 'react'
import Colors from '../styles/Colors'
import WebViewComponent from '../components/WebViewComponent'
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack'

type Props  = {
  navigation: NavigationStackProp<any, any>
}

export default class WebViewScreen extends Component<NavigationStackScreenProps<Props>>  {

  static navigationOptions = ({ screenProps }: any) => ({
    title: screenProps.t('login'),
    headerStyle: {
      backgroundColor: Colors.headerBackground
    },
    headerTintColor: Colors.white,
    headerLeft: () => null
  })


  render() {
    const { navigate, state } = this.props.navigation

    return (
      <WebViewComponent
        loginURL={state.params?.loginURL}
        onReturn = {(loginAccepted?: boolean) => navigate('Login', { loginAccepted })}
        onBackPress = {() => navigate('Login', { loginAccepted: false })}
      />
    )
  }
}