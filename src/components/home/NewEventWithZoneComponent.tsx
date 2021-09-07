import React, { useEffect } from 'react'
import { Text, Picker, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
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
import { useTranslation } from 'react-i18next'
import i18n from '../../languages/i18n'

interface BasicObject {
  [key: string]: any
}

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  onBeginObservationEvent: (zoneUsed: boolean) => Promise<void>,
  showError: (error: string) => void
}

const NewEventWithZoneComponent = (props: Props) => {

  const observationZone = useSelector((state: rootState) => state.observationZone)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  useEffect(() => {
    createZonesList()
  }, [i18n.language])

  const createZonesList = () => {
    if (observationZone.zones.length <= 0) {
      return <Picker.Item key={undefined} label={''} value={undefined} />
    } else {
      return observationZone.zones.map((region: BasicObject) =>
        <Picker.Item key={region.id} label={region.name === '' ? t('choose observation zone') : region.name} value={region.id} />
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

  return (
    <View style={Cs.eventLauncherContainer}>
      <View>
        <Text style={Ts.observationEventTitle}>
          {t('new observation event with zone')}
        </Text>
        <Text style={Ts.zoneText}>{t('observation zone')}</Text>
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
      <View style={Cs.buttonContainer}>
        {
          observationZone.currentZoneId === 'empty' ?
            <ButtonComponent onPressFunction={() => null} title={t('beginObservation')}
              height={40} width={300} buttonStyle={Bs.beginButton}
              gradientColorStart={Colors.unavailableButton} gradientColorEnd={Colors.unavailableButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'play-arrow'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
            :
            <ButtonComponent onPressFunction={() => props.onBeginObservationEvent(true)} title={t('beginObservation')}
              height={40} width={300} buttonStyle={Bs.beginButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={'play-arrow'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
            />
        }
      </View>
    </View>
  )
}

export default NewEventWithZoneComponent