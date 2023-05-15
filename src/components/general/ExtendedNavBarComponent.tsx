import React from 'react'
import { Text, View } from 'react-native'
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
import { biomonForms, forms } from '../../config/fields'
import { getCurrentLocation, stopBackgroundLocationAsync, watchBackgroundLocationAsync } from '../../helpers/geolocationHelper'
import { lineStringsToPathDeconstructor, pathToLineStringConstructor } from '../../helpers/geoJSONHelper'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { log } from '../../helpers/logger'

type Props = {
  onPressMap: (() => void) | undefined,
  onPressList: (() => void) | undefined,
  onPressFinishObservationEvent: (sourcePage: string) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
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
        props.setLoading(true)

        dispatch(setObservationId({
          eventId: observationEvent?.events?.[observationEvent?.events?.length - 1].id,
          unitId: null
        }))

        if (JSON.stringify(path) !== JSON.stringify([[]])) {
          //save the path before stopping
          try {
            const location: LocationType = await getCurrentLocation(true)
            await dispatch(appendPath([location]))

            if (path) {
              await dispatch(eventPathUpdate(pathToLineStringConstructor(path)))
            }
          } catch (error: any) {
            showError(error.message + ' ' + t('latest path point missing'))
          }
        }

        props.setLoading(false)
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
        dispatch(setTracking(false))
        await storageService.save('tracking', false)

        if (JSON.stringify(path) !== JSON.stringify([[]])) {
          try {
            const location: LocationType = await getCurrentLocation(true)
            await dispatch(appendPath([location]))

            if (path) {
              await dispatch(eventPathUpdate(pathToLineStringConstructor(path)))
            }
          } catch (error: any) {
            showError(error.message + ' ' + t('latest path point missing'))
          }
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

  const showError = (error: string) => {
    dispatch(setMessageState({
      type: 'err',
      messageContent: error
    }))
  }

  return (
    <View style={Cs.stopObservingContainer}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={Ts.trackingText}>{tracking ? t('tracking') : t('no tracking')}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
        <View style={{ paddingHorizontal: 2, width: 80 }}>
          <ButtonComponent disabled={grid?.outsideBorders === 'true'}
            onPressFunction={async () => { tracking ? await pauseObserving() : await unpauseObserving() }}
            title={tracking ? t('pause') : t('continue')} height={30} width={'100%'} buttonStyle={Bs.stopObservingButton}
            gradientColorStart={grid?.outsideBorders !== 'true' ? Colors.neutralButton : Colors.unavailableButton}
            gradientColorEnd={grid?.outsideBorders !== 'true' ? Colors.neutralButton : Colors.unavailableButton}
            shadowColor={Colors.neutralShadow} textStyle={Ts.buttonText}
            iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.darkText} noMargin
          />
        </View>
        <View style={{ paddingHorizontal: 2, width: 80 }}>
          <ButtonComponent onPressFunction={() => { stopObserving() }} title={t('stop')}
            height={30} width={'100%'} buttonStyle={Bs.stopObservingButton} gradientColorStart={Colors.dangerButton1}
            gradientColorEnd={Colors.dangerButton2} shadowColor={Colors.dangerShadow} textStyle={Ts.buttonText}
            iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.whiteText} noMargin
          />
        </View>
        {schema.formID === forms.birdAtlas || Object.values(biomonForms).includes(schema.formID) ?
          <View style={{ paddingHorizontal: 2, width: 80 }}>
            <ButtonComponent onPressFunction={() => props.onPressMap ? props.onPressMap() : props.onPressList ? props.onPressList() : undefined}
              title={props.onPressMap ? t('map') : t('list')} height={30} width={'100%'} buttonStyle={Bs.stopObservingButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.darkText} noMargin
            />
          </View>
          : null}
      </View>
    </View>
  )
}

export default ExtendedNavBarComponent