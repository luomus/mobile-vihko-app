import React, { useState, useEffect } from 'react'
import { Linking, View, Text, ScrollView, BackHandler, Platform } from 'react-native'
import ObservationEventListComponent from './EventListElementComponent'
import { TFunction, useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import {
  rootState,
  DispatchType,
  LocationType,
  setCurrentObservationZone,
  setObserving,
  setObservationId,
  setObservationEventInterrupted,
  setMessageState,
  switchSchema,
  beginObservationEvent,
  continueObservationEvent,
  logoutUser,
  resetReducer,
  appendPath,
  eventPathUpdate,
  setTracking,
  CredentialsType,
  ObservationEventType,
  ObservationZonesType,
  PathType,
  SchemaType
} from '../../stores'
import { useDispatch, useSelector } from 'react-redux'
import { useBackHandler } from '@react-native-community/hooks'
import * as Clipboard from 'expo-clipboard'
import { forms } from '../../config/fields'
import { playStoreUrl } from '../../config/urls'
import MessageComponent from '../general/MessageComponent'
import LoadingComponent from '../general/LoadingComponent'
import AppJSON from '../../../app.json'
import storageService from '../../services/storageService'
import FormLauncherComponent from './FormLauncherComponent'
import UnfinishedEventComponent from './UnifinishedEventComponent'
import SentEventComponent from './SentEventComponent'
import ZoneModalComponent from './ZoneModalComponent'
import AtlasInstructionModalComponent from './AtlasInstructionModalComponent'
import GridModalComponent from './GridModalComponent'
import DefaultModalComponent from './DefaultModalComponent'
import { getCurrentLocation } from '../../helpers/geolocationHelper'
import { pathToLineStringConstructor } from '../../helpers/geoJSONHelper'
import { updateIsAvailable } from '../../helpers/versionHelper'
import { getSentEvents } from '../../services/documentService'
import { getVersionNumber } from '../../services/versionService'
import i18n from '../../languages/i18n'
import CompleteListModalComponent from './CompleteListModalComponent'
import NewsComponent from './NewsComponent'

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
  const [sentEvents, setSentEvents] = useState<Element[]>([])
  const [tripModalVisibility, setTripModalVisibility] = useState<boolean>(false)
  const [atlasInstructionModalVisibility, setAtlasInstructionModalVisibility] = useState<boolean>(false)
  const [gridModalVisibility, setGridModalVisibility] = useState<boolean>(false)
  const [fungiModalVisibility, setFungiModalVisibility] = useState<boolean>(false)
  const [dragonflyModalVisibility, setDragonflyModalVisibility] = useState<boolean>(false)
  const [butterflyModalVisibility, setButterflyModalVisibility] = useState<boolean>(false)
  const [largeFlowersModalVisibility, setLargeFlowersModalVisibility] = useState<boolean>(false)
  const [mothModalVisibility, setMothModalVisibility] = useState<boolean>(false)
  const [zoneModalVisibility, setZoneModalVisibility] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const credentials = useSelector((state: rootState) => state.credentials)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const observationZone = useSelector((state: rootState) => state.observationZone)
  const observing = useSelector((state: rootState) => state.observing)
  const path = useSelector((state: rootState) => state.path)
  const schema = useSelector((state: rootState) => state.schema)

  const { t } = useTranslation()
  const dispatch: DispatchType = useDispatch()

  return <HomeComponentContainer
    isFocused={props.isFocused}
    onLogout={props.onLogout}
    onPressMap={props.onPressMap}
    onPressObservationEvent={props.onPressObservationEvent}
    onPressFinishObservationEvent={props.onPressFinishObservationEvent}

    pressCounter={pressCounter}
    setPressCounter={setPressCounter}
    observationEvents={observationEvents}
    setObservationEvents={setObservationEvents}
    sentEvents={sentEvents}
    setSentEvents={setSentEvents}
    tripModalVisibility={tripModalVisibility}
    setTripModalVisibility={setTripModalVisibility}
    atlasInstructionModalVisibility={atlasInstructionModalVisibility}
    setAtlasInstructionModalVisibility={setAtlasInstructionModalVisibility}
    gridModalVisibility={gridModalVisibility}
    setGridModalVisibility={setGridModalVisibility}
    fungiModalVisibility={fungiModalVisibility}
    setFungiModalVisibility={setFungiModalVisibility}
    dragonflyModalVisibility={dragonflyModalVisibility}
    setDragonflyModalVisibility={setDragonflyModalVisibility}
    butterflyModalVisibility={butterflyModalVisibility}
    setButterflyModalVisibility={setButterflyModalVisibility}
    largeFlowersModalVisibility={largeFlowersModalVisibility}
    setLargeFlowersModalVisibility={setLargeFlowersModalVisibility}
    mothModalVisibility={mothModalVisibility}
    setMothModalVisibility={setMothModalVisibility}
    zoneModalVisibility={zoneModalVisibility}
    setZoneModalVisibility={setZoneModalVisibility}
    loading={loading}
    setLoading={setLoading}

    credentials={credentials}
    observationEvent={observationEvent}
    observationZone={observationZone}
    observing={observing}
    path={path}
    schema={schema}

    t={t}
    dispatch={dispatch}

    fetch={storageService.fetch}
    save={storageService.save}
  />
}

