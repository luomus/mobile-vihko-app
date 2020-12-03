import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, BackHandler, Linking } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import UserInfoComponent from './UserInfoComponent'
import ObservationEventListComponent from './ObservationEventListElementComponent'
import { useTranslation } from 'react-i18next'
import Cs from '../styles/ContainerStyles'
import Ts from '../styles/TextStyles'
import Bs from '../styles/ButtonStyles'
import { LocationObject } from 'expo-location'
import { LatLng } from 'react-native-maps'
import {
  toggleObserving,
  newObservationEvent,
  replaceObservationEventById,
  clearObservationLocation,
} from '../stores/observation/actions'
import {
  toggleCentered,
  clearRegion
} from '../stores/map/actions'
import { setMessageState } from '../stores/message/actions'
import {
  updateLocation,
  clearLocation,
  appendPath,
  setPath,
  clearPath,
} from '../stores/position/actions'
import { connect, ConnectedProps } from 'react-redux'
import { watchLocationAsync, stopLocationAsync } from '../geolocation/geolocation'
import uuid from 'react-native-uuid'
import { clone, set } from 'lodash'
import { useBackHandler, useClipboard } from '@react-native-community/hooks'
import { setDateForDocument } from '../utilities/dateHelper'
import Colors from '../styles/Colors'
import { SchemaType, ObservationEventType } from '../stores/observation/types'
import { CredentialsType } from '../stores/user/types'
import { lineStringConstructor } from '../converters/geoJSONConverters'
import { parseSchemaToNewObject } from '../parsers/SchemaObjectParser'
import i18n from '../language/i18n'
import MessageComponent from './MessageComponent'
import { withNavigation } from 'react-navigation'
import ActivityComponent from './ActivityComponent'
import AppJSON from '../../app.json'
import { createGeometry } from '../utilities/geometryCreator'
import storageController from '../controllers/storageController'
import { log } from '../utilities/logger'
import { lajiFI, lajiSV, lajiEN } from '../config/urls'

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
  toggleCentered
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
  obsStopped: boolean,
  navigation: any,
}

