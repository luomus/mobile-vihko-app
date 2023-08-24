import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Ts from '../../styles/TextStyles'
import { useTranslation } from 'react-i18next'
import i18n from '../../languages/i18n'
import { biomonForms, forms } from '../../config/fields'
import { parseDateFromDocumentToUI } from '../../helpers/dateHelper'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

interface Props {
  observationEvent: Record<string, any>,
  onPress: () => void,
}

const EventListElementComponent = (props: Props) => {

  const { t } = useTranslation()

  const dateBegin = props.observationEvent.gatheringEvent.dateBegin
  const dateEnd = props.observationEvent.gatheringEvent.dateEnd

  const [title, setTitle] = useState<string>(t('trip form'))

  const observationCount = (): number => {
    if (!props.observationEvent) {
      return 0
    } else if (props.observationEvent.formID !== forms.birdAtlas) {
      return props.observationEvent.gatherings[0].units.length
    } else {
      let sum = 0
      props.observationEvent.gatherings[0].units.forEach((unit: Record<string, any>) => {
        if (props.observationEvent.formID === forms.birdAtlas && (!(unit.id.includes('complete_list') && !unit.atlasCode && !unit.count)) ||
          Object.values(biomonForms).includes(props.observationEvent.formID) && (!(unit.id.includes('complete_list') && !unit.count))) {
          sum += 1
        }
      })
      return sum
    }
  }

  useEffect(() => {
    if (props.observationEvent.formID === forms.tripForm) {
      setTitle(t('trip form'))
    } else if (props.observationEvent.formID === forms.birdAtlas) {
      setTitle(t('bird atlas'))
    } else if (props.observationEvent.formID === forms.fungiAtlas) {
      setTitle(t('fungi atlas'))
    } else if (props.observationEvent.formID === forms.dragonflyForm) {
      setTitle(t('dragonfly form'))
    } else if (props.observationEvent.formID === forms.butterflyForm) {
      setTitle(t('butterfly form'))
    } else if (props.observationEvent.formID === forms.largeFlowersForm) {
      setTitle(t('large flowers form'))
    } else if (props.observationEvent.formID === forms.mothForm) {
      setTitle(t('moth form'))
    } else if (props.observationEvent.formID === forms.bumblebeeForm) {
      setTitle(t('bumblebee form'))
    } else if (props.observationEvent.formID === forms.herpForm) {
      setTitle(t('herp form'))
    } else if (props.observationEvent.formID === forms.subarcticForm) {
      setTitle(t('subarctic form'))
    } else if (props.observationEvent.formID === forms.macrolichenForm) {
      setTitle(t('macrolichen form'))
    } else if (props.observationEvent.formID === forms.bracketFungiForm) {
      setTitle(t('bracket fungi form'))
    } else if (props.observationEvent.formID === forms.practicalFungiForm) {
      setTitle(t('bracket fungi form'))
    } else {
      setTitle(t('lolife'))
    }
  }, [i18n.language])

  const displayDateTime = () => {
    if (props.observationEvent.gatheringEvent?.timeStart) {
      return parseDateFromDocumentToUI(dateBegin + 'T' + props.observationEvent.gatheringEvent.timeStart) + ' - '
        + parseDateFromDocumentToUI(dateEnd + 'T' + props.observationEvent.gatheringEvent.timeEnd)
    } else {
      return parseDateFromDocumentToUI(dateBegin) + ' - ' + parseDateFromDocumentToUI(dateEnd)
    }
  }


  return (
    <View style={{ marginVertical: 5, width: '90%' }}>
      <TouchableOpacity onPress={props.onPress} activeOpacity={0.8} style={[Cs.shadowElement, { shadowColor: Colors.dangerShadow }]}>
        <View style={Cs.unsentEventsContainer} >
          <Text style={[Ts.eventListElementTitle, { color: Colors.dangerButton1 }]}>{title}</Text>
          <Text style={Ts.eventListElementTextClear}>{displayDateTime()}</Text>
          <Text style={Ts.eventListElementTextFaded}>{t('observations in list') + ': ' + observationCount() + ' ' + (observationCount() === 1 ? t('piece') : t('pieces'))}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default EventListElementComponent