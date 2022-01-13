import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Ts from '../../styles/TextStyles'
import { useTranslation } from 'react-i18next'
import i18n from '../../languages/i18n'
import { Shadow } from 'react-native-shadow-2'
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
  const observationCount = props.observationEvent.gatherings[0].units.length

  const [title, setTitle] = useState<string>(t('beginObservationTripForm'))

  useEffect(() => {
    if (props.observationEvent.formID === 'JX.519') {
      setTitle(t('trip report form'))
    } else if (props.observationEvent.formID === 'MHL.117') {
      setTitle(t('bird atlas'))
    } else if (props.observationEvent.formID === 'JX.652') {
      setTitle(t('fungi atlas'))
    } else {
      setTitle(t('mobile app'))
    }
  }, [i18n.language])

  return (
    <View style={{ marginVertical: 5, width: '90%' }}>
      <Shadow startColor={Colors.dangerShadow} finalColor={Colors.dangerShadow} distance={2} radius={5}
        offset={[0, 1]} paintInside={true} viewStyle={{ alignSelf: 'stretch' }}>
        <TouchableOpacity onPress={props.onPress} activeOpacity={0.8}>
          <View style={Cs.unsentEventsContainer} >
            <Text style={[Ts.eventListElementTitle, { color: Colors.dangerButton1 }]}>{title}</Text>
            <Text style={Ts.eventListElementTextClear}>{parseDateForUI(dateBegin)} - {parseDateForUI(dateEnd)}</Text>
            <Text style={Ts.eventListElementTextFaded}>{t('observationsInList') + ': ' + observationCount + ' ' + (observationCount === 1 ? t('piece') : t('pieces'))}</Text>
          </View>
        </TouchableOpacity>
      </Shadow>
    </View>
  )
}

export default EventListElementComponent