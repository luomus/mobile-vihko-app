import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Ts from '../../styles/TextStyles'
import { useTranslation } from 'react-i18next'
import i18n from '../../languages/i18n'
import { Shadow } from 'react-native-shadow-2'
import { forms } from '../../config/fields'
import { parseDateForUI } from '../../helpers/dateHelper'
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
        if (!(unit.id.includes('complete_list') && !unit.atlasCode  && !unit.count)) { sum += 1 }
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
    } else {
      setTitle(t('lolife'))
    }
  }, [i18n.language])

  const displayDateTime = () => {
    if (props.observationEvent.gatheringEvent?.timeStart) {
      return parseDateForUI(dateBegin + 'T' + props.observationEvent.gatheringEvent.timeStart) + ' - '
      + parseDateForUI(dateEnd + 'T' + props.observationEvent.gatheringEvent.timeEnd)
    } else {
      return parseDateForUI(dateBegin) + ' - ' + parseDateForUI(dateEnd)
    }
  }

  return (
    <View style={{ marginVertical: 5, width: '90%' }}>
      <Shadow startColor={Colors.dangerShadow} finalColor={Colors.dangerShadow} distance={2} radius={5}
        offset={[0, 1]} paintInside={true} viewStyle={{ alignSelf: 'stretch' }}>
        <TouchableOpacity onPress={props.onPress} activeOpacity={0.8}>
          <View style={Cs.unsentEventsContainer} >
            <Text style={[Ts.eventListElementTitle, { color: Colors.dangerButton1 }]}>{title}</Text>
            <Text style={Ts.eventListElementTextClear}>{displayDateTime()}</Text>
            <Text style={Ts.eventListElementTextFaded}>{t('observations in list') + ': ' + observationCount() + ' ' + (observationCount() === 1 ? t('piece') : t('pieces'))}</Text>
          </View>
        </TouchableOpacity>
      </Shadow>
    </View>
  )
}

export default EventListElementComponent