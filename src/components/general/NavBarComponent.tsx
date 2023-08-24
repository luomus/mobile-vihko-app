import React, { useEffect, useState } from 'react'
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
import i18n from '../../languages/i18n'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import InstructionModalComponent from './InstructionModalComponent'
import UserModalComponent from './UserModalComponent'
import { forms } from '../../config/fields'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>,
  route: Route<string>
}

const NavBarComponent = (props: Props) => {

  const { t } = useTranslation()

  const [infoModalVisibility, setInfoModalVisibility] = useState<boolean>(false)
  const [userModalVisibility, setUserModalVisibility] = useState<boolean>(false)
  const [formName, setFormName] = useState<string>(t('trip form'))

  const dispatch: DispatchType = useDispatch()

  const schema = useSelector((state: rootState) => state.schema)

  //const { isNew } = props.route.params

  useEffect(() => {
    if (schema.formID === forms.tripForm) {
      setFormName(t('trip form'))
    } else if (schema.formID === forms.birdAtlas) {
      setFormName(t('bird atlas'))
    } else if (schema.formID === forms.fungiAtlas) {
      setFormName(t('fungi atlas'))
    } else if (schema.formID === forms.dragonflyForm) {
      setFormName(t('dragonfly form'))
    } else if (schema.formID === forms.butterflyForm) {
      setFormName(t('butterfly form'))
    } else if (schema.formID === forms.largeFlowersForm) {
      setFormName(t('large flowers form'))
    } else if (schema.formID === forms.mothForm) {
      setFormName(t('moth form'))
    } else if (schema.formID === forms.bumblebeeForm) {
      setFormName(t('bumblebee form'))
    } else if (schema.formID === forms.herpForm) {
      setFormName(t('herp form'))
    } else if (schema.formID === forms.subarcticForm) {
      setFormName(t('subarctic form'))
    } else if (schema.formID === forms.macrolichenForm) {
      setFormName(t('macrolichen form'))
    } else if (schema.formID === forms.bracketFungiForm) {
      setFormName(t('bracket fungi form'))
    } else if (schema.formID === forms.practicalFungiForm) {
      setFormName(t('practical fungi form'))
    } else {
      setFormName(t('lolife'))
    }
  }, [schema.formID, i18n.language])

  const title = () => {
    if (props.route.name === 'login') {
      return t('mobile vihko')
    } else if (props.route.name === 'home') {
      return t('mobile vihko')
    } else if (props.route.name === 'map') {
      return formName
    } else if (props.route.name === 'observation') {
      //return t(isNew ? 'add observation' : 'edit observation')
      return t('edit observation')
    } else if (props.route.name === 'document') {
      return t('edit document')
    } else if (props.route.name === 'overview') {
      return t('event overview')
    } else if (props.route.name === 'list') {
      return formName
    }
  }

  const homeButtonHandler = (screen: string) => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: screen === 'observation' ? t('discard observation?') : t('discard document?'),
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
          <Icon iconStyle={Bs.headerButton} name='perm-identity' type='material-icons' size={25} onPress={() => setUserModalVisibility(true)} testID='usermodal-visibility-button' /> :
          <Icon iconStyle={Bs.headerUnavailableButton} name='perm-identity' type='material-icons' size={25} onPress={() => null} />
        }
        {props.route.name !== 'login' && props.route.name !== 'home' ?
          <Icon iconStyle={Bs.headerButton} name='home' type='material-icons' size={25}
            onPress={
              props.route.name !== 'observation' && props.route.name !== 'document'
                ? () => props.navigation.navigate('home')
                : () => homeButtonHandler(props.route.name)
            }
          /> :
          <Icon iconStyle={Bs.headerUnavailableButton} name='home' type='material-icons' size={25} onPress={() => null} testID={'homeButton'} />
        }
        <InstructionModalComponent isVisible={infoModalVisibility} screen={props.route.name} onClose={() => setInfoModalVisibility(false)} />
        <UserModalComponent isVisible={userModalVisibility} onClose={() => setUserModalVisibility(false)} navigation={props.navigation} />
      </View>
    </View>
  )
}

export default NavBarComponent