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
  setTracking
} from '../../stores'
import storageService from '../../services/storageService'
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
  const grid = useSelector((state: rootState) => state.grid)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const path = useSelector((state: rootState) => state.path)
  const schema = useSelector((state: rootState) => state.schema)
  const tracking = useSelector((state: rootState) => state.tracking)

  const stopObserving = () => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('stop observing'),
      okLabel: t('stop'),
      cancelLabel: t('do not stop'),
      onOk: async () => {
        dispatch(setObservationId({
          eventId: observationEvent?.events?.[observationEvent?.events?.length - 1].id,
          unitId: null
        }))

        //save the path before stopping
        const location: LocationType = await getCurrentLocation(true)
        await dispatch(appendPath([location]))

        if (path) {
          await dispatch(eventPathUpdate(pathToLineStringConstructor(path)))
        }

        props.onPressFinishObservationEvent('map')
      }
    }))
  }

  const pauseObserving = async () => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('pause tracking'),
      okLabel: t('pause'),
      cancelLabel: t('cancel'),
      onOk: async () => {
        const location: LocationType = await getCurrentLocation(true)

        dispatch(setTracking(false))
        await storageService.save('tracking', false)

        await dispatch(appendPath([location]))

        if (path) {
          await dispatch(eventPathUpdate(pathToLineStringConstructor(path)))
        }

        await stopBackgroundLocationAsync()
      }
    }))
  }

  const unpauseObserving = async () => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('unpause tracking'),
      okLabel: t('continue'),
      cancelLabel: t('cancel'),
      onOk: async () => {
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
        } catch (error: any) {
          log.error({
            location: '/stores/shared/actions.tsx continueObservationEvent()/watchLocationAsync()',
            error: error,
            user_id: credentials.user ? credentials.user.id : 'No user id.'
          })
          return Promise.reject({
            severity: 'low',
            message: `${t('could not use gps so event was not started')} ${error}`
          })
        }

        dispatch(setTracking(true))
        await storageService.save('tracking', true)
      }
    }))
  }

  return (
    <View style={Cs.stopObservingContainer}>
      <View style={{ flexDirection: 'row', width: '50%' }}>
        <View style={{ paddingHorizontal: 2, width: '50%' }}>
          <ButtonComponent onPressFunction={() => { stopObserving()}} title={t('stop')}
            height={30} width={'100%'} buttonStyle={Bs.stopObservingButton} gradientColorStart={Colors.dangerButton1}
            gradientColorEnd={Colors.dangerButton2} shadowColor={Colors.dangerShadow} textStyle={Ts.buttonText}
            iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.whiteText} noMargin
          />
        </View>
        <View style={{ paddingHorizontal: 2, width: '50%' }}>
          <ButtonComponent disabled={grid?.outsideBorders === 'true'}
            onPressFunction={async () => { tracking ? await pauseObserving() : await unpauseObserving() }}
            title={tracking ? t('pause') : t('continue')} height={30} width={'100%'} buttonStyle={Bs.stopObservingButton}
            gradientColorStart={grid?.outsideBorders !== 'true' ? Colors.neutralButton : Colors.unavailableButton}
            gradientColorEnd={grid?.outsideBorders !== 'true' ? Colors.neutralButton : Colors.unavailableButton}
            shadowColor={Colors.neutralShadow} textStyle={Ts.buttonText}
            iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.darkText} noMargin
          />
        </View>
      </View>
      {schema.formID === forms.birdAtlas || schema.formID === forms.dragonflyForm ?
        <View style={{ flexDirection: 'row', width: '50%' }}>
          <View style={{ paddingHorizontal: 2, width: '50%' }}>
            {props.onPressMap === undefined ?
              <SelectedButtonComponent onPress={() => null} title={t('map')} height={30} color={Colors.neutral5}
                textStyle={Ts.mapToListButtonText} textColor={Colors.darkText} noMargin
              /> :
              <ButtonComponent onPressFunction={() => { props.onPressMap === undefined ? null : props.onPressMap() }} title={t('map')}
                height={30} width={'100%'} buttonStyle={Bs.stopObservingButton} gradientColorStart={Colors.neutralButton}
                gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow} textStyle={Ts.buttonText}
                iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.darkText} noMargin
              />
            }
          </View>
          <View style={{ paddingHorizontal: 2, width: '50%' }}>
            {props.onPressList === undefined ?
              <SelectedButtonComponent onPress={() => null} title={t('list')} height={30} color={Colors.neutral5}
                textStyle={Ts.mapToListButtonText} textColor={Colors.darkText} noMargin
              /> :
              <ButtonComponent onPressFunction={() => { props.onPressList === undefined ? null : props.onPressList() }} title={t('list')}
                height={30} width={'100%'} buttonStyle={Bs.stopObservingButton} gradientColorStart={Colors.neutralButton}
                gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow} textStyle={Ts.buttonText}
                iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.darkText} noMargin
              />
            }
          </View>
        </View>
        : null}
    </View>
  )
}

export default ExtendedNavBarComponent