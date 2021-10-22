import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import Colors from '../styles/Colors'
import HomeComponent from '../components/home/HomeComponent'
import InstructionModalComponent from '../components/general/InstructionModalComponent'
import Cs from '../styles/ContainerStyles'
import Ts from '../styles/TextStyles'
import Bs from '../styles/ButtonStyles'
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack'
import { NavigationActions, StackActions } from 'react-navigation'

type Props = {
  navigation: NavigationStackProp<any, any>
}

export default class HomeScreen extends Component<NavigationStackScreenProps<Props>> {

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
        backgroundColor: Colors.primary5,
      },
      headerTintColor: Colors.whiteText,
      headerLeft: () => null,
      headerRight: () =>
        <View style={Cs.languageContainer}>
          <Text style={Ts.languageText} onPress={() => { screenProps.i18n.changeLanguage('fi') }}>FI</Text>
          <Text style={Ts.languageText} onPress={() => { screenProps.i18n.changeLanguage('sv') }}>SV</Text>
          <Text style={Ts.languageText} onPress={() => { screenProps.i18n.changeLanguage('en') }}>EN</Text>
          <Icon iconStyle={Bs.headerButton} name='help' type='material-icons' size={25} onPress={() => params.openModal()} />
          <Icon iconStyle={Bs.headerButton} name='info' type='material-icons' size={25} onPress={() => navigation.navigate('Info')} />
        </View>
    }
  }

  render() {
    const { dispatch, isFocused, navigate } = this.props.navigation
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
        onPressFinishObservationEvent={(sourcePage: string) => {
          this.props.navigation.navigate('EditObservationEvent', { sourcePage })
        }}
      >
        <InstructionModalComponent isVisible={this.state.modalVisibility} screen={'home'} onClose={() => this.closeModal()} />
      </HomeComponent>
    )
  }
}