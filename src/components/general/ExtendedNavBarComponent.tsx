import React from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  rootState,
  DispatchType,
  setObservationId,
  setMessageState
} from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import SelectedButtonComponent from './SelectedButtonComponent'

type Props = {
  onPressMap: (() => void) | undefined,
  onPressList: (() => void) | undefined,
  onPressFinishObservationEvent: (sourcePage: string) => void
}

const ExtendedNavBarComponent = (props: Props) => {

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const schema = useSelector((state: rootState) => state.schema)

  const stopObserving = () => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('stop observing'),
      okLabel: t('cancelObservation'),
      cancelLabel: t('do not stop'),
      onOk: () => {
        dispatch(setObservationId({
          eventId: observationEvent?.events?.[observationEvent?.events?.length - 1].id,
          unitId: null
        }))
        props.onPressFinishObservationEvent('map')
      }
    }))
  }

  return (
    <View style={Cs.stopObservingContainer}>
      <ButtonComponent onPressFunction={() => stopObserving()} title={t('stop observation event')}
        height={30} width={150} buttonStyle={Bs.stopObservingButton}
        gradientColorStart={Colors.dangerButton1} gradientColorEnd={Colors.dangerButton2} shadowColor={Colors.dangerShadow}
        textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.whiteText}
      />
      {schema.formID === 'MHL.117' ?
        <View style={{ flexDirection: 'row' }}>
          <View style={{ paddingHorizontal: 2 }}>
            {props.onPressMap === undefined ?
              <SelectedButtonComponent
                onPress={() => null}
                title={t('map')} height={30} width={80}
                color={Colors.neutral5}
                textStyle={Ts.mapToListButtonText}
                textColor={Colors.darkText}
              /> :
              <ButtonComponent onPressFunction={() => { props.onPressMap === undefined ? null : props.onPressMap() }} title={t('map')}
                height={30} width={80} buttonStyle={Bs.stopObservingButton}
                gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.darkText}
              />
            }
          </View>
          <View style={{ paddingHorizontal: 2 }}>
            {props.onPressList === undefined ?
              <SelectedButtonComponent
                onPress={() => null}
                title={t('list')} height={30} width={80}
                color={Colors.neutral5}
                textStyle={Ts.mapToListButtonText}
                textColor={Colors.darkText}
              /> :
              <ButtonComponent onPressFunction={() => { props.onPressList === undefined ? null : props.onPressList() }} title={t('list')}
                height={30} width={80} buttonStyle={Bs.stopObservingButton}
                gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.darkText}
              />
            }
          </View>
        </View>
        : null}
    </View>
  )
}

export default ExtendedNavBarComponent