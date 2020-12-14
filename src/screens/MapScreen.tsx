
import React, { Component } from 'react'
import { View } from 'react-native'
import MapComponent from '../components/map/MapComponent'
import Colors from '../styles/Colors'
import Cs from '../styles/ContainerStyles'
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'
import Bs from '../styles/ButtonStyles'

type Props  = {
  navigation: NavigationStackProp<any, any>
}

export default class MapScreen extends Component<NavigationStackScreenProps<Props>> {
  static navigationOptions = ({ screenProps, navigation }: any) => ({
    title: screenProps.t('map'),
    headerStyle: {
      backgroundColor: Colors.headerBackground,
    },
    headerTintColor: Colors.white,
    headerLeft: () => null,
    headerRight: () =>
      <View style={Cs.languageContainer}>
        <Icon iconStyle={Bs.headerButton} name='home' type='material-icons' size={25} onPress={() => navigation.navigate('Home')}/>
      </View>
  })

  render() {
    const { navigate } = this.props.navigation

    return (
      <MapComponent
        onPressHome = {(obsStopped: boolean) => navigate('Home', { obsStopped })}
        onPressObservation = {(rules: Record<string, any>, defaults: Record<string, any>) =>
          navigate('Observation', { rules, defaults })}
        onPressEditing = {(fromMap?: boolean) => navigate('Observation', { fromMap })}
      />
    )
  }
}
