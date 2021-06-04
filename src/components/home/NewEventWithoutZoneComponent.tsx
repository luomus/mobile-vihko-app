import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import ButtonComponent from '../general/ButtonComponent'
import i18n from '../../languages/i18n'
import { useTranslation } from 'react-i18next'

type Props = {
  selectedTab: number,
  onBeginObservationEvent: () => Promise<void>
}

const NewEventWithoutZoneComponent = (props: Props) => {

  const { t } = useTranslation()

  const [ beginButtonText, setBeginButtonText ] = useState<string>(t('beginObservationTripForm'))

  useEffect(() => {
    if (props.selectedTab === 0) {
      setBeginButtonText(t('beginObservationTripForm'))
    } else if (props.selectedTab === 1) {
      setBeginButtonText(t('beginObservationFungiAtlas'))
    } else {
      setBeginButtonText(t('beginObservation'))
    }
  }, [props.selectedTab, i18n.language])

  return (
    <View style={Cs.observationEventContainer}>
      <View style={Cs.buttonContainer}>
        <ButtonComponent onPressFunction={props.onBeginObservationEvent} title={beginButtonText}
          height={40} width={300} buttonStyle={Bs.beginButton}
          gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
          textStyle={Ts.buttonText} iconName={'play-arrow'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
        />
      </View>
    </View>
  )
}

export default NewEventWithoutZoneComponent