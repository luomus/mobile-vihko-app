import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { rootState } from '../../stores'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import ButtonComponent from '../general/ButtonComponent'
import i18n from '../../languages/i18n'
import { useTranslation } from 'react-i18next'

type Props = {
  formID: string,
  onBeginObservationEvent: (zoneUsed: boolean) => void
}

const NewEventWithoutZoneComponent = (props: Props) => {

  const { t } = useTranslation()

  const [beginButtonText, setBeginButtonText] = useState<string>(t('beginObservationTripForm'))

  const observing = useSelector((state: rootState) => state.observing)

  useEffect(() => {
    if (props.formID === 'JX.519') {
      setBeginButtonText(t('beginObservationTripForm'))
    } else if (props.formID === 'JX.652') {
      setBeginButtonText(t('beginObservationFungiAtlas'))
    } else {
      setBeginButtonText(t('beginObservation'))
    }
  }, [i18n.language])

  return (
    <View style={Cs.eventLauncherContainer}>
      <View style={Cs.buttonContainer}>
        {
          observing ?
            <ButtonComponent onPressFunction={() => null} title={beginButtonText}
              height={40} width={300} buttonStyle={Bs.beginButton}
              gradientColorStart={Colors.unavailableButton} gradientColorEnd={Colors.unavailableButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'play-arrow'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
            :
            <ButtonComponent onPressFunction={() => { props.onBeginObservationEvent(false) }} title={beginButtonText}
              height={40} width={200} buttonStyle={Bs.beginButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={'play-arrow'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
            />
        }
      </View>
    </View>
  )
}

export default NewEventWithoutZoneComponent