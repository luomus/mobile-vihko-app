import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import i18n from '../../languages/i18n'
import { useTranslation } from 'react-i18next'
import { forms } from '../../config/fields'
import { RootState } from '../../stores'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'

type Props = {
  formID: string,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>
  alternativeEffect?: () => any
}

const FormLauncherComponent = (props: Props) => {

  const { t } = useTranslation()

  const [title, setTitle] = useState<string>(t('trip form'))
  const [description, setDescription] = useState<string>(t('instructions.trip.intro'))

  const observing = useSelector((state: RootState) => state.observing)

  useEffect(() => {
    if (props.formID === 'single') {
      setTitle(t('single observation'))
      setDescription(t('instructions.singleObservation.intro'))
    } else if (props.formID === forms.tripForm) {
      setTitle(t('trip form'))
      setDescription(t('instructions.trip.intro'))
    } else if (props.formID === forms.birdAtlas) {
      setTitle(t('bird atlas'))
      setDescription(t('instructions.bird.intro'))
    } else if (props.formID === forms.fungiAtlas) {
      setTitle(t('fungi atlas'))
      setDescription(t('instructions.fungi.intro'))
    } else if (props.formID === forms.dragonflyForm) {
      setTitle(t('dragonfly form'))
      setDescription(t('instructions.dragonfly.intro'))
    } else if (props.formID === forms.butterflyForm) {
      setTitle(t('butterfly form'))
      setDescription(t('instructions.butterfly.intro'))
    } else if (props.formID === forms.largeFlowersForm) {
      setTitle(t('large flowers form'))
      setDescription(t('instructions.largeFlowers.intro'))
    } else if (props.formID === forms.mothForm) {
      setTitle(t('moth form'))
      setDescription(t('instructions.moth.intro'))
    } else if (props.formID === forms.bumblebeeForm) {
      setTitle(t('bumblebee form'))
      setDescription(t('instructions.bumblebee.intro'))
    } else if (props.formID === forms.herpForm) {
      setTitle(t('herp form'))
      setDescription(t('instructions.herp.intro'))
    } else if (props.formID === forms.subarcticForm) {
      setTitle(t('subarctic form'))
      setDescription(t('instructions.subarctic.intro'))
    } else if (props.formID === forms.macrolichenForm) {
      setTitle(t('macrolichen form'))
      setDescription(t('instructions.macrolichen.intro'))
    } else if (props.formID === forms.bracketFungiForm) {
      setTitle(t('bracket fungi form'))
      setDescription(t('instructions.bracketFungi.intro'))
    } else if (props.formID === forms.practicalFungiForm) {
      setTitle(t('practical fungi form'))
      setDescription(t('instructions.practicalFungi.intro'))
    } else {
      setTitle(t('lolife'))
      setDescription(t('instructions.lolife.intro'))
    }
  }, [i18n.language])

  const onPress = async () => {
    if (props.alternativeEffect) {
      await props.alternativeEffect()
    } else {
      props.setModalVisibility(true)
    }
  }

  if (observing) {
    return (
      <View style={{ marginVertical: 5, width: '90%' }}>
        <TouchableOpacity onPress={() => null} activeOpacity={0.8} style={[Cs.shadowElement, { shadowColor: Colors.neutralShadow }]}>
          <View style={Cs.eventLauncherContainer}>
            <Text style={[Ts.formLauncherTitle, { color: Colors.neutral6 }]}>{title}</Text>
            <Text style={[Ts.formLauncherText, { color: Colors.neutral6 }]}>{description}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  } else {
    return (
      <View style={{ marginVertical: 5, width: '90%' }}>
        <TouchableOpacity onPress={async () => await onPress()} activeOpacity={0.8} style={[Cs.shadowElement, { shadowColor: Colors.primaryShadow }]}>
          <View style={Cs.eventLauncherContainer}>
            <Text style={[Ts.formLauncherTitle, { color: Colors.primary5 }]}>{title}</Text>
            <Text style={[Ts.formLauncherText, { color: Colors.neutral9 }]}>{description}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

export default FormLauncherComponent