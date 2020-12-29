import React from 'react'
import { View, Text } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { useTranslation } from 'react-i18next'

type Props = {
  onBeginObservationEvent: (zoneUsed: boolean) => void
}

const NewEventWithoutZoneComponent = (props: Props) => {

  const { t } = useTranslation()

  return (
    <View style={Cs.observationEventContainer}>
      <Text style={Ts.observationEventTitle}>
        {t('new observation event without zone')}
      </Text>
      <View style={Cs.buttonContainer}>
        <Button
          containerStyle={Cs.beginButtonContainer}
          buttonStyle={{ backgroundColor: Colors.positiveColor }}
          title={t('beginObservation')}
          iconRight={true}
          icon={<Icon name='play-arrow' type='material-icons' color={'white'} size={22} />}
          onPress={() => props.onBeginObservationEvent(false)}
        />
      </View>
    </View>
  )
}

export default NewEventWithoutZoneComponent