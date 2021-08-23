import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Ts from '../../styles/TextStyles'
import { useTranslation } from 'react-i18next'
import { parseDateForUI } from '../../helpers/dateHelper'
import { Icon } from 'react-native-elements'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

interface Props {
  observationEvent: Record<string, any>,
  onPress: () => void,
}

const ObservationEventListElementComponent = (props: Props) => {

  const { t } = useTranslation()
  const dateBegin = props.observationEvent.gatheringEvent.dateBegin
  const dateEnd = props.observationEvent.gatheringEvent.dateEnd
  const observationCount = props.observationEvent.gatherings[0].units.length

  return (
    <TouchableOpacity style={Cs.eventsListItemContainer} onPress={props.onPress}>
      <View style={Ts.observationEventListElement}>
        <Text>{parseDateForUI(dateBegin)} - {parseDateForUI(dateEnd)}</Text>
        <Text style={Ts.indentedText}>
          {t('observationsInList') + ': ' + observationCount + ' ' + (observationCount === 1 ? t('piece') : t('pieces'))}
        </Text>
      </View>
      <View style={Cs.eyeIconContainer}>
        <Icon name='eye-outline' color={Colors.neutral7} type='material-community' size={35} />
      </View>
    </TouchableOpacity>
  )
}

export default ObservationEventListElementComponent