import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Ts from '../styles/TextStyles'
import { useTranslation } from 'react-i18next'
import { parseDateForUI } from '../utilities/dateHelper'
import { Icon } from 'react-native-elements'
import Cs from '../styles/ContainerStyles'

interface Props {
  observationEvent: Record<string, any>,
  onPress: () => void,
}

const ObservationEventListElementComponent = (props: Props) => {

  const { t } = useTranslation()
  const dateBegin = props.observationEvent.gatheringEvent.dateBegin
  const dateEnd = props.observationEvent.gatheringEvent.dateEnd
  const observationCount = props.observationEvent.gatherings[0].units.length
  const observationZone = props.observationEvent.gatherings[0].locality

  return (
    <TouchableOpacity style={Cs.observationEventListItemContainer} onPress={props.onPress}>
      <View style={Ts.observationEventListElement}>
        <Text>{parseDateForUI(dateBegin)} - {parseDateForUI(dateEnd)}</Text>
        <Text style={Ts.indentedText}>
          {t('zoneInList') + `: ${observationZone ? observationZone : t('no zone')}`}
        </Text>
        <Text style={Ts.indentedText}>
          {t('observationsInList') + ': ' + observationCount + ' ' + (observationCount === 1 ? t('piece') : t('pieces'))}
        </Text>
      </View>
      <View style={Cs.alignRightContainer}>
        <Icon name='eye-outline' color='dimgray' type='material-community' size={35} />
      </View>
    </TouchableOpacity>
  )
}

export default ObservationEventListElementComponent