const HomeComponent = (props: Props) => {
  const [pressCounter, setPressCounter] = useState<number>(0)
  const [observationEvents, setObservationEvents] = useState<Element[]>([])
  const [unfishedEvent, setUnfinishedEvent] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [link, setLink] = useState<string>('')
  const { t } = useTranslation()
  const [data, setString] = useClipboard()
  let focusListener: any
  let logTimeout: NodeJS.Timeout | undefined

  useEffect(() => {
    if (props.observationEvent.events.length > 0 && !props.observationEvent.events[props.observationEvent.events.length - 1].gatheringEvent.dateEnd) {
      props.toggleObserving()
      setUnfinishedEvent(true)
    }
  }, [])

  useEffect(() => {
    loadObservationEvents()
  }, [props.observationEvent, props.observing])

  useEffect(() => {
    focusListener = props.navigation.addListener('willFocus', ({ action }) => {
      if (action.params?.obsStopped) {
        finishObservationEvent()
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

  useEffect(() => {
    changeLinkPage()
  }, [i18n.language])

  const loadObservationEvents = () => {
    const events: Array<Element> = []
    const indexLast: number = props.observationEvent.events.length - 1
    props.observationEvent.events.forEach((event: BasicObject, index: number) => {
      if (props.observing && index === indexLast) {
        return
      }

      events.push(<ObservationEventListComponent key={event.id} observationEvent={event} onPress={() => props.onPressObservationEvent(event.id)} />)
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

  //if above is answered positively stop observation and exit app
  const onExit = async () => {
    await finishObservationEvent()
    BackHandler.exitApp()
  }

  const beginObservationEvent = async () => {
    const userId = props.credentials?.user?.id

    if (!userId) {
      return
    }

    const lang = i18n.language
    let schema = props.schema.schemas[lang].schema

    let observationEventDefaults = {}
    set(observationEventDefaults, 'editors', [userId])
    set(observationEventDefaults, ['gatheringEvent', 'leg'], [userId])
    set(observationEventDefaults, ['gatheringEvent', 'dateBegin'], setDateForDocument())

    let observationEvent = parseSchemaToNewObject(observationEventDefaults, ['gatherings_0_units'], schema)

    const observationEventObject = {
      id: 'observationEvent_' + uuid.v4(),
      formID: 'MHL.45',
      ...observationEvent
    }

    try {
      await props.newObservationEvent(observationEventObject)
    } catch (error) {
      props.setMessageState({
        type: 'err',
        messageContent: error.message
      })
    }

    //attempt to start geolocation systems
    try {
      await watchLocationAsync(props.updateLocation)
    } catch (error) {
      log.error({
        location: '/components/HomeComponent.tsx beginObservationEvent()',
        error: error
      })
      props.setMessageState({
        type: 'err',
        messageContent: error.message
      })
      return
    }

    //reset map centering and zoom level, redirect to map
    !props.centered ? props.toggleCentered() : null
    props.clearRegion()
    props.toggleObserving()

    props.onPressMap()
  }

  const continueObservationEvent = async () => {
    if (!unfishedEvent) {
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
    const path = props.observationEvent.events?.[props.observationEvent.events.length - 1].gatherings[1]?.geometry.coordinates
    if (path) {
      props.setPath(path)
    }

    props.onPressMap()
  }

  const finishObservationEvent = async () => {
    setUnfinishedEvent(false)
    let event = clone(props.observationEvent.events?.[props.observationEvent.events.length - 1])

    if (event) {
      const oldGathering = event.gatheringEvent
      event.gatheringEvent = {
        ...oldGathering,
        dateEnd: setDateForDocument()
      }

      const lineStringpPath = lineStringConstructor(props.path)
      if (lineStringpPath && !unfishedEvent) {
        event.gatherings[1] = {
          geometry: lineStringpPath
        }
      }

      if (!event.gatherings[0].geometry) {
        const geometry = createGeometry(event)

        if (geometry) {
          event.gatherings[0].geometry = geometry
        }
      }

      props.clearPath()
      props.clearLocation()

      //replace events with modified list
      try {
        await props.replaceObservationEventById(event, event.id)
      } catch (error) {
        props.setMessageState({
          type: 'err',
          messageContent: error.message
        })
      }
    }

    props.toggleObserving()
    props.clearObservationLocation()
    if (!unfishedEvent) {
      stopLocationAsync()
    }
  }

  const stopObserving = () => {
    props.setMessageState({
      type: 'dangerConf',
      messageContent: t('stop observing'),
      onOk: () => finishObservationEvent()
    })
  }

  const changeLinkPage = () => {
    if (i18n.language === 'fi') {
      setLink(lajiFI)
    } else if (i18n.language === 'sv') {
      setLink(lajiSV)
    } else (
      setLink(lajiEN)
    )
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

  if (loading) {
    return (
      <ActivityComponent text={'loading'} />
    )
  } else {
    return (
      <>
        <ScrollView contentContainerStyle={Cs.outerVersionContainer}>
          <View style={{ justifyContent: 'flex-start' }}>
            <UserInfoComponent onLogout={props.onLogout} />
            <View style={Cs.homeContainer}>
              <View style={Cs.homeInfoContainer}>
                <Text style={Ts.linkToLajiText}>
                  {`${t('observations are stored in')} `}
                  <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(link)}>
                    {`${t('to laji.fi database')}`}
                  </Text>
                </Text>
              </View>
              <View style={{ height: 10 }}></View>
              {props.observing ?
                <View style={Cs.observationEventContainer}>
                  <Text style={Ts.observationEventTitle}>{t('interrupted observation event')}</Text>
                  <View style={Cs.buttonContainer}>
                    <Button
                      containerStyle={Cs.continueButtonContainer}
                      buttonStyle={Bs.continueButton}
                      title={unfishedEvent ? t('continue unfinished') : t('continue')}
                      iconRight={true}
                      icon={<Icon name='map-outline' type='material-community' color='white' size={22} />}
                      onPress={() => continueObservationEvent()}
                    />
                    <Button
                      containerStyle={Cs.endButtonContainer}
                      buttonStyle={Bs.endButton}
                      title={t('cancelObservation')}
                      iconRight={true}
                      icon={<Icon name='stop' type='material-icons' color='white' size={22} />}
                      onPress={() => stopObserving()}
                    />
                  </View>
                </View>
                :
                <View style={Cs.observationEventContainer}>
                  <Text style={Ts.observationEventTitle}>
                    {t('new observation event without zone')}
                  </Text>
                  <View style={Cs.buttonContainer}>
                    <Button
                      containerStyle={Cs.beginButtonContainer}
                      buttonStyle={{ backgroundColor: Colors.positiveColor }}
                      title={t('beginObservation')}
                      iconRight={true}
                      icon={<Icon name='play-arrow' type='material-icons' color={'white'} size={22} />}
                      onPress={() => beginObservationEvent()}
                    />
                  </View>
                </View>
              }
              <View style={{ height: 10 }}></View>
              <View style={Cs.observationEventListContainer}>
                <Text style={Ts.previousObservationsTitle}>{t('previous observation events')}</Text>
                {observationEvents}
              </View>
              <View style={{ height: 10 }}></View>
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
        <MessageComponent />
      </>
    )
  }
}

export default withNavigation(connector(HomeComponent))