import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Colors from '../styles/Colors'
import { InfoPageComponent } from '../components/infoPage/InfoPageComponent'
import Cs from '../styles/ContainerStyles'
import Ts from '../styles/TextStyles'
import Bs from '../styles/ButtonStyles'
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'

type Props  = {
  navigation: NavigationStackProp<any, any>
}

export default class HomeScreen extends Component<NavigationStackScreenProps<Props>> {

  static navigationOptions = ({ screenProps, navigation }: any) =>  ({
    title: screenProps.t('info page'),
    headerStyle: {
      backgroundColor: Colors.primary5,
    },
    headerTintColor: Colors.whiteText,
    headerLeft: () => null,
    headerRight: () =>
      <View style={Cs.languageContainer}>
        <Text style={Ts.languageText} onPress={() => {screenProps.i18n.changeLanguage('fi')}}>FI</Text>
        <Text style={Ts.languageText} onPress={() => {screenProps.i18n.changeLanguage('sv')}}>SV</Text>
        <Text style={Ts.languageText} onPress={() => {screenProps.i18n.changeLanguage('en')}}>EN</Text>
        <Icon iconStyle={Bs.headerButton} name='home' type='material-icons' size={25} onPress={() => navigation.goBack()}/>
      </View>
  })

  render() {
    return (
      <InfoPageComponent />
    )
  }
}