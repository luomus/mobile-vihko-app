import React, { useState, useEffect } from 'react'
import { Linking, View, Text, ScrollView, BackHandler, Platform } from 'react-native'
import ObservationEventListComponent from './EventListElementComponent'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-native-elements'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import {
  RootState,
  DispatchType,
  LocationType,
  setCurrentObservationZone,
  setObserving,
  setObservationEventId,
  setObservationEventInterrupted,
  setMessageState,
  switchSchema,
  beginObservationEvent,
  continueObservationEvent,
  beginSingleObservation,
  logoutUser,
  resetReducer,
  appendPath,
  eventPathUpdate,
  setTracking,
} from '../../stores'
import { useDispatch, useSelector } from 'react-redux'
import { useBackHandler } from '@react-native-community/hooks'
import * as Clipboard from 'expo-clipboard'
import { forms } from '../../config/fields'
import { appStoreUrl, playStoreUrl } from '../../config/urls'
import MessageComponent from '../general/MessageComponent'
import LoadingComponent from '../general/LoadingComponent'
import AppJSON from '../../../app.json'
import storageService from '../../services/storageService'
import FormLauncherComponent from './FormLauncherComponent'
import UnfinishedEventComponent from './UnifinishedEventComponent'
import SentEventComponent from './SentEventComponent'
import ZoneModalComponent from './ZoneModalComponent'
import AtlasInstructionModalComponent from './AtlasInstructionModalComponent'
import CompleteListModalComponent from './CompleteListModalComponent'
import FormInfoModalComponent from './FormInfoModalComponent'
import GridModalComponent from './GridModalComponent'
import DefaultModalComponent from './DefaultModalComponent'
import { getCurrentLocation } from '../../helpers/geolocationHelper'
import { pathToLineStringConstructor } from '../../helpers/geoJSONHelper'
import { updateIsAvailable } from '../../helpers/versionHelper'
import { getSentEvents } from '../../services/documentService'
import { getVersionNumber } from '../../services/versionService'
import i18n from '../../languages/i18n'
import NewsComponent from './NewsComponent'
import Colors from '../../styles/Colors'

type Props = {
  isFocused: () => boolean,
  onLogout: () => void,
  onPressMap: () => void,
  onPressObservationEvent: (id: string) => void,
  onPressFinishObservationEvent: (sourcePage: string) => void
}

