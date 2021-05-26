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
    <View style={Cs.observationEventContainer}>
      <Text style={Ts.observationEventTitle}>
        {observationEventInterrupted ?
          t('interrupted observation event') :
          t('event')
        }
      </Text>
      <View style={Cs.buttonContainer}>
        <View style={Cs.padding5Container}>
          <ButtonComponent onPressFunction={() => props.onContinueObservationEvent()} title={t('continue')}
            height={40} width={150} buttonStyle={Bs.continueButton}
            gradientColorStart={Colors.primary1} gradientColorEnd={Colors.primary2} shadowColor={Colors.primaryShadow}
            textStyle={Ts.buttonText} iconName={'map-outline'} iconType={'material-community'} iconSize={22} contentColor={Colors.whiteText}
          />
        </View>
        <View style={Cs.padding5Container}>
          <ButtonComponent onPressFunction={() => props.stopObserving()} title={t('cancelObservation')}
            height={40} width={150} buttonStyle={Bs.endButton}
            gradientColorStart={Colors.neutral} gradientColorEnd={Colors.neutral} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={'stop'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
          />
        </View>
      </View>
    </View>)
}

export default UnfinishedEventViewComponent