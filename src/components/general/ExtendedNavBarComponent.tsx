import React from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  rootState,
  DispatchType,
  PathType,
  setObservationId,
  setMessageState,
  setPath,
  eventPathUpdate,
  appendPath,
  LocationType,
  pause,
  unpause
} from '../../stores'
import { forms } from '../../config/fields'
import { getCurrentLocation, stopBackgroundLocationAsync, watchBackgroundLocationAsync } from '../../helpers/geolocationHelper'
import { lineStringsToPathDeconstructor, pathToLineStringConstructor } from '../../helpers/geoJSONHelper'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import SelectedButtonComponent from './SelectedButtonComponent'
import { log } from '../../helpers/logger'

type Props = {
  onPressMap: (() => void) | undefined,
  onPressList: (() => void) | undefined,
  onPressFinishObservationEvent: (sourcePage: string) => void
}

const ExtendedNavBarComponent = (props: Props) => {

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  const credentials = useSelector((state: rootState) => state.credentials)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const path = useSelector((state: rootState) => state.path)
  const paused = useSelector((state: rootState) => state.paused)
  const schema = useSelector((state: rootState) => state.schema)

  const stopObserving = () => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('stop observing'),
      okLabel: t('stop'),
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

  const pauseObserving = async () => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('stop observing'),
      okLabel: 'Keskeytä',
      cancelLabel: 'Älä keskeytä',
      onOk: async () => {
        if (paused) {
          const title: string = t('gps notification title')
          const body: string = t('gps notification body')

          const path: PathType | undefined = lineStringsToPathDeconstructor(observationEvent.events[observationEvent.events.length - 1].gatherings[0]?.geometry)

          if (path) {
            path.push([])
            dispatch(setPath(path))
          } else {
            dispatch(setPath([[]]))
          }

          try {
            await watchBackgroundLocationAsync(title, body)
          } catch (error) {
            log.error({
              location: '/stores/shared/actions.tsx continueObservationEvent()/watchLocationAsync()',
              error: error,
              user_id: credentials.user.id
            })
            return Promise.reject({
              severity: 'low',
              message: `${t('could not use gps so event was not started')} ${error.message}`
            })
          }

          dispatch(unpause())
        } else {
          const location: LocationType = await getCurrentLocation()

          dispatch(pause())

          await dispatch(appendPath([location]))

          if (path) {
            await dispatch(eventPathUpdate(pathToLineStringConstructor(path)))
          }

          await stopBackgroundLocationAsync()
        }
      }
    }))
  }

  return (
    <View style={Cs.stopObservingContainer}>
      <ButtonComponent onPressFunction={() => stopObserving()} title={t('stop')}
        height={30} width={100} buttonStyle={Bs.stopObservingButton}
        gradientColorStart={Colors.dangerButton1} gradientColorEnd={Colors.dangerButton2} shadowColor={Colors.dangerShadow}
        textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.whiteText}
      />
      <ButtonComponent onPressFunction={async () => await pauseObserving()} title={'Keskeytä'}
        height={30} width={100} buttonStyle={Bs.stopObservingButton}
        gradientColorStart={Colors.dangerButton1} gradientColorEnd={Colors.dangerButton2} shadowColor={Colors.dangerShadow}
        textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.whiteText}
      />
      {schema.formID === forms.birdAtlas ?
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