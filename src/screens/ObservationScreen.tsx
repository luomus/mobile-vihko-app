import React, { Component } from 'react'
import { View } from 'react-native'
import ObservationComponent from '../components/forms/ObservationComponent'
import InstructionModalComponent from '../components/general/InstructionModalComponent'
import Colors from '../styles/Colors'
import Cs from '../styles/ContainerStyles'
import Bs from '../styles/ButtonStyles'
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'

type Props = {
  navigation: NavigationStackProp<any, any>
}

export default class ObservationScreen extends Component<NavigationStackScreenProps<Props>>  {

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
      title: screenProps.t(navigation.state.params?.isNew ? 'add observation' : 'edit observation'),
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
    const { navigate, isFocused } = this.props.navigation
    //handles situation where fromMap can purposefully be undefined
    let fromMap = false
    if (this.props.navigation?.state?.params?.fromMap) {
      fromMap = true
    }

    return (
      <ObservationComponent
        toObservationEvent={(id: string) => navigate('ObservationEvent', { id })}
        toMap={() => navigate('Map')}
        rules={this.props.navigation.state.params?.rules}
        defaults={this.props.navigation.state.params?.defaults}
        fromMap={fromMap}
        sourcePage={this.props.navigation?.state?.params?.sourcePage}
        isFocused={isFocused}
      >
        <InstructionModalComponent isVisible={this.state.modalVisibility} onClose={() => this.closeModal()} />
      </ObservationComponent>
    )
  }
}
