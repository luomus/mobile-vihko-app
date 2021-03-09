import React from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { Button, Icon } from 'react-native-elements'
import { rootState } from '../../stores'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import { useTranslation } from 'react-i18next'

type Props = {
  onContinueObservationEvent: () => Promise<void>,
  stopObserving: () => void
}

const UnfinishedEventViewComponent = (props: Props) => {

  const observationEventInterrupted = useSelector((state: rootState) => state.observationEventInterrupted)

  const { t } = useTranslation()

  return (
    <View style={Cs.observationEventContainer}>
      <Text style={Ts.observationEventTitle}>
        {observationEventInterrupted ?
          t('interrupted observation event') :
          t('event')
        }
      </Text>
      <View style={Cs.buttonContainer}>
        <Button
          containerStyle={Cs.continueButtonContainer}
          buttonStyle={Bs.continueButton}
          title={observationEventInterrupted ? t('continue unfinished') : t('continue')}
          iconRight={true}
          icon={<Icon name='map-outline' type='material-community' color='white' size={22} />}
          onPress={() => props.onContinueObservationEvent()}
        />
        <Button
          containerStyle={Cs.endButtonContainer}
          buttonStyle={Bs.endButton}
          title={t('cancelObservation')}
          iconRight={true}
          icon={<Icon name='stop' type='material-icons' color='white' size={22} />}
          onPress={() => props.stopObserving()}
        />
      </View>
    </View>)
}

export default UnfinishedEventViewComponent