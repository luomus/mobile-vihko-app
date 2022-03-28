import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
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
import ModalFilterPicker from 'react-native-modal-filter-picker'
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
  const [shown, setShown] = useState<boolean>(false)
  const [options, setOptions] = useState<Record<string, any>[]>([])

  useEffect(() => {
    setOptions(createZonesList())

  }, [i18n.language, observationZone.zones])

  const createZonesList = () => {
    if (observationZone.zones.length <= 0) {
      return [{
        key: undefined,
        label: ''
      }]
    } else {
      return observationZone.zones.map((region: Record<string, any>) => {
        return {
          key: region.id,
          label: region.name === '' ? t('no zone') : region.name
        }
      })
    }
  }

  const refreshZonesList = async () => {
    try {
      props.setLoading(true)
      await dispatch(initObservationZones())
    } catch (error) {
      props.showError(error.message)
      props.setModalVisibility(false)
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
              <TouchableOpacity onPress={() => setShown(true)}>
                <Text style={{ alignSelf: 'flex-start', fontSize: 16, padding: 8 }}>{options.find((option) => option.key === observationZone.currentZoneId)?.label}</Text>
              </TouchableOpacity>
              <ModalFilterPicker
                visible={shown}
                onSelect={(item: Record<string, any>) => {
                  dispatch(setCurrentObservationZone(item.key))
                  setShown(false)
                }}
                onCancel={() => setShown(false)}
                options={options}
                selectedOption={observationZone.currentZoneId}
                placeholderText={t('choose observation zone')}
                overlayStyle={Cs.filterPickerOverlayContainer}
                listContainerStyle={Cs.filterPickerContainer}
                renderCancelButton={() => { return null }}
              />
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
        <View style={Cs.modalStartButtonContainer}>
          <View style={Cs.padding5Container}>
            <ButtonComponent onPressFunction={() => handleStartEvent()} title={t('beginObservation')}
              height={40} width={120} buttonStyle={Bs.beginButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={'play-arrow'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
            />
          </View>
          <View style={Cs.padding5Container}>
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

export default ZoneModalComponent