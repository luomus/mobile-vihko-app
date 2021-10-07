import React, { Component } from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { withTranslation, WithTranslation } from 'react-i18next'
import HomeScreen from '../screens/HomeScreen'
import MapScreen from '../screens/MapScreen'
import ObservationScreen from '../screens/ObservationScreen'
import ObservationEventScreen from '../screens/ObservationEventScreen'
import LoginScreen from '../screens/LoginScreen'
import EditObservationEventScreen from '../screens/EditObservationEventScreen'
import InfoScreen from '../screens/InfoScreen'

const Navigator = createStackNavigator(
  {
    Login: LoginScreen,
    Home: HomeScreen,
    Map: MapScreen,
    Observation: ObservationScreen,
    ObservationEvent: ObservationEventScreen,
    EditObservationEvent: EditObservationEventScreen,
    Info: InfoScreen
  },
  {
    initialRouteName: 'Login'
  }
)

const AppContainer = createAppContainer(Navigator)

class AppNavigator extends Component<WithTranslation> {
  render() {
    const { t, i18n } = this.props

    return (
      <AppContainer
        screenProps={{
          t,
          i18n
        }}
      />
    )
  }
}
export default withTranslation()(AppNavigator)
