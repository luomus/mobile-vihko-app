
import React, { Component } from 'react'
import { View } from 'react-native'
import MapComponent from '../components/map/MapComponent'
import InstructionModalComponent from '../components/general/InstructionModalComponent'
import Colors from '../styles/Colors'
import Cs from '../styles/ContainerStyles'
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'
import Bs from '../styles/ButtonStyles'

type Props = {
  navigation: NavigationStackProp<any, any>
}

export default class MapScreen extends Component<NavigationStackScreenProps<Props>> {

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
      title: screenProps.t('map'),
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
    const { navigate } = this.props.navigation

    return (
      <MapComponent
        onPressHome={() => navigate('Home')}
        onPressObservation={(isNew: boolean, rules: Record<string, any>, defaults: Record<string, any>) =>
          navigate('Observation', { isNew, rules, defaults })}
        onPressEditing={(fromMap?: boolean, sourcePage?: string) => navigate('Observation', { fromMap, sourcePage })}
        onPressFinishObservationEvent={() => {
          this.props.navigation.navigate('EditObservationEvent')
        }}
      >
        <InstructionModalComponent isVisible={this.state.modalVisibility} onClose={() => this.closeModal()} />
      </MapComponent>
    )
  }
}
