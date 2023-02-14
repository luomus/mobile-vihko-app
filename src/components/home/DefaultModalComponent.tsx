import React from 'react'
import { View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Checkbox from 'expo-checkbox'
import Modal from 'react-native-modal'
import { useTranslation } from 'react-i18next'
import {
  rootState,
  DispatchType,
  setTracking
} from '../../stores'
import storageService from '../../services/storageService'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { forms } from '../../config/fields'

type Props = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  onBeginObservationEvent: (tracking: boolean) => void,
  formID: string
}

const DefaultModalComponent = (props: Props) => {

  const tracking = useSelector((state: rootState) => state.tracking)

  const { t } = useTranslation()

  const dispatch: DispatchType = useDispatch()

  const handleStartEvent = () => {
    props.setModalVisibility(false)
    props.onBeginObservationEvent(tracking)
  }

  const description = () => {
    let formTranslation = t('trip form')
    if (props.formID === forms.fungiAtlas) formTranslation = t('fungi atlas')
    return t('do you want to start an event?') + ' ' + formTranslation + '?'
  }

  return (
    <Modal isVisible={props.modalVisibility} backdropOpacity={10} onBackButtonPress={() => { props.setModalVisibility(false) }}
      onBackdropPress={() => { props.setModalVisibility(false) }}>
      <View style={Cs.modalContainer}>
        <View style={{ alignSelf: 'flex-start' }}>
          <Text style={Ts.homeScreenTitle}>
            {t('new observation event')}
          </Text>
          <Text style={Ts.zonePickerDescription}>
            {description()}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
            <Checkbox
              value={tracking}
              onValueChange={async (value: boolean) => {
                dispatch(setTracking(value))
                await storageService.save('tracking', value)
              }}
              style={{ padding: 5 }}
              color={tracking ? Colors.primary5 : undefined}
            />
            <Text style={{ color: Colors.neutral7, padding: 5 }}>{t('path tracking')}</Text>
          </View>
          <View style={Cs.modalStartButtonContainer}>
            <ButtonComponent onPressFunction={() => handleStartEvent()} title={t('start')}
              height={40} width={120} buttonStyle={Bs.beginButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={'play-arrow'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
            />
            <ButtonComponent onPressFunction={() => props.setModalVisibility(false)} title={t('cancel')}
              height={40} width={120} buttonStyle={Bs.beginButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'cancel'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default DefaultModalComponent