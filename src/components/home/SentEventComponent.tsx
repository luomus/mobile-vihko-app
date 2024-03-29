import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import { useTranslation } from 'react-i18next'
import i18n from '../../languages/i18n'
import { forms } from '../../config/fields'
import { parseFromWarehouseToUI } from '../../helpers/dateHelper'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'

interface Props {
  event: Record<string, any>
}

const SentEventComponent = (props: Props) => {

  const { t } = useTranslation()

  const [title, setTitle] = useState<string>(t('trip form'))

  useEffect(() => {
    const formLink: string = props.event.formID
    const formLinkParts = formLink.split('/')
    const formId = formLinkParts[formLinkParts.length - 1]

    if (formId === forms.tripForm) {
      setTitle(t('trip form'))
    } else if (formId === forms.birdAtlas) {
      setTitle(t('bird atlas'))
    } else if (formId === forms.fungiAtlas) {
      setTitle(t('fungi atlas'))
    } else if (formId === forms.dragonflyForm) {
      setTitle(t('dragonfly form'))
    } else if (formId === forms.butterflyForm) {
      setTitle(t('butterfly form'))
    } else if (formId === forms.largeFlowersForm) {
      setTitle(t('large flowers form'))
    } else if (formId === forms.mothForm) {
      setTitle(t('moth form'))
    } else if (formId === forms.bumblebeeForm) {
      setTitle(t('bumblebee form'))
    } else if (formId === forms.herpForm) {
      setTitle(t('herp form'))
    } else if (formId === forms.subarcticForm) {
      setTitle(t('subarctic form'))
    } else if (formId === forms.macrolichenForm) {
      setTitle(t('macrolichen form'))
    } else if (formId === forms.bracketFungiForm) {
      setTitle(t('bracket fungi form'))
    } else if (formId === forms.practicalFungiForm) {
      setTitle(t('practical fungi form'))
    } else {
      setTitle(t('lolife'))
    }
  }, [i18n.language])

  return (
    <View style={{ marginVertical: 5, width: '90%' }}>
      <TouchableOpacity onPress={() => Linking.openURL('http://tun.fi/' + props.event.id)}
        activeOpacity={0.8} style={[Cs.shadowElement, { shadowColor: Colors.successShadow }]}>
        <View style={Cs.sentEventsContainer}>
          <Text style={[Ts.eventListElementTitle, { color: Colors.successButton1 }]}>
            {title}
          </Text>
          <Text style={Ts.eventListElementThinTitle}>
            {parseFromWarehouseToUI(props.event.dateCreated)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default SentEventComponent