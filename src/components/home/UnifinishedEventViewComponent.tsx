import React from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { rootState } from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { useTranslation } from 'react-i18next'

type Props = {
  onContinueObservationEvent: () => Promise<void>,
  stopObserving: () => void
}

const UnfinishedEventViewComponent = (props: Props) => {

  const observationEventInterrupted = useSelector((state: rootState) => state.observationEventInterrupted)

  const { t } = useTranslation()

  return (
    <View style={Cs.eventLauncherContainer}>
      <Text style={Ts.observationEventTitle}>
        {observationEventInterrupted ?
          t('interrupted observation event') :
          t('event')
        }
      </Text>
      <View style={Cs.unfinishedEventButtonsContainer}>
        <View style={Cs.padding5Container}>
          <ButtonComponent onPressFunction={() => props.onContinueObservationEvent()} title={t('continue')}
            height={40} width={120} buttonStyle={Bs.continueButton}
            gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
            textStyle={Ts.buttonText} iconName={'map-outline'} iconType={'material-community'} iconSize={22} contentColor={Colors.whiteText}
          />
        </View>
        <View style={Cs.padding5Container}>
          <ButtonComponent onPressFunction={() => props.stopObserving()} title={t('cancelObservation')}
            height={40} width={120} buttonStyle={Bs.endButton}
            gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={'stop'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
          />
        </View>
      </View>
    </View>)
}

export default UnfinishedEventViewComponent