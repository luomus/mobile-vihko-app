import React, { Component } from 'react'
import Colors from '../styles/Colors'
import ObservationEventComponent from '../components/observationEvent/ObservationEventComponent'
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import Cs from '../styles/ContainerStyles'
import Bs from '../styles/ButtonStyles'

type Props  = {
  navigation: NavigationStackProp<any, any>
}

export default class ObservationEventScreen extends Component<NavigationStackScreenProps<Props>> {

  static navigationOptions = ({ screenProps, navigation }: any) =>  ({
    title: screenProps.t('event'),
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
    const { isFocused } = this.props.navigation
    return (
      <ObservationEventComponent
        id={this.props.navigation.state.params?.id}
        onPressHome = {() => {this.props.navigation.navigate('Home')}}
        onPressObservation={() => {this.props.navigation.navigate('Observation')}}
        onPressObservationEvent={() => {this.props.navigation.navigate('EditObservationEvent')}}
        isFocused={() => isFocused()}
      />
    )
  }
}