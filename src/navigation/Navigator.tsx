import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { withTranslation } from 'react-i18next'
import HomeScreen from '../screens/HomeScreen'
import MapScreen from '../screens/MapScreen'
import ObservationScreen from '../screens/ObservationScreen'
import OverviewScreen from '../screens/OverviewScreen'
import LoginScreen from '../screens/LoginScreen'
import DocumentScreen from '../screens/DocumentScreen'
import ListScreen from '../screens/ListScreen'
import NavBarComponent from '../components/general/NavBarComponent'
import SingleObservationScreen from '../screens/SingleObservationScreen'

type RootStackParamList = {
  login: undefined,
  home: undefined,
  map: undefined,
  observation: {
    rules: Record<string, any> | undefined,
    defaults: Record<string, any> | undefined,
    sourcePage: string
  },
  document: {
    sourcePage: string
  },
  overview: {
    id: string
  },
  singleObservation: {
    rules: Record<string, any> | undefined,
    defaults: Record<string, any> | undefined,
    sourcePage: string
  },
  list: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const navigationOptions: NativeStackNavigationOptions = {
  header: function Header ({ navigation, route }) {
    return (<NavBarComponent navigation={navigation} route={route} />)
  }
}

const Navigator = ({ initialRoute = 'login' }: {initialRoute: any}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={ initialRoute }>
        <Stack.Screen name='login' component={LoginScreen} options={navigationOptions} />
        <Stack.Screen name='home' component={HomeScreen} options={navigationOptions} />
        <Stack.Screen name='map' component={MapScreen} options={navigationOptions} />
        <Stack.Screen name='observation' component={ObservationScreen} options={navigationOptions} />
        <Stack.Screen name='document' component={DocumentScreen} options={navigationOptions} />
        <Stack.Screen name='singleObservation' component={SingleObservationScreen} options={navigationOptions} />
        <Stack.Screen name='overview' component={OverviewScreen} options={navigationOptions} />
        <Stack.Screen name='list' component={ListScreen} options={navigationOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default withTranslation()(Navigator)