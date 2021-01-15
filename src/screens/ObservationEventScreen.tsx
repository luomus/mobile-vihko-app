import React, { Component } from 'react'
import Colors from '../styles/Colors'
import ObservationEventComponent from '../components/observationEvent/ObservationEventComponent'
import InstructionModalComponent from '../components/general/InstructionModalComponent'
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import Cs from '../styles/ContainerStyles'
import Bs from '../styles/ButtonStyles'

type Props = {
  navigation: NavigationStackProp<any, any>
}

export default class ObservationEventScreen extends Component<NavigationStackScreenProps<Props>> {

  state: {
    modalVisibility: boolean
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      modalVisibility: false
    }
  }

  openModal = () => {
    this.setState({ modalVisibility: true })
  }

  closeModal = () => {
    this.setState({ modalVisibility: false })
  }

  componentDidMount() {
    this.props.navigation.setParams({
      ...this.props.navigation.state.params,
      openModal: this.openModal
    })
  }

  static navigationOptions = ({ screenProps, navigation }: any) => {
    const { params = {} } = navigation.state

    return {
      title: screenProps.t('event'),
      headerStyle: {
        backgroundColor: Colors.headerBackground,
      },
      headerTintColor: Colors.white,
      headerLeft: () => null,
      headerRight: () =>
        <View style={Cs.languageContainer}>
          <Icon iconStyle={Bs.headerButton} name='help' type='material-icons' size={25} onPress={() => params.openModal()} />
          <Icon iconStyle={Bs.headerButton} name='home' type='material-icons' size={25} onPress={() => navigation.navigate('Home')} />
        </View>
    }
  }

  render() {
    const { isFocused } = this.props.navigation
    return (
      <ObservationEventComponent
        id={this.props.navigation.state.params?.id}
        onPressHome={() => { this.props.navigation.navigate('Home') }}
<<<<<<< HEAD
        onPressObservation={(sourcePage?: string) => { this.props.navigation.navigate('Observation', { sourcePage }) }}
=======
        onPressObservation={() => { this.props.navigation.navigate('Observation') }}
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
        onPressObservationEvent={() => { this.props.navigation.navigate('EditObservationEvent') }}
        isFocused={() => isFocused()}
      >
        <InstructionModalComponent isVisible={this.state.modalVisibility} onClose={() => this.closeModal()} />
      </ObservationEventComponent>
    )
  }
}