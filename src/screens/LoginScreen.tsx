import React, { Component } from 'react'
import Colors from '../styles/Colors'
import LoginComponent from '../components/login/LoginComponent'
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack'
import { NavigationActions, StackActions } from 'react-navigation'
import Cs from '../styles/ContainerStyles'
import Bs from '../styles/ButtonStyles'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'


type Props  = {
  navigation: NavigationStackProp<any, any>
}

export default class LoginScreen extends Component<NavigationStackScreenProps<Props>>  {
  static navigationOptions = ({ screenProps, navigation }: any) => ({
    title: screenProps.t('mobile vihko'),
    headerStyle: {
      backgroundColor: Colors.primary5
    },
    headerTintColor: Colors.whiteText,
    headerRight: () =>
      <View style={Cs.languageContainer}>
        <Icon iconStyle={Bs.headerButton} name='info' type='material-icons' size={25} onPress={() => navigation.navigate('Info')}/>
      </View>
  })

  render() {
    return (
      <LoginComponent
        onSuccessfulLogin={() => {this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
              routeName: 'Home'
            })]
          })
        )}}
        onReset = {() => {this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
              routeName: 'Login'
            })]
          })
        )}}
      />
    )
  }
}