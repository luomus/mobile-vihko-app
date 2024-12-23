import React, { useEffect, useState } from 'react'
import { Modal, View, Text, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Checkbox from 'expo-checkbox'
import { useTranslation } from 'react-i18next'
import {
  RootState,
  DispatchType,
  setTracking,
  updateLocation,
  setGrid,
  setMessageState
} from '../../stores'
import storageService from '../../services/storageService'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { LocationObject } from 'expo-location'
import { convertWGS84ToYKJ, getCurrentLocation } from '../../helpers/geolocationHelper'
import MessageComponent from '../general/MessageComponent'
import { forms } from '../../config/fields'

type Props = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  onBeginObservationEvent: (tracking: boolean) => void,
  formID: string
}

const CompleteListModalComponent = (props: Props) => {

  const [loading, setLoading] = useState<boolean>(false)
  const [northing, setNorthing] = useState<string>('00')
  const [easting, setEasting] = useState<string>('00')

  const tracking = useSelector((state: RootState) => state.tracking)

  const { t } = useTranslation()

  const dispatch: DispatchType = useDispatch()

  const setLocation = async () => {
    let location: LocationObject
    try {
      setLoading(true)
      location = await getCurrentLocation(false, 5)
      dispatch(updateLocation(location))
    } catch (error: any) {
      setLoading(false)
      showError(error.message)
      return
    }

    const ykjLocation = convertWGS84ToYKJ([location.coords.longitude, location.coords.latitude])

    setEasting(ykjLocation[0].toString().slice(0, 2))
    setNorthing(ykjLocation[1].toString().slice(0, 2))

    setLoading(false)
  }

  useEffect(() => {
    if (props.modalVisibility) {
      setLocation()
    }
  }, [props.modalVisibility])

  const handleStartEvent = async () => {
    setLoading(true)

    dispatch(setGrid({
      n: Number(northing),
      e: Number(easting),
      geometry: undefined,
      name: 'complete list default',
      pauseGridCheck: false,
      outsideBorders: 'false'
    }))

    setLoading(false)
    props.setModalVisibility(false)
    props.onBeginObservationEvent(tracking)
  }

  const description = () => {
    let formTranslation = ''

    if (props.formID === forms.dragonflyForm) {
      formTranslation = t('dragonfly form')
    } else if (props.formID === forms.butterflyForm) {
      formTranslation = t('butterfly form')
    } else if (props.formID === forms.largeFlowersForm) {
      formTranslation = t('large flowers form')
    } else if (props.formID === forms.mothForm) {
      formTranslation = t('moth form')
    } else if (props.formID === forms.bumblebeeForm) {
      formTranslation = t('bumblebee form')
    } else if (props.formID === forms.herpForm) {
      formTranslation = t('herp form')
    } else if (props.formID === forms.subarcticForm) {
      formTranslation = t('subarctic form')
    } else if (props.formID === forms.macrolichenForm) {
      formTranslation = t('macrolichen form')
    } else if (props.formID === forms.bracketFungiForm) {
      formTranslation = t('bracket fungi form')
    } else if (props.formID === forms.practicalFungiForm) {
      formTranslation = t('practical fungi form')
    }

    return t('do you want to start an event?') + ' ' + formTranslation + '?'
  }

  const showError = (error: string) => {
    dispatch(setMessageState({
      type: 'err',
      messageContent: error,
      onOk: () => props.setModalVisibility(false)
    }))
  }

  return (
    <Modal visible={props.modalVisibility} onRequestClose={() => { props.setModalVisibility(false) }}>
      <TouchableWithoutFeedback onPress={() => { props.setModalVisibility(false) }}>
        {loading ?
          <View style={Cs.newModalContainer}>
            <TouchableWithoutFeedback>
              <View style={Cs.modalLoadingContainer}>
                <ActivityIndicator size={25} color={Colors.primary5} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          :
          <View style={Cs.newModalContainer}>
            <TouchableWithoutFeedback>
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
                    <ButtonComponent onPressFunction={async () => await handleStartEvent()} title={t('start')}
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
            </TouchableWithoutFeedback>
          </View>
        }
      </TouchableWithoutFeedback>
      <MessageComponent />
    </Modal>
  )
}

export default CompleteListModalComponent