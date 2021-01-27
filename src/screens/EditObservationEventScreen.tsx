import React, { Component } from 'react'
import EditObservationEventComponent from '../components/forms/EditObservationEventComponent'
import InstructionModalComponent from '../components/general/InstructionModalComponent'
import Colors from '../styles/Colors'
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'
import { View } from 'react-native'
import Cs from '../styles/ContainerStyles'
import Bs from '../styles/ButtonStyles'

type Props = {
  navigation: NavigationStackProp<any, any>
}

export default class EditObservationEventScreen extends Component<NavigationStackScreenProps<Props>>  {

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
      title: screenProps.t('edit observation event'),
      headerStyle: {
        backgroundColor: Colors.headerBackground
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
    return (
      <EditObservationEventComponent
        onPressSubmit={() => {
          this.props.navigation.navigate('Home')
        }}
      >
        <InstructionModalComponent isVisible={this.state.modalVisibility} onClose={() => this.closeModal()} />
      </EditObservationEventComponent>
    )
  }
}