const HomeComponent = (props: Props) => {

  const [pressCounter, setPressCounter] = useState<number>(0)
  const [observationEvents, setObservationEvents] = useState<React.JSX.Element[]>([])
  const [sentEvents, setSentEvents] = useState<React.JSX.Element[]>([])
  const [tripModalVisibility, setTripModalVisibility] = useState<boolean>(false)
  const [atlasInstructionModalVisibility, setAtlasInstructionModalVisibility] = useState<boolean>(false)
  const [gridModalVisibility, setGridModalVisibility] = useState<boolean>(false)
  const [fungiModalVisibility, setFungiModalVisibility] = useState<boolean>(false)
  const [dragonflyModalVisibility, setDragonflyModalVisibility] = useState<boolean>(false)
  const [butterflyModalVisibility, setButterflyModalVisibility] = useState<boolean>(false)
  const [largeFlowersModalVisibility, setLargeFlowersModalVisibility] = useState<boolean>(false)
  const [mothModalVisibility, setMothModalVisibility] = useState<boolean>(false)
  const [bumblebeeModalVisibility, setBumblebeeModalVisibility] = useState<boolean>(false)
  const [herpModalVisibility, setHerpModalVisibility] = useState<boolean>(false)
  const [subarcticModalVisibility, setSubarcticModalVisibility] = useState<boolean>(false)
  const [macrolichenModalVisibility, setMacrolichenModalVisibility] = useState<boolean>(false)
  const [bracketFungiModalVisibility, setBracketFungiModalVisibility] = useState<boolean>(false)
  const [practicalFungiModalVisibility, setPracticalFungiModalVisibility] = useState<boolean>(false)
  const [zoneModalVisibility, setZoneModalVisibility] = useState<boolean>(false)
  const [completeListInfoModalVisibility, setCompleteListInfoModalVisibility] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const credentials = useSelector((state: RootState) => state.credentials)
  const observationEvent = useSelector((state: RootState) => state.observationEvent)
  const observationZone = useSelector((state: RootState) => state.observationZone)
  const observing = useSelector((state: RootState) => state.observing)
  const path = useSelector((state: RootState) => state.path)

  const { t } = useTranslation()
  const dispatch: DispatchType = useDispatch()

  let logTimeout: NodeJS.Timeout | undefined

  useEffect(() => {
    setLoading(true)

    const length = observationEvent.events.length
    let isUnfinished = false

    if (length >= 1) {
      isUnfinished = (observationEvent.events[length - 1].gatheringEvent?.dateEnd === undefined)
    }

    const checkUpdates = async () => {
      const appVersion = AppJSON.expo.version
      const latestVersion = await getVersionNumber()

      if (updateIsAvailable(appVersion, latestVersion)) {
        dispatch(setMessageState({
          type: 'conf',
          messageContent: t('update app'),
          cancelLabel: t('no'),
          okLabel: t('yes'),
          onOk: () => Platform.OS === 'android' ? Linking.openURL(playStoreUrl) : Linking.openURL(appStoreUrl)
        }))
      }
    }

    checkUpdates()

    if (isUnfinished) {
      const initTracking = async () => {
        const formID = observationEvent.events[length - 1].formID
        dispatch(setObserving(true))
        dispatch(setObservationEventInterrupted(true))
        if (formID === forms.lolife) { dispatch(setCurrentObservationZone(getLastZoneId())) }
        const savedTrackingMode = await storageService.fetch('tracking')
        dispatch(setTracking(savedTrackingMode))
        await onContinueObservationEvent()
      }

      initTracking()

    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadObservationEvents()
  }, [observationEvent.events, observing])

  useEffect(() => {
    const initSentEvents = async () => {
      await loadSentEvents()
    }

    initSentEvents()
  }, [observationEvent.events.length])

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
    const events: Array<React.JSX.Element> = []
    const indexLast: number = observationEvent.events.length - 1
    observationEvent.events.forEach((event: Record<string, any>, index: number) => {
      if (observing && index === indexLast) {
        return
      }
      events.push(<ObservationEventListComponent key={event.id} observationEvent={event} onPress={() => props.onPressObservationEvent(event.id)} />)
    })

    setObservationEvents(events)
  }

  const loadSentEvents = async () => {
    let sentEvents: Record<string, any>[] = []

    try {
      sentEvents = await getSentEvents(credentials)
    } catch (error: any) {
      dispatch(setMessageState({
        type: 'err',
        messageContent: t('failed to fetch sent events'),
      }))
    }

    sentEvents = sentEvents.filter(event => event.publicityRestrictions === 'MZ.publicityRestrictionsPublic').slice(0, 5)

    sentEvents.sort((a, b) => {
      const dateA = new Date(a.dateCreated)
      const dateB = new Date(b.dateCreated)
      return dateB.getTime() - dateA.getTime()
    })

    const sentEventElements: React.JSX.Element[] = []

    sentEvents.map(event => sentEventElements.push(
      <SentEventComponent key={event.id} event={event} />
    ))

    setSentEvents(sentEventElements)
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

  const onBeginObservationEvent = async (formID: string) => {
    setLoading(true)

    //save the used form before beginning an event
    if (!observing) {
      await dispatch(switchSchema({ formID, lang: i18n.language })).unwrap()
      await storageService.save('formID', formID)
    }

    const title: string = t('gps notification title')
    const body: string = t('gps notification body')

    try {
      await dispatch(beginObservationEvent({ onPressMap: props.onPressMap, title, body })).unwrap()
    } catch (error: any) {
      if (error.severity === 'high') {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => {
            props.onLogout()
            dispatch(logoutUser()).unwrap()
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

  const onBeginSingleObservation = async () => {
    setLoading(true)

    //save the used form before beginning an event
    if (!observing) {
      await dispatch(switchSchema({ formID: 'JX.519', lang: i18n.language })).unwrap()
      await storageService.save('formID', 'JX.519')
    }

    try {
      await dispatch(beginSingleObservation({ onPressMap: props.onPressMap })).unwrap()
    } catch (error: any) {
      if (error.severity === 'high') {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => {
            props.onLogout()
            dispatch(logoutUser()).unwrap()
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
    setLoading(true)

    const title: string = t('gps notification title')
    const body: string = t('gps notification body')

    try {
      await dispatch(continueObservationEvent({ onPressMap: props.onPressMap, title, body })).unwrap()
    } catch (error: any) {
      if (error.severity === 'high') {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => {
            props.onLogout()
            dispatch(logoutUser()).unwrap()
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

  const getLastZoneId = () => {
    const zone = observationZone.zones.find((zone: Record<string, any>) => {
      return zone.name === observationEvent.events?.[observationEvent.events.length - 1].gatherings[1].locality
    })

    return zone ? zone.id : ''
  }

  const stopObserving = () => {
    dispatch(setMessageState({
      type: 'conf',
      messageContent: t('stop observing'),
      okLabel: t('stop event'),
      cancelLabel: t('cancel'),
      onOk: async () => {
        setLoading(true)

        dispatch(setObservationEventId(observationEvent?.events?.[observationEvent?.events?.length - 1].id))

        //save the path before stopping
        let location: LocationType
        try {
          location = await getCurrentLocation(true)
          await dispatch(appendPath({ locations: [location] })).unwrap()
        } catch (error: any) {
          showError('Could not get the last location of path: ' + error)
        }

        if (path) {
          await dispatch(eventPathUpdate({ lineStringPath: pathToLineStringConstructor(path) })).unwrap()
        }

        setLoading(false)
        props.onPressFinishObservationEvent('home')
      },
      testID: 'stopFromHomeMessage'
    }))
  }

  const openNextModal = (
    currentModalSetter: React.Dispatch<React.SetStateAction<boolean>>,
    nextModalSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    currentModalSetter(false)
    nextModalSetter(true)
  }

  const clipboardConfirmation = (logs: any[] | null) => {
    if (logs !== null && logs.length > 0) {
      dispatch(setMessageState({
        type: 'dangerConf',
        messageContent: t('copy log to clipboard?'),
        okLabel: t('yes'),
        cancelLabel: t('no'),
        onOk: async () => await Clipboard.setStringAsync(JSON.stringify(logs, null, '  '))
      }))
    } else {
      dispatch(setMessageState({
        type: 'msg',
        messageContent: t('no logs')
      }))
    }
  }

  const showError = (error: string) => {
    dispatch(setMessageState({
      type: 'err',
      messageContent: error
    }))
  }

  if (loading) {
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
              {observing ?
                <UnfinishedEventComponent onContinueObservationEvent={() => { onContinueObservationEvent() }}
                  stopObserving={stopObserving} />
                :
                null
              }
            </>

            <Text style={Ts.previousObservationsTitle}>{t('single observation')}</Text>
            <FormLauncherComponent formID={'single'} setModalVisibility={setTripModalVisibility}
              alternativeEffect={async () => await onBeginSingleObservation()} />

            <Text style={Ts.previousObservationsTitle}>{t('general forms')}</Text>
            <FormLauncherComponent formID={forms.tripForm} setModalVisibility={setTripModalVisibility} />
            <FormLauncherComponent formID={forms.fungiAtlas} setModalVisibility={setFungiModalVisibility} />
            <>
              {
                credentials.permissions?.includes('HR.2951') ?
                  <FormLauncherComponent formID={forms.lolife} setModalVisibility={setZoneModalVisibility} />
                  : null
              }
            </>

            <Text style={Ts.previousObservationsTitle}>{t('complete lists')} - {t('bird atlas')}</Text>
            <FormLauncherComponent formID={forms.birdAtlas} setModalVisibility={setAtlasInstructionModalVisibility} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'flex-start' }}>
              <Text style={Ts.previousObservationsTitle}>{t('complete lists')}</Text>
              <Icon onPress={() => { setCompleteListInfoModalVisibility(true) }} name='info' type='material-icons' color={Colors.primary5} size={22} />
            </View>
            <FormLauncherComponent formID={forms.dragonflyForm} setModalVisibility={setDragonflyModalVisibility} />
            <FormLauncherComponent formID={forms.butterflyForm} setModalVisibility={setButterflyModalVisibility} />
            <FormLauncherComponent formID={forms.largeFlowersForm} setModalVisibility={setLargeFlowersModalVisibility} />
            <FormLauncherComponent formID={forms.mothForm} setModalVisibility={setMothModalVisibility} />
            <FormLauncherComponent formID={forms.bumblebeeForm} setModalVisibility={setBumblebeeModalVisibility} />
            <FormLauncherComponent formID={forms.herpForm} setModalVisibility={setHerpModalVisibility} />
            <FormLauncherComponent formID={forms.subarcticForm} setModalVisibility={setSubarcticModalVisibility} />
            <FormLauncherComponent formID={forms.macrolichenForm} setModalVisibility={setMacrolichenModalVisibility} />
            <FormLauncherComponent formID={forms.bracketFungiForm} setModalVisibility={setBracketFungiModalVisibility} />
            <FormLauncherComponent formID={forms.practicalFungiForm} setModalVisibility={setPracticalFungiModalVisibility} />

            <Text style={Ts.previousObservationsTitle}>{t('previous observation events')}</Text>
            <>{observationEvents}</>
            <Text style={Ts.previousObservationsTitle}>{t('sent observation events')}</Text>
            <>{sentEvents}</>
          </View>
          <View style={Cs.versionContainer}>
            <Text
              style={Ts.alignedRightText}
              onPress={() => setPressCounter(pressCounter + 1)}>
              {t('version')} {AppJSON.expo.version}
            </Text>
          </View>
        </ScrollView>
        <DefaultModalComponent modalVisibility={tripModalVisibility} setModalVisibility={setTripModalVisibility}
          onBeginObservationEvent={() => { onBeginObservationEvent(forms.tripForm) }} formID={forms.tripForm} />
        <AtlasInstructionModalComponent modalVisibility={atlasInstructionModalVisibility} setModalVisibility={setAtlasInstructionModalVisibility}
          setGridModalVisibility={setGridModalVisibility} openNextModal={openNextModal} />
        <GridModalComponent modalVisibility={gridModalVisibility} setModalVisibility={setGridModalVisibility}
          onBeginObservationEvent={() => { onBeginObservationEvent(forms.birdAtlas) }}
          setLoading={setLoading} />
        <DefaultModalComponent modalVisibility={fungiModalVisibility} setModalVisibility={setFungiModalVisibility}
          onBeginObservationEvent={() => { onBeginObservationEvent(forms.fungiAtlas) }} formID={forms.fungiAtlas} />
        <CompleteListModalComponent modalVisibility={dragonflyModalVisibility}
          setModalVisibility={setDragonflyModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.dragonflyForm) }}
          formID={forms.dragonflyForm} />
        <CompleteListModalComponent modalVisibility={butterflyModalVisibility}
          setModalVisibility={setButterflyModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.butterflyForm) }}
          formID={forms.butterflyForm} />
        <CompleteListModalComponent modalVisibility={largeFlowersModalVisibility}
          setModalVisibility={setLargeFlowersModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.largeFlowersForm) }}
          formID={forms.largeFlowersForm} />
        <CompleteListModalComponent modalVisibility={mothModalVisibility}
          setModalVisibility={setMothModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.mothForm) }}
          formID={forms.mothForm} />
        <CompleteListModalComponent modalVisibility={bumblebeeModalVisibility}
          setModalVisibility={setBumblebeeModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.bumblebeeForm) }}
          formID={forms.bumblebeeForm} />
        <CompleteListModalComponent modalVisibility={herpModalVisibility}
          setModalVisibility={setHerpModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.herpForm) }}
          formID={forms.herpForm} />
        <CompleteListModalComponent modalVisibility={subarcticModalVisibility}
          setModalVisibility={setSubarcticModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.subarcticForm) }}
          formID={forms.subarcticForm} />
        <CompleteListModalComponent modalVisibility={macrolichenModalVisibility}
          setModalVisibility={setMacrolichenModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.macrolichenForm) }}
          formID={forms.macrolichenForm} />
        <CompleteListModalComponent modalVisibility={bracketFungiModalVisibility}
          setModalVisibility={setBracketFungiModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.bracketFungiForm) }}
          formID={forms.bracketFungiForm} />
        <CompleteListModalComponent modalVisibility={practicalFungiModalVisibility}
          setModalVisibility={setPracticalFungiModalVisibility} onBeginObservationEvent={() => { onBeginObservationEvent(forms.practicalFungiForm) }}
          formID={forms.practicalFungiForm} />
        <ZoneModalComponent modalVisibility={zoneModalVisibility} setModalVisibility={setZoneModalVisibility}
          onBeginObservationEvent={() => { onBeginObservationEvent(forms.lolife) }}
          setLoading={setLoading} />
        <FormInfoModalComponent modalVisibility={completeListInfoModalVisibility} setModalVisibility={setCompleteListInfoModalVisibility}
          content={t('complete list description')} />
        <MessageComponent />
      </>
    )
  }
}

export default HomeComponent