type Props2 = {
  isFocused: () => boolean,
  onLogout: () => void,
  onPressMap: () => void,
  onPressObservationEvent: (id: string) => void,
  onPressFinishObservationEvent: (sourcePage: string) => void,

  pressCounter: number,
  setPressCounter: React.Dispatch<React.SetStateAction<number>>,
  observationEvents: Element[],
  setObservationEvents: React.Dispatch<React.SetStateAction<Element[]>>,
  sentEvents: Element[],
  setSentEvents: React.Dispatch<React.SetStateAction<Element[]>>
  tripModalVisibility: boolean,
  setTripModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  atlasInstructionModalVisibility: boolean,
  setAtlasInstructionModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  gridModalVisibility: boolean,
  setGridModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  fungiModalVisibility: boolean,
  setFungiModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  dragonflyModalVisibility: boolean,
  setDragonflyModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  butterflyModalVisibility: boolean,
  setButterflyModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  largeFlowersModalVisibility: boolean,
  setLargeFlowersModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  mothModalVisibility: boolean,
  setMothModalVisibility: React.Dispatch<React.SetStateAction<boolean>>
  zoneModalVisibility: boolean,
  setZoneModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  loading: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,

  credentials: CredentialsType,
  observationEvent: ObservationEventType,
  observationZone: ObservationZonesType,
  observing: boolean,
  path: PathType,
  schema: SchemaType,

  t: TFunction,
  dispatch: DispatchType,

  fetch: (key: string) => Promise<any>,
  save: (key: string, value: any) => Promise<void>
}

