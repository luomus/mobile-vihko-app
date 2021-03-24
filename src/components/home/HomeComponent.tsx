import React, { useState, useEffect, ReactChild } from 'react'
import { View, Text, ScrollView, BackHandler } from 'react-native'
import MaterialTabs from 'react-native-material-tabs'
import UserInfoComponent from './UserInfoComponent'
import ObservationEventListComponent from './ObservationEventListElementComponent'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import {
  rootState,
  DispatchType,
  toggleObserving,
  setObservationId,
  setObservationEventInterrupted,
  setMessageState,
  switchSchema,
  beginObservationEvent,
  continueObservationEvent
} from '../../stores'
import { useDispatch, useSelector } from 'react-redux'
import { useBackHandler, useClipboard } from '@react-native-community/hooks'
import MessageComponent from '../general/MessageComponent'
import { withNavigation } from 'react-navigation'
import ActivityComponent from '../general/ActivityComponent'
import AppJSON from '../../../app.json'
import storageService from '../../services/storageService'
import { HomeIntroductionComponent } from './HomeIntroductionComponent'
import NewEventWithoutZoneComponent from './NewEventWithoutZoneComponent'
import UnfinishedEventViewComponent from './UnifinishedEventViewComponent'
import { availableForms } from '../../config/fields'

interface BasicObject {
  [key: string]: any
}

type Props = {
  isFocused: () => boolean,
  onLogout: () => void,
  onPressMap: () => void,
  onPressObservationEvent: (id: string) => void,
  onPressFinishObservationEvent: (sourcePage: string) => void,
  navigation: any,
  children?: ReactChild
}

const HomeComponent = (props: Props) => {
  const [pressCounter, setPressCounter] = useState<number>(0)
  const [observationEvents, setObservationEvents] = useState<Element[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const { t } = useTranslation()
  const [data, setString] = useClipboard()
  let logTimeout: NodeJS.Timeout | undefined

  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const observing = useSelector((state: rootState) => state.observing)
  const schema = useSelector((state: rootState) => state.schema)

  const dispatch: DispatchType = useDispatch()

  useEffect(() => {
    const length = observationEvent.events.length
    let isUnfinished: boolean = false

    if (length >= 1) {
      isUnfinished = !observationEvent.events[length - 1].gatheringEvent.dateEnd
    }

    if (isUnfinished) {
      dispatch(toggleObserving())
      dispatch(setObservationEventInterrupted(true))
    }

    const initTab = async () => {
      let formID = await storageService.fetch('formID')
      if (!formID) {
        formID = 'JX.519'
      }

      setSelectedTab(availableForms.findIndex(form => form === formID))
      await dispatch(switchSchema(formID))
    }

    initTab()
  }, [])

  useEffect(() => {
    loadObservationEvents()
  }, [observationEvent, observing, schema])

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
    observationEvent.events.forEach((event: BasicObject, index: number) => {
      if (observing && index === indexLast) {
        return
      }
      if (event.formID === schema.formID) {
        events.push(<ObservationEventListComponent key={event.id} observationEvent={event} onPress={() => props.onPressObservationEvent(event.id)} />)
      }
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

  const onBeginObservationEvent = async () => {
    const title: string = t('notification title')
    const body: string = t('notification body')
    await dispatch(beginObservationEvent(props.onPressMap, title, body))
  }

  const onContinueObservationEvent = async () => {
    const title: string = t('notification title')
    const body: string = t('notification body')
    await dispatch(continueObservationEvent(props.onPressMap, title, body))
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
        props.onPressFinishObservationEvent('HomeComponent')
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
        onOk: () => setString(JSON.stringify(logs, null, '  '))
      }))
    } else {
      dispatch(setMessageState({
        type: 'msg',
        messageContent: t('no logs')
      }))
    }
  }

  const switchSelectedForm = async (ind: number) => {
    if (!observing) {
      await dispatch(switchSchema(availableForms[ind]))
      await storageService.save('formID', availableForms[ind])
      setSelectedTab(ind)
    }
  }

  if (loading) {
    return (
      <ActivityComponent text={'loading'} />
    )
  } else {
    return (
      <>
        <ScrollView contentContainerStyle={Cs.outerVersionContainer}>
          <View style={Cs.homeScrollContainer}>
            <View>
              <MaterialTabs
                items={[t('trip report form'), t('fungi atlas')]}
                selectedIndex={selectedTab}
                onChange={switchSelectedForm}
                barColor={Colors.blueBackground}
                indicatorColor="black"
                activeTextColor="black"
                inactiveTextColor="grey"
              />
            </View>
            <View style={{ height: 10 }}></View>
            <View style={{ justifyContent: 'flex-start' }}>
              <UserInfoComponent onLogout={props.onLogout} />
              <View style={Cs.homeContainer}>
                <HomeIntroductionComponent />
                <View style={{ height: 10 }}></View>
                {observing ?
                  <UnfinishedEventViewComponent onContinueObservationEvent={onContinueObservationEvent} stopObserving={stopObserving} />
                  :
                  <NewEventWithoutZoneComponent selectedTab={selectedTab} onBeginObservationEvent={onBeginObservationEvent} />
                }
                <View style={{ height: 10 }}></View>
                <View style={Cs.observationEventListContainer}>
                  <Text style={Ts.previousObservationsTitle}>{t('previous observation events')}</Text>
                  {observationEvents}
                </View>
                <View style={{ height: 10 }}></View>
              </View>
            </View>
          </View>
          <View style={Cs.versionContainer}>
            <Text
              style={Ts.alignedRightText}
              onPress={() => setPressCounter(pressCounter + 1)}>
              {t('version')} {AppJSON.expo.version}
            </Text>
          </View>
        </ScrollView>
        {props.children}
        <MessageComponent />
      </>
    )
  }
}

export default withNavigation(HomeComponent)