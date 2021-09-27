import React, { useEffect } from 'react'
import { View, Picker, Text } from 'react-native'
import Modal from 'react-native-modal'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  rootState,
  DispatchType,
  setCurrentObservationZone,
  initObservationZones
} from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import i18n from '../../languages/i18n'

type Props = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  onBeginObservationEvent: (zoneUsed: boolean) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  showError: (error: string) => void
}

const ZoneModalComponent = (props: Props) => {

  const { t } = useTranslation()

  const observationZone = useSelector((state: rootState) => state.observationZone)

  const dispatch: DispatchType = useDispatch()

  useEffect(() => {
    createZonesList()
  }, [i18n.language])

  const createZonesList = () => {
    if (observationZone.zones.length <= 0) {
      return <Picker.Item key={undefined} label={''} value={undefined} />
    } else {
      return observationZone.zones.map((region: Record<string, any>) =>
        <Picker.Item key={region.id} label={region.name === '' ? t('no zone') : region.name} value={region.id} />
      )
    }
  }

  const refreshZonesList = async () => {
    try {
      props.setLoading(true)
      await dispatch(initObservationZones())
    } catch (error) {
      props.showError(error.message)
    } finally {
      props.setLoading(false)
    }
  }

  const handleStartEvent = () => {
    props.setModalVisibility(false)
    if (observationZone.currentZoneId === 'empty') {
      props.onBeginObservationEvent(false)
    } else {
      props.onBeginObservationEvent(true)
    }
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
            {t('zone picker description')}
          </Text>
          <View style={Cs.zoneEventLauncherContainer}>
            <View style={Cs.zonePickerContainer}>
              <Picker
                selectedValue={observationZone.currentZoneId}
                onValueChange={(itemValue: string) => {
                  dispatch(setCurrentObservationZone(itemValue))
                }}>
                {createZonesList()}
              </Picker>
            </View>
            <View style={Cs.padding5Container}>
              <ButtonComponent onPressFunction={() => refreshZonesList()} title={undefined}
                height={40} width={40} buttonStyle={Bs.refreshButton}
                gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={'refresh'} iconType={'material-community'} iconSize={22} contentColor={Colors.darkText}
              />
            </View>
          </View>
        </View>
        <View style={Cs.zonePickerButtonContainer}>
          <ButtonComponent onPressFunction={() => handleStartEvent()} title={t('beginObservation')}
            height={40} width={120} buttonStyle={Bs.beginButton}
            gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
            textStyle={Ts.buttonText} iconName={'play-arrow'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
          />
        </View>
      </View>
    </Modal>
  )
}

export default ZoneModalComponent