export const HomeComponentContainer = (
  props: Props2
) => {

  let logTimeout: NodeJS.Timeout | undefined

  useEffect(() => {
    props.setLoading(true)

    const length = props.observationEvent.events.length
    let isUnfinished = false

    if (length >= 1) {
      isUnfinished = !props.observationEvent.events[length - 1].gatheringEvent?.dateEnd
    }

    const checkUpdates = async () => {
      const appVersion = AppJSON.expo.version
      const latestVersion = await getVersionNumber()

      if (updateIsAvailable(appVersion, latestVersion)) {
        props.dispatch(setMessageState({
          type: 'conf',
          messageContent: props.t('update app'),
          cancelLabel: props.t('no'),
          okLabel: props.t('yes'),
          onOk: () => Linking.openURL(playStoreUrl)
        }))
      }
    }

    if (Platform.OS === 'android') checkUpdates()

    const initSentEvents = async () => {
      await loadSentEvents()
    }

    initSentEvents()

    if (isUnfinished) {
      const initTracking = async () => {
        const formID = props.observationEvent.events[length - 1].formID
        props.dispatch(setObserving(true))
        props.dispatch(setObservationEventInterrupted(true))
        if (formID === forms.lolife) { props.dispatch(setCurrentObservationZone(getLastZoneId())) }
        const savedTrackingMode = await props.fetch('tracking')
        props.dispatch(setTracking(savedTrackingMode))
        await onContinueObservationEvent()
      }

      initTracking()

    } else {
      props.setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadObservationEvents()
  }, [props.observationEvent, props.observing, props.schema])

  useEffect(() => {
    //set first zone in array as selected zone to avoid undefined values
    if (props.observationZone.currentZoneId === '' && props.observationZone.zones.length > 0) {
      props.dispatch(setCurrentObservationZone(props.observationZone?.zones[0].id))
    }
  }, [props.observationZone])

  useEffect(() => {
    if (props.pressCounter > 0 && !logTimeout) {
      logTimeout = setTimeout(() => {
        props.setPressCounter(0)
        logTimeout = undefined
      }, 5000)
    }

    const logHandler = async () => {
      if (props.pressCounter === 5) {
        const logs: any[] = await props.fetch('logs')
        clipboardConfirmation(logs)
        props.setPressCounter(0)
      }
    }

    logHandler()
  }, [props.pressCounter])

  const loadObservationEvents = () => {
    const events: Array<Element> = []
    const indexLast: number = props.observationEvent.events.length - 1
    props.observationEvent.events.forEach((event: Record<string, any>, index: number) => {
      if (props.observing && index === indexLast) {
        return
      }
      events.push(<ObservationEventListComponent key={event.id} observationEvent={event} onPress={() => props.onPressObservationEvent(event.id)} />)
    })

    props.setObservationEvents(events)
  }

  const loadSentEvents = async () => {
    let sentEvents: Record<string, any>[] = []
    try {
      sentEvents = await getSentEvents(props.credentials)
    } catch (error: any) {
      props.dispatch(setMessageState({
        type: 'err',
        messageContent: props.t('failed to fetch sent events'),
      }))
    }
    const sentEventElements: Element[] = []
    sentEvents.map(event => sentEventElements.push(
      <SentEventComponent key={event.aggregateBy['document.documentId']} event={event} />
    ))
    props.setSentEvents(sentEventElements)
  }

  //handle back press in homescreen by asking user if they wish to exit the app
  useBackHandler(() => {
    if (props.isFocused() && props.observing) {
      props.dispatch(setMessageState({
        type: 'dangerConf',
        messageContent: props.t('exit app?'),
        cancelLabel: props.t('cancel'),
        okLabel: props.t('exit'),
        onOk: () => BackHandler.exitApp()
      }))

      return true
    }

    return false
  })

  const onBeginObservationEvent = async (formID: string) => {
    props.setLoading(true)

    //save the used form before beginning an event
    if (!props.observing) {
      await props.dispatch(switchSchema(formID, i18n.language))
      await props.save('formID', formID)
    }

    const title: string = props.t('gps notification title')
    const body: string = props.t('gps notification body')

    try {
      await props.dispatch(beginObservationEvent(props.onPressMap, title, body))
    } catch (error: any) {
      if (error.severity === 'high') {
        props.dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => {
            props.onLogout()
            props.dispatch(logoutUser())
            props.dispatch(resetReducer())
          }
        }))
      } else {
        props.dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
        }))
      }
    }

    props.setLoading(false)
  }

  const onContinueObservationEvent = async () => {
    props.setLoading(true)

    const title: string = props.t('gps notification title')
    const body: string = props.t('gps notification body')

    try {
      await props.dispatch(continueObservationEvent(props.onPressMap, title, body))
    } catch (error: any) {
      if (error.severity === 'high') {
        props.dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => {
            props.onLogout()
            props.dispatch(logoutUser())
            props.dispatch(resetReducer())
          }
        }))
      } else {
        props.dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
        }))
      }
    }

    props.setLoading(false)
  }

  const getLastZoneId = () => {
    const zone = props.observationZone.zones.find((zone: Record<string, any>) => {
      return zone.name === props.observationEvent.events?.[props.observationEvent.events.length - 1].gatherings[1].locality
    })

    return zone ? zone.id : ''
  }

  const stopObserving = () => {
    props.dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: props.t('stop observing'),
      okLabel: props.t('stop'),
      cancelLabel: props.t('do not stop'),
      onOk: async () => {
        props.dispatch(setObservationId({
          eventId: props.observationEvent?.events?.[props.observationEvent?.events?.length - 1].id,
          unitId: null
        }))

        //save the path before stopping
        let location: LocationType
        try {
          location = await getCurrentLocation(true)
          await props.dispatch(appendPath([location]))
        } catch (error: any) {
          showError('Could not get the last location of path: ' + error)
        }

        if (props.path) {
          await props.dispatch(eventPathUpdate(pathToLineStringConstructor(props.path)))
        }

        props.onPressFinishObservationEvent('home')
      },
      testID: 'stopFromHomeMessage'
    }))
  }

  const clipboardConfirmation = (logs: any[] | null) => {
    if (logs !== null && logs.length > 0) {
      props.dispatch(setMessageState({
        type: 'dangerConf',
        messageContent: props.t('copy log to clipboard?'),
        okLabel: props.t('yes'),
        cancelLabel: props.t('no'),
        onOk: async () => await Clipboard.setStringAsync(JSON.stringify(logs, null, '  '))
      }))
    } else {
      props.dispatch(setMessageState({
        type: 'msg',
        messageContent: props.t('no logs')
      }))
    }
  }

  const showError = (error: string) => {
    props.dispatch(setMessageState({
      type: 'err',
      messageContent: error
    }))
  }

  if (props.loading) {
    return (
      <LoadingComponent text={'loading'} />
    )
  } else {
    return (
      <>
        <ScrollView contentContainerStyle={Cs.contentAndVersionContainer}>
          <View style={Cs.homeContentContainer}>
            <NewsComponent tag={'technical'} thisDay={true} />
            <NewsComponent tag={'mobiilivihko'} thisDay={false} />
            <>
              {props.observing ?
                <UnfinishedEventComponent onContinueObservationEvent={() => { onContinueObservationEvent() }}
                  stopObserving={stopObserving} />
                :
                null
              }
            </>
            <Text style={Ts.previousObservationsTitle}>{props.t('new observation event')}</Text>
            <FormLauncherComponent formID={forms.tripForm} setModalVisibility={props.setTripModalVisibility} />
            <FormLauncherComponent formID={forms.birdAtlas} setModalVisibility={props.setAtlasInstructionModalVisibility} />
            <FormLauncherComponent formID={forms.fungiAtlas} setModalVisibility={props.setFungiModalVisibility} />
            <FormLauncherComponent formID={forms.dragonflyForm} setModalVisibility={props.setDragonflyModalVisibility} />
            <FormLauncherComponent formID={forms.butterflyForm} setModalVisibility={props.setButterflyModalVisibility} />
            <FormLauncherComponent formID={forms.largeFlowersForm} setModalVisibility={props.setLargeFlowersModalVisibility} />
            <FormLauncherComponent formID={forms.mothForm} setModalVisibility={props.setMothModalVisibility} />
            <>
              {
                props.credentials.permissions?.includes('HR.2951') ?
                  <FormLauncherComponent formID={forms.lolife} setModalVisibility={props.setZoneModalVisibility} />
                  : null
              }
            </>
            <Text style={Ts.previousObservationsTitle}>{props.t('previous observation events')}</Text>
            <>{props.observationEvents}</>
            <Text style={Ts.previousObservationsTitle}>{props.t('sent observation events')}</Text>
            <>{props.sentEvents}</>
          </View>
          <View style={Cs.versionContainer}>
            <Text
              style={Ts.alignedRightText}
              onPress={() => props.setPressCounter(props.pressCounter + 1)}>
              {props.t('version')} {AppJSON.expo.version}
            </Text>
          </View>
        </ScrollView>
        <DefaultModalComponent modalVisibility={props.tripModalVisibility} setModalVisibility={props.setTripModalVisibility}
          onBeginObservationEvent={() => { onBeginObservationEvent(forms.tripForm) }} formID={forms.tripForm} />
        <AtlasInstructionModalComponent modalVisibility={props.atlasInstructionModalVisibility}
          setModalVisibility={props.setAtlasInstructionModalVisibility} setGridModalVisibility={props.setGridModalVisibility} />
        <GridModalComponent modalVisibility={props.gridModalVisibility} setModalVisibility={props.setGridModalVisibility}
          onBeginObservationEvent={() => { onBeginObservationEvent(forms.birdAtlas) }}
          setLoading={props.setLoading} />
        <DefaultModalComponent modalVisibility={props.fungiModalVisibility} setModalVisibility={props.setFungiModalVisibility}
          onBeginObservationEvent={() => { onBeginObservationEvent(forms.fungiAtlas) }} formID={forms.fungiAtlas} />
        <CompleteListModalComponent modalVisibility={props.dragonflyModalVisibility}
          setModalVisibility={props.setDragonflyModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.dragonflyForm) }}
          formID={forms.dragonflyForm} />
        <CompleteListModalComponent modalVisibility={props.butterflyModalVisibility}
          setModalVisibility={props.setButterflyModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.butterflyForm) }}
          formID={forms.butterflyForm} />
        <CompleteListModalComponent modalVisibility={props.largeFlowersModalVisibility}
          setModalVisibility={props.setLargeFlowersModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.largeFlowersForm) }}
          formID={forms.largeFlowersForm} />
        <CompleteListModalComponent modalVisibility={props.mothModalVisibility}
          setModalVisibility={props.setMothModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.mothForm) }}
          formID={forms.mothForm} />
        <ZoneModalComponent modalVisibility={props.zoneModalVisibility} setModalVisibility={props.setZoneModalVisibility}
          onBeginObservationEvent={() => { onBeginObservationEvent(forms.lolife) }}
          setLoading={props.setLoading} />
        <MessageComponent />
      </>
    )
  }
}

export default HomeComponent