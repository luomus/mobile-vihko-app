import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { withTranslation } from 'react-i18next'
import HomeScreen from '../screens/HomeScreen'
import MapScreen from '../screens/MapScreen'
import ObservationScreen from '../screens/ObservationScreen'
import ObservationEventScreen from '../screens/ObservationEventScreen'
import LoginScreen from '../screens/LoginScreen'
import EditObservationEventScreen from '../screens/EditObservationEventScreen'
import NavBarComponent from '../components/general/NavBarComponent'

const Stack = createNativeStackNavigator()

const navigationOptions: NativeStackNavigationOptions = {
  header: function Header ({ navigation, route }) {
    return (<NavBarComponent navigation={navigation} route={route} />)
  }
}

const Navigator = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='login'>
        <Stack.Screen name='login' component={LoginScreen} options={navigationOptions} />
        <Stack.Screen name='home' component={HomeScreen} options={navigationOptions} />
        <Stack.Screen name='map' component={MapScreen} options={navigationOptions} />
        <Stack.Screen name='observation' component={ObservationScreen} options={navigationOptions} />
        <Stack.Screen name='overview' component={ObservationEventScreen} options={navigationOptions} />
        <Stack.Screen name='document' component={EditObservationEventScreen} options={navigationOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default withTranslation()(Navigator)