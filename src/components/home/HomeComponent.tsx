import React, { useState, useEffect, ReactChild } from 'react'
import { View, Text, ScrollView, BackHandler } from 'react-native'
import MaterialTabs from 'react-native-material-tabs'
import UserInfoComponent from './UserInfoComponent'
import ObservationEventListComponent from './ObservationEventListElementComponent'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { LocationObject } from 'expo-location'
import { LatLng } from 'react-native-maps'
import {
  toggleObserving,
  newObservationEvent,
  replaceObservationEventById,
  clearObservationLocation,
  setObservationId,
  switchSchema
} from '../../stores/observation/actions'
import {
  toggleCentered,
  clearRegion
} from '../../stores/map/actions'
import { setMessageState } from '../../stores/message/actions'
import {
  updateLocation,
  clearLocation,
  appendPath,
  setPath,
  clearPath,
} from '../../stores/position/actions'
import {
  beginObservationEvent,
  finishObservationEvent
} from '../../actionCreators/home/homeActionCreators'
import { connect, ConnectedProps } from 'react-redux'
import { watchLocationAsync } from '../../geolocation/geolocation'
import { useBackHandler, useClipboard } from '@react-native-community/hooks'
import { SchemaType, ObservationEventType } from '../../stores/observation/types'
import { CredentialsType } from '../../stores/user/types'
import MessageComponent from '../general/MessageComponent'
import { withNavigation } from 'react-navigation'
import ActivityComponent from '../general/ActivityComponent'
import AppJSON from '../../../app.json'
import storageController from '../../services/storageService'
import { log } from '../../utilities/logger'
import { HomeIntroductionComponent } from './HomeIntroductionComponent'
import NewEventWithoutZoneComponent from './NewEventWithoutZoneComponent'
import UnfinishedEventViewComponent from './UnifinishedEventViewComponent'
import { availableForms } from '../../config/fields'

interface BasicObject {
  [key: string]: any
}

interface RootState {
  position: LocationObject,
  path: LocationObject[],
  observing: boolean,
  observation: LatLng,
  observationEvent: ObservationEventType,
  schema: SchemaType,
  credentials: CredentialsType,
  centered: boolean
}

const mapStateToProps = (state: RootState) => {
  const { position, path, observing, observation, observationEvent, schema, credentials, centered } = state
  return { position, path, observing, observation, observationEvent, schema, credentials, centered }
}

const mapDispatchToProps = {
  appendPath,
  setPath,
  clearPath,
  updateLocation,
  clearLocation,
  toggleObserving,
  newObservationEvent,
  replaceObservationEventById,
  clearObservationLocation,
  setMessageState,
  clearRegion,
  toggleCentered,
  setObservationId,
  switchSchema,
  beginObservationEvent,
  finishObservationEvent
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
)

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  isFocused: () => boolean,
  onLogout: () => void,
  onPressMap: () => void,
  onPressObservationEvent: (id: string) => void,
  onPressFinishObservationEvent: () => void,
  obsStopped: boolean,
  navigation: any,
  children?: ReactChild
}

