import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { ParamListBase, Route } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../stores'
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

  const schema = useSelector((state: RootState) => state.schema)
  const singleObservation = useSelector((state: RootState) => state.singleObservation)

  useEffect(() => {
    if (schema.formID === forms.tripForm) {
      if (singleObservation) {
        setFormName(t('single observation'))
      } else {
        setFormName(t('trip form'))
      }
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
    } else if (schema.formID === forms.practicalFungiForm) {
      setFormName(t('practical fungi form'))
    } else if (schema.formID === forms.oldForestPolyporesForm) {
      setFormName(t('old forest polypores form'))
    } else if (schema.formID === forms.indicatorLichensForm) {
      setFormName(t('indicator lichen form'))
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
      return t('edit observation')
    } else if (props.route.name === 'document') {
      return t('edit document')
    } else if (props.route.name === 'overview') {
      return t('event overview')
    } else if (props.route.name === 'list') {
      return formName
    }
  }

  return (
    <View style={Cs.navBarContainer}>
      <View style={{ flex: 6 }}>
        <Text style={Ts.headerTitle}>{title()}</Text>
      </View>
      <View style={{ flex: 4, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <MaterialDesignIcons style={Bs.headerButton} name='information' size={25} onPress={() => setInfoModalVisibility(true)} />
        {['login', 'observation', 'document', 'singleObservation'].includes(props.route.name) ?
          <MaterialDesignIcons style={Bs.headerUnavailableButton} name='account-outline' size={25} /> :
          <MaterialDesignIcons style={Bs.headerButton} name='account-outline' size={25} onPress={() => setUserModalVisibility(true)} testID='usermodal-visibility-button' />
        }
        {(props.route.name !== 'login' && props.route.name !== 'home' && props.route.name !== 'observation'
          && props.route.name !== 'document' && props.route.name !== 'singleObservation')
          ? <MaterialDesignIcons style={Bs.headerButton} name='home' size={25}
            onPress={ () => props.navigation.popTo('home') }
          />
          : <MaterialDesignIcons style={Bs.headerUnavailableButton} name='home' size={25} testID={'homeButton'} />
        }
        <InstructionModalComponent isVisible={infoModalVisibility} screen={props.route.name} onClose={() => setInfoModalVisibility(false)} />
        <UserModalComponent isVisible={userModalVisibility} onClose={() => setUserModalVisibility(false)} navigation={props.navigation} />
      </View>
    </View>
  )
}

export default NavBarComponent