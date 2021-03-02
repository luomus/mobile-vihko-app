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
  switchSchema,
  setObservationEventInterrupted
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
  continueObservationEvent
} from '../../actionCreators/observationEventCreators'
import { connect, ConnectedProps } from 'react-redux'
import { useBackHandler, useClipboard } from '@react-native-community/hooks'
import { SchemaType, ObservationEventType } from '../../stores/observation/types'
import { CredentialsType } from '../../stores/user/types'
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

interface RootState {
  formId: string,
  position: LocationObject,
  path: LocationObject[],
  observing: boolean,
  observation: LatLng,
  observationEvent: ObservationEventType,
  observationEventInterrupted: boolean,
  schema: SchemaType,
  credentials: CredentialsType,
  centered: boolean
}

const mapStateToProps = (state: RootState) => {
  const { position, path, observing, observation, observationEvent, observationEventInterrupted, schema, credentials, centered } = state
  return { position, path, observing, observation, observationEvent, observationEventInterrupted, schema, credentials, centered }
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
  continueObservationEvent,
  setObservationEventInterrupted
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

  useEffect(() => {
    const length = props.observationEvent.events.length
    let isUnfinished: boolean = false

    if (length >= 1) {
      isUnfinished = !props.observationEvent.events[length - 1].gatheringEvent.dateEnd
    }

    if (isUnfinished) {
      props.toggleObserving()
      props.setObservationEventInterrupted(true)
    }

    const initTab = async () => {
      let formID = await storageService.fetch('formID')
      if (!formID) {
        formID = 'JX.519'
      }

      setSelectedTab(availableForms.findIndex(form => form === formID))
      await props.switchSchema(formID)
    }

    initTab()
  }, [])

  useEffect(() => {
    loadObservationEvents()
  }, [props.observationEvent, props.observing, props.schema])

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

  //handle back press in homescreen by asking user if they wish to exit the app
  useBackHandler(() => {
    if (props.isFocused() && props.observing) {
      props.setMessageState({
        type: 'dangerConf',
        messageContent: t('exit app?'),
        onOk: () => BackHandler.exitApp()
      })

      return true
    }

    return false
  })

  const onBeginObservationEvent = async () => {
    await props.beginObservationEvent(props.onPressMap)
  }

  const onContinueObservationEvent = async () => {
    await props.continueObservationEvent(props.onPressMap)
  }

  const stopObserving = () => {
    props.setMessageState({
      type: 'dangerConf',
      messageContent: t('stop observing'),
      onOk: () => {
        props.setObservationId({
          eventId: props.observationEvent?.events?.[props?.observationEvent?.events?.length - 1].id,
          unitId: null
        })
        props.onPressFinishObservationEvent('HomeComponent')
      }
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
    if (!props.observing) {
      await props.switchSchema(availableForms[ind])
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
                {props.observing ?
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

export default withNavigation(connector(HomeComponent))