const HomeComponent = (props: Props) => {
  const [pressCounter, setPressCounter] = useState<number>(0)
  const [observationEvents, setObservationEvents] = useState<Element[]>([])
  const [unfinishedEvent, setUnfinishedEvent] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const { t } = useTranslation()
  const [data, setString] = useClipboard()
  let focusListener: any
  let logTimeout: NodeJS.Timeout | undefined

  useEffect(() => {
    const length = props.observationEvent.events.length
    const isUnfinished = length && !props.observationEvent.events[length - 1].gatheringEvent.dateEnd

    if (isUnfinished) {
      props.toggleObserving()
      setUnfinishedEvent(true)
    }

    const initTab = async () => {
      if (isUnfinished) {
        const formID = props.observationEvent.events[length - 1].formID

        setSelectedTab(availableForms.findIndex(form => form === formID))
        await props.switchSchema(formID)
      } else {
        await props.switchSchema(availableForms[0])
      }
    }

    initTab()
  }, [])

  useEffect(() => {
    loadObservationEvents()
  }, [props.observationEvent, props.observing, props.schema])

  useEffect(() => {
    focusListener = props.navigation.addListener('willFocus', ({ action }) => {
      if (action.params?.obsStopped) {
        onFinishObservationEvent()
        props.navigation.setParams({ obsStopped: false })
      }
    })
    return () => focusListener.remove()
  }, [props.observationEvent])

  useEffect(() => {
    if (pressCounter > 0 && !logTimeout) {
      logTimeout = setTimeout(() => {
        setPressCounter(0)
        logTimeout = undefined
      }, 5000)
    }

    const logHandler = async () => {
      if (pressCounter === 5) {
        const logs: any[] = await storageController.fetch('logs')
        clipboardConfirmation(logs)
        setPressCounter(0)
      }
    }

    logHandler()
  }, [pressCounter])

  const loadObservationEvents = () => {
    const events: Array<Element> = []
    const indexLast: number = props.observationEvent.events.length - 1
    props.observationEvent.events.forEach((event: BasicObject, index: number) => {
      if (props.observing && index === indexLast) {
        return
      }
      if (event.formID === props.schema.formID) {
        events.push(<ObservationEventListComponent key={event.id} observationEvent={event} onPress={() => props.onPressObservationEvent(event.id)} />)
      }
    })

    setObservationEvents(events)
  }

  //handle back press in homescreen by asking user if they fish to exit the app
  useBackHandler(() => {
    if (props.isFocused() && props.observing) {
      props.setMessageState({
        type: 'conf',
        messageContent: t('are you sure you want to cease observation and exit app'),
        onOk: () => onExit()
      })

      return true
    }

    return false
  })

  const onBeginObservationEvent = async () => {
    await props.beginObservationEvent(props.onPressMap)
  }

  const onFinishObservationEvent = async () => {
    setUnfinishedEvent(false)
    await props.finishObservationEvent(props.onPressFinishObservationEvent)
  }

  //if above is answered positively stop observation and exit app
  const onExit = async () => {
    await onFinishObservationEvent()
    BackHandler.exitApp()
  }

  const continueObservationEvent = async () => {
    if (!unfinishedEvent) {
      props.onPressMap()
      return
    }

    //atempt to start geolocation systems
    try {
      await watchLocationAsync(props.updateLocation)
    } catch (error) {
      log.error({
        location: '/components/HomeComponent.tsx continueObservationEvent()',
        error: error
      })
      props.setMessageState({
        type: 'err',
        messageContent: error.message
      })
      return
    }

    setUnfinishedEvent(false)

    //reset map centering and zoom level
    !props.centered ? props.toggleCentered() : null
    props.clearRegion()

    //set old path if exists
    const path = props.observationEvent.events?.[props.observationEvent.events.length - 1].gatherings[0]?.geometry.coordinates
    if (path) {
      props.setPath(path)
    }

    props.onPressMap()
  }

  const stopObserving = () => {
    props.setMessageState({
      type: 'dangerConf',
      messageContent: t('stop observing'),
      onOk: () => onFinishObservationEvent()
    })
  }

  const clipboardConfirmation = (logs: any[] | null) => {
    if (logs !== null && logs !== []) {
      props.setMessageState({
        type: 'dangerConf',
        messageContent: t('copy log to clipboard?'),
        okLabel: t('yes'),
        cancelLabel: t('no'),
        onOk: () => setString(JSON.stringify(logs, null, '  '))
      })
    } else {
      props.setMessageState({
        type: 'msg',
        messageContent: t('no logs')
      })
    }
  }

  const switchSelectedForm = async (ind: number) => {
    if (!props.observing && !unfinishedEvent) {
      await props.switchSchema(availableForms[ind])
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
                {props.observing ?
                  <UnfinishedEventViewComponent unfinishedEvent={unfinishedEvent} continueObservationEvent={continueObservationEvent} stopObserving={stopObserving} />
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

export default withNavigation(connector(HomeComponent))