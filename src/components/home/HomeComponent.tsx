import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, BackHandler } from 'react-native'
import ObservationEventListComponent from './EventListElementComponent'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import {
  rootState,
  DispatchType,
  setCurrentObservationZone,
  setObserving,
  setObservationId,
  setObservationEventInterrupted,
  setMessageState,
  switchSchema,
  beginObservationEvent,
  continueObservationEvent,
  logoutUser,
  resetReducer
} from '../../stores'
import { useDispatch, useSelector } from 'react-redux'
import { useBackHandler } from '@react-native-community/hooks'
import * as Clipboard from 'expo-clipboard'
import MessageComponent from '../general/MessageComponent'
import ActivityComponent from '../general/ActivityComponent'
import AppJSON from '../../../app.json'
import storageService from '../../services/storageService'
import FormLauncherComponent from './FormLauncherComponent'
import UnfinishedEventComponent from './UnifinishedEventComponent'
import ZoneModalComponent from './ZoneModalComponent'
import GridModalComponent from './GridModalComponent'

type Props = {
  isFocused: () => boolean,
  onLogout: () => void,
  onPressMap: () => void,
  onPressObservationEvent: (id: string) => void,
  onPressFinishObservationEvent: (sourcePage: string) => void
}

const HomeComponent = (props: Props) => {
  const [pressCounter, setPressCounter] = useState<number>(0)
  const [observationEvents, setObservationEvents] = useState<Element[]>([])
  const [zoneModalVisibility, setZoneModalVisibility] = useState<boolean>(false)
  const [gridModalVisibility, setGridModalVisibility] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { t } = useTranslation()
  let logTimeout: NodeJS.Timeout | undefined
  const credentials = useSelector((state: rootState) => state.credentials)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const observationZone = useSelector((state: rootState) => state.observationZone)
  const observing = useSelector((state: rootState) => state.observing)
  const schema = useSelector((state: rootState) => state.schema)

  const dispatch: DispatchType = useDispatch()

  useEffect(() => {
    const length = observationEvent.events.length
    let isUnfinished: boolean = false

    if (length >= 1) {
      isUnfinished = !observationEvent.events[length - 1].gatheringEvent.dateEnd
    }

    let formID = 'JX.519'

    const initSchema = async () => {
      let formID = await storageService.fetch('formID')
      await dispatch(switchSchema(formID))
    }

    initSchema()

    if (isUnfinished) {
      dispatch(setObserving(true))
      dispatch(setObservationEventInterrupted(true))
      if (formID === 'MHL.45') { dispatch(setCurrentObservationZone(getLastZoneId())) }
    }
  }, [])

  useEffect(() => {
    loadObservationEvents()
  }, [observationEvent, observing, schema])

  useEffect(() => {
    //set first zone in array as selected zone to avoid undefined values
    if (observationZone.currentZoneId === '' && observationZone.zones.length > 0) {
      dispatch(setCurrentObservationZone(observationZone?.zones[0].id))
    }
  }, [observationZone])

  useEffect(() => {
    if (pressCounter > 0 && !logTimeout) {
      logTimeout = setTimeout(() => {
        setPressCounter(0)
        logTimeout = undefined
      }, 5000)
    }

    const logHandler = async () => {
      if (pressCounter === 5) {
        const logs: any[] = await storageService.fetch('logs')
        clipboardConfirmation(logs)
        setPressCounter(0)
      }
    }

    logHandler()
  }, [pressCounter])

  const loadObservationEvents = () => {
    const events: Array<Element> = []
    const indexLast: number = observationEvent.events.length - 1
    observationEvent.events.forEach((event: Record<string, any>, index: number) => {
      if (observing && index === indexLast) {
        return
      }
      events.push(<ObservationEventListComponent key={event.id} observationEvent={event} onPress={() => props.onPressObservationEvent(event.id)} />)
    })

    setObservationEvents(events)
  }

  //handle back press in homescreen by asking user if they wish to exit the app
  useBackHandler(() => {
    if (props.isFocused() && observing) {
      dispatch(setMessageState({
        type: 'dangerConf',
        messageContent: t('exit app?'),
        cancelLabel: t('cancel'),
        okLabel: t('exit'),
        onOk: () => BackHandler.exitApp()
      }))

      return true
    }

    return false
  })

  const onBeginObservationEvent = async (formID: string, zoneUsed: boolean) => {
    setLoading(true)

    //save the used form before beginning an event
    if (!observing) {
      await dispatch(switchSchema(formID))
      await storageService.save('formID', formID)
    }

    const title: string = t('notification title')
    const body: string = t('notification body')

    try {
      await dispatch(beginObservationEvent(props.onPressMap, zoneUsed, title, body))
    } catch (error) {
      if (error.severity === 'high') {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => {
            props.onLogout()
            dispatch(logoutUser())
            dispatch(resetReducer())
          }
        }))
      } else {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
        }))
      }
    }

    setLoading(false)
  }

  const onContinueObservationEvent = async () => {

    const title: string = t('notification title')
    const body: string = t('notification body')
    try {
      await dispatch(continueObservationEvent(props.onPressMap, title, body))
    } catch (error) {
      if (error.severity === 'high') {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => {
            props.onLogout()
            dispatch(logoutUser())
            dispatch(resetReducer())
          }
        }))
      } else {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
        }))
      }
    }
  }

  const getLastZoneId = () => {
    const zone = observationZone.zones.find((zone: Record<string, any>) => {
      return zone.name === observationEvent.events?.[observationEvent.events.length - 1].gatherings[1].locality
    })

    return zone ? zone.id : ''
  }

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
        props.onPressFinishObservationEvent('home')
      }
    }))
  }

  const clipboardConfirmation = (logs: any[] | null) => {
    if (logs !== null && logs !== []) {
      dispatch(setMessageState({
        type: 'dangerConf',
        messageContent: t('copy log to clipboard?'),
        okLabel: t('yes'),
        cancelLabel: t('no'),
        onOk: () => Clipboard.setString(JSON.stringify(logs, null, '  '))
      }))
    } else {
      dispatch(setMessageState({
        type: 'msg',
        messageContent: t('no logs')
      }))
    }
  }

  const showLaunchConfirmation = (formID: string) => {
    let formTranslation = t('trip report form')
    if (formID === 'JX.652') formTranslation = t('fungi atlas')
    dispatch(setMessageState({
      type: 'conf',
      messageContent: t('do you want to start an event?') + ' ' + formTranslation + '?',
      okLabel: t('beginObservation'),
      cancelLabel: t('cancel'),
      onOk: () => onBeginObservationEvent(formID, false)
    }))
  }

  const showError = (error: string) => {
    dispatch(setMessageState({
      type: 'err',
      messageContent: error
    }))
  }

  if (loading) {
    return (
      <ActivityComponent text={'loading'} />
    )
  } else {
    return (
      <>
        <ScrollView contentContainerStyle={Cs.contentAndVersionContainer}>
          <View style={Cs.homeContentContainer}>
            {observing ?
              <UnfinishedEventComponent onContinueObservationEvent={onContinueObservationEvent} stopObserving={stopObserving} />
              :
              null
            }
            <Text style={Ts.previousObservationsTitle}>{t('new observation event')}</Text>
            <FormLauncherComponent formID={'JX.519'} showLaunchConfirmation={showLaunchConfirmation} setModalVisibility={setZoneModalVisibility} />
            <FormLauncherComponent formID={'MHL.117'} showLaunchConfirmation={showLaunchConfirmation} setModalVisibility={setGridModalVisibility} />
            <FormLauncherComponent formID={'JX.652'} showLaunchConfirmation={showLaunchConfirmation} setModalVisibility={setZoneModalVisibility} />
            {
              credentials.permissions?.includes('HR.2951') ?
                <FormLauncherComponent formID={'MHL.45'} showLaunchConfirmation={showLaunchConfirmation} setModalVisibility={setZoneModalVisibility} />
                : null
            }
            <Text style={Ts.previousObservationsTitle}>{t('previous observation events')}</Text>
            {observationEvents}
          </View>
          <View style={Cs.versionContainer}>
            <Text
              style={Ts.alignedRightText}
              onPress={() => setPressCounter(pressCounter + 1)}>
              {t('version')} {AppJSON.expo.version}
            </Text>
          </View>
        </ScrollView>
        <ZoneModalComponent modalVisibility={zoneModalVisibility} setModalVisibility={setZoneModalVisibility}
          onBeginObservationEvent={(zoneUsed) => { onBeginObservationEvent('MHL.45', zoneUsed) }}
          setLoading={setLoading} showError={showError} />
        <GridModalComponent modalVisibility={gridModalVisibility} setModalVisibility={setGridModalVisibility}
          onBeginObservationEvent={(zoneUsed) => { onBeginObservationEvent('MHL.117', zoneUsed) }}
          setLoading={setLoading} showError={showError} />
        <MessageComponent />
      </>
    )
  }
}

export default HomeComponent