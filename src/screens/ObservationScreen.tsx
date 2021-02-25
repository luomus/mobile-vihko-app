import React, { Component } from 'react'
import { View } from 'react-native'
import ObservationComponent from '../components/forms/ObservationComponent'
import InstructionModalComponent from '../components/general/InstructionModalComponent'
import Colors from '../styles/Colors'
import Cs from '../styles/ContainerStyles'
import Bs from '../styles/ButtonStyles'
import { NavigationStackProp } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'
import { setMessageState } from '../stores/message/actions'
import { connect, ConnectedProps } from 'react-redux'
import i18n from '../language/i18n'

const mapDispatchToProps = {
  setMessageState
}

const connector = connect(
  null,
  mapDispatchToProps
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  navigation: NavigationStackProp<any, any>
}

class ObservationScreen extends Component<Props>  {

  state: {
    modalVisibility: boolean
  }

  homeButtonHandler: Function

  constructor(props: Props) {
    super(props)
    this.state = {
      modalVisibility: false
    }
    this.homeButtonHandler = () => {
      this.props.setMessageState({
        type: 'dangerConf',
        messageContent: i18n.t('discard observation?'),
        onOk: () => {
          this.props.navigation.navigate('Map')
        }
      })
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
      openModal: this.openModal,
      homeButtonHandler: this.homeButtonHandler
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
          <Icon iconStyle={Bs.headerButton} name='home' type='material-icons' size={25} onPress={() => params.homeButtonHandler()} />
        </View>
    }
  }

  render() {
    const { navigate, isFocused, goBack } = this.props.navigation
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
        goBack={goBack}
      >
        <InstructionModalComponent isVisible={this.state.modalVisibility} onClose={() => this.closeModal()} />
      </ObservationComponent>
    )
  }
}

export default connector(ObservationScreen)