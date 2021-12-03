import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { Shadow } from 'react-native-shadow-2'
import i18n from '../../languages/i18n'
import { useTranslation } from 'react-i18next'
import { rootState } from '../../stores'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'

type Props = {
  formID: string,
  onBeginObservationEvent: (zoneUsed: boolean) => void,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

const FormLauncherComponent = (props: Props) => {

  const { t } = useTranslation()

  const [title, setTitle] = useState<string>(t('beginObservationTripForm'))
  const [description, setDescription] = useState<string>(t('instructions.mobilevihko.intro'))

  const observationZone = useSelector((state: rootState) => state.observationZone)
  const observing = useSelector((state: rootState) => state.observing)

  useEffect(() => {
    if (props.formID === 'JX.519') {
      setTitle(t('trip report form'))
      setDescription(t('instructions.mobilevihko.intro'))
    } else if (props.formID === 'JX.652') {
      setTitle(t('fungi atlas'))
      setDescription(t('instructions.mobilevihko.intro.fungi'))
    } else {
      setTitle(t('mobile app'))
      setDescription(t('instructions.lolife.intro'))
    }
  }, [i18n.language])

  const handleBeginEvent = () => {
    //open zone modal if form is lolife and zones have been loaded successfully
    if (props.formID === 'MHL.45' && observationZone.zones.length > 0) {
      props.setModalVisibility(true)
      //else start an event without zone
    } else {
      props.onBeginObservationEvent(false)
    }
  }

  if (observing) {
    return (
      <View style={{ marginVertical: 5, width: '90%' }}>
        <Shadow startColor={Colors.neutralShadow} finalColor={Colors.neutralShadow} distance={2} radius={5}
          offset={[0, 1]} paintInside={true} viewStyle={{ alignSelf: 'stretch' }}>
          <TouchableOpacity onPress={() => null} activeOpacity={0.8}>
            <View style={Cs.eventLauncherContainer}>
              <Text style={[Ts.formLauncherTitle, { color: Colors.neutral6 }]}>{title}</Text>
              <Text style={[Ts.formLauncherText, { color: Colors.neutral6 }]}>{description}</Text>
            </View>
          </TouchableOpacity>
        </Shadow>
      </View>
    )
  } else {
    return (
      <View style={{ marginVertical: 5, width: '90%' }}>
        <Shadow startColor={Colors.primaryShadow} finalColor={Colors.primaryShadow} distance={2} radius={5}
          offset={[0, 1]} paintInside={true} viewStyle={{ alignSelf: 'stretch' }}>
          <TouchableOpacity onPress={() => { handleBeginEvent() }} activeOpacity={0.8}>
            <View style={Cs.eventLauncherContainer}>
              <Text style={[Ts.formLauncherTitle, { color: Colors.primary5 }]}>{title}</Text>
              <Text style={[Ts.formLauncherText, { color: Colors.neutral9 }]}>{description}</Text>
            </View>
          </TouchableOpacity>
        </Shadow>
      </View>
    )
  }
}

export default FormLauncherComponent