import React, { Component } from 'react'
import EditObservationEventComponent from '../components/EditObservationEventComponent'
import Colors from '../styles/Colors'
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'
import { View } from 'react-native'
import Cs from '../styles/ContainerStyles'
import Bs from '../styles/ButtonStyles'

type Props  = {
  navigation: NavigationStackProp<any, any>
}

export default class EditObservationEventScreen extends Component<NavigationStackScreenProps<Props>>  {

  static navigationOptions = ({ screenProps, navigation }: any) => ({
    title: screenProps.t('edit observation event'),
    headerStyle: {
      backgroundColor: Colors.headerBackground
    },
    headerTintColor: Colors.white,
    headerLeft: () => null,
    headerRight: () =>
      <View style={Cs.languageContainer}>
        <Icon iconStyle={Bs.headerButton} name='home' type='material-icons' size={25} onPress={() => navigation.navigate('Home')}/>
      </View>
  })

  render() {
    return (
      <EditObservationEventComponent
        onPress={(id: string) => {
          this.props.navigation.navigate('ObservationEvent', { id })
        }}/>
    )
  }
}