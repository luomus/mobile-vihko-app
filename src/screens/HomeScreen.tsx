import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import Colors from '../styles/Colors'
import HomeComponent from '../components/home/HomeComponent'
import Cs from '../styles/ContainerStyles'
import Ts from '../styles/TextStyles'
import Bs from '../styles/ButtonStyles'
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack'
import { NavigationActions, StackActions } from 'react-navigation'

type Props  = {
  navigation: NavigationStackProp<any, any>
}

export default class HomeScreen extends Component<NavigationStackScreenProps<Props>> {

  static navigationOptions = ({ screenProps, navigation }: any) =>  ({
    title: screenProps.t('mobile vihko'),
    headerStyle: {
      backgroundColor: Colors.headerBackground,
    },
    headerTintColor: Colors.white,
    headerLeft: () => null,
    headerRight: () =>
      <View style={Cs.languageContainer}>
        <Text style={Ts.languageText} onPress={() => {screenProps.i18n.changeLanguage('fi')}}>FI</Text>
        <Text style={Ts.languageText} onPress={() => {screenProps.i18n.changeLanguage('sv')}}>SV</Text>
        <Text style={Ts.languageText} onPress={() => {screenProps.i18n.changeLanguage('en')}}>EN</Text>
        <Icon iconStyle={Bs.headerButton} name='info' type='material-icons' size={25} onPress={() => navigation.navigate('Info')}/>
      </View>
  })

  render() {
    const { dispatch, isFocused, navigate, state } = this.props.navigation
    return (
      <HomeComponent
        isFocused={() => isFocused()}
        onPressMap={() => navigate('Map')}
        onLogout={() => dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })]
          })
        )}
        onPressObservationEvent={(id: string) => {
          this.props.navigation.navigate('ObservationEvent', { id })
        }}
        obsStopped={state.params?.obsStopped}
        onFinishObservationEvent={() => {
          this.props.navigation.navigate('EditObservationEvent')
        }}
      />
    )
  }
}