import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ParamListBase, Route } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import {
  rootState,
  DispatchType,
  setMessageState
} from '../../stores'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import InstructionModalComponent from './InstructionModalComponent'
import UserModalComponent from './UserModalComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>,
  route: Route<string>
}

const NavBarComponent = (props: Props) => {

  const { t } = useTranslation()

  const [infoModalVisibility, setInfoModalVisibility] = useState<boolean>(false)
  const [userModalVisibility, setUserModalVisibility] = useState<boolean>(false)

  const dispatch: DispatchType = useDispatch()

  const tracking = useSelector((state: rootState) => state.tracking)

  //const { isNew } = props.route.params

  const title = () => {
    if (props.route.name === 'login') {
      return t('mobile vihko')
    } else if (props.route.name === 'home') {
      return t('mobile vihko')
    } else if (props.route.name === 'map') {
      return tracking ? t('gps notification body').substring(0, t('gps notification body').length - 1) : t('path not tracked')
    } else if (props.route.name === 'observation') {
      //return t(isNew ? 'add observation' : 'edit observation')
      return t('edit observation')
    } else if (props.route.name === 'document') {
      return t('edit document')
    } else if (props.route.name === 'overview') {
      return t('event overview')
    } else if (props.route.name === 'list') {
      return tracking ? t('gps notification body').substring(0, t('gps notification body').length - 1) : t('path not tracked')
    }
  }

  const homeButtonHandler = () => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('discard observation?'),
      cancelLabel: t('cancel'),
      okLabel: t('exit'),
      onOk: () => {
        props.navigation.navigate('home')
      }
    }))
  }

  return (
    <View style={Cs.navBarContainer}>
      <View style={{ flex: 6 }}>
        <Text style={Ts.headerTitle}>{title()}</Text>
      </View>
      <View style={{ flex: 4, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Icon iconStyle={Bs.headerButton} name='info' type='material-icons' size={25} onPress={() => setInfoModalVisibility(true)} />
        {props.route.name !== 'login' ?
          <Icon iconStyle={Bs.headerButton} name='perm-identity' type='material-icons' size={25} onPress={() => setUserModalVisibility(true)} /> :
          <Icon iconStyle={Bs.headerUnavailableButton} name='perm-identity' type='material-icons' size={25} onPress={() => null} />
        }
        {props.route.name !== 'login' && props.route.name !== 'home' ?
          <Icon iconStyle={Bs.headerButton} name='home' type='material-icons' size={25} onPress={props.route.name !== 'observation' && props.route.name !== 'document' ?
            () => props.navigation.navigate('home') :
            () => homeButtonHandler()
          } /> :
          <Icon iconStyle={Bs.headerUnavailableButton} name='home' type='material-icons' size={25} onPress={() => null} />
        }
        <InstructionModalComponent isVisible={infoModalVisibility} screen={props.route.name} onClose={() => setInfoModalVisibility(false)} />
        <UserModalComponent isVisible={userModalVisibility} onClose={() => setUserModalVisibility(false)} navigation={props.navigation} />
      </View>
    </View>
  )
}

export default NavBarComponent