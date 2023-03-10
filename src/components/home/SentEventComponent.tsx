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
    const formLink: string = props.event.aggregateBy['document.formId']
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
    } else {
      setTitle(t('lolife'))
    }
  }, [i18n.language])

  return (
    <View style={{ marginVertical: 5, width: '90%' }}>
      <TouchableOpacity onPress={() => Linking.openURL(props.event.aggregateBy['document.documentId'])}
        activeOpacity={0.8} style={[Cs.shadowElement, { shadowColor: Colors.successShadow }]}>
        <View style={Cs.sentEventsContainer}>
          <Text style={[Ts.eventListElementTitle, { color: Colors.successButton1 }]}>
            {title}
          </Text>
          <Text style={Ts.eventListElementThinTitle}>
            {parseFromWarehouseToUI(props.event.aggregateBy['document.createdDate'])}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default SentEventComponent