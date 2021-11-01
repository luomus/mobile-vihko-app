import React, { Component } from 'react'
import Colors from '../styles/Colors'
import LoginComponent from '../components/login/LoginComponent'
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack'
import { NavigationActions, StackActions } from 'react-navigation'
import InstructionModalComponent from '../components/general/InstructionModalComponent'
import Cs from '../styles/ContainerStyles'
import Bs from '../styles/ButtonStyles'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'


type Props = {
  navigation: NavigationStackProp<any, any>
}

export default class LoginScreen extends Component<NavigationStackScreenProps<Props>>  {

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
      title: screenProps.t('mobile vihko'),
      headerStyle: {
        backgroundColor: Colors.primary5
      },
      headerTintColor: Colors.whiteText,
      headerRight: () =>
        <View style={Cs.languageContainer}>
          <Icon iconStyle={Bs.headerButton} name='info' type='material-icons' size={25} onPress={() => params.openModal()} />
        </View>
    }
  }

  render() {
    return (
      <LoginComponent
        onSuccessfulLogin={() => {
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({
                routeName: 'Home'
              })]
            })
          )
        }}
        onReset={() => {
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({
                routeName: 'Login'
              })]
            })
          )
        }}
      >
        <InstructionModalComponent isVisible={this.state.modalVisibility} screen={'login'} onClose={() => this.closeModal()} />
      </LoginComponent>
    )
  }
}