import React, { useState, ReactChild, useEffect } from 'react'
import { FlatList, ListRenderItem, Text, View } from 'react-native'
import { useBackHandler } from '@react-native-community/hooks'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Bs from '../../styles/ButtonStyles'
import Colors from '../../styles/Colors'
import { useDispatch, useSelector } from 'react-redux'
import i18n from '../../languages/i18n'
import { forms } from '../../config/fields'
import {
  rootState,
  DispatchType,
  setObservationId,
  uploadObservationEvent,
  setMessageState,
  deleteObservation,
  deleteObservationEvent,
  logoutUser,
  switchSchema,
  resetReducer
} from '../../stores'
import { useTranslation } from 'react-i18next'
import ObservationInfoComponent from './ObservationInfoComponent'
import SendEventModalComponent from '../general/SendEventModalComponent'
import MessageComponent from '../general/MessageComponent'
import { parseDateFromDocumentToUI } from '../../helpers/dateHelper'
import ActivityComponent from '../general/ActivityComponent'
import ButtonComponent from '../general/ButtonComponent'
import storageService from '../../services/storageService'
import { log } from '../../helpers/logger'
import { captureException } from '../../helpers/sentry'

type Props = {
  id: string,
  onPressHome: () => void,
  onPressObservation: (sourcePage?: string) => void,
  onPressObservationEvent: (sourcePage: string) => void,
  onLogout: () => void,
  isFocused: () => boolean,
  children?: ReactChild
}

const OverviewComponent = (props: Props) => {

  const [sending, setSending] = useState<boolean>(false)
  const [modalVisibility, setModalVisibility] = useState<boolean>(false)
  const [event, setEvent] = useState<Record<string, any> | null>(null)
  const [observations, setObservations] = useState<Record<string, any>[] | null>(null)
  const [eventSchema, setEventSchema] = useState<Record<string, any> | null>(null)

  const credentials = useSelector((state: rootState) => state.credentials)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  useEffect(() => {
    const searchedEvent: Record<string, any> | null = observationEvent.events.find(e => e.id === props.id) || null
    let searchedObservations: Record<string, any>[] = searchedEvent?.gatherings[0]?.units || null

    setEvent(searchedEvent)

    if (searchedEvent && searchedEvent.formID === forms.birdAtlas) {
      const filteredObservations: Record<string, any>[] = []
      searchedObservations.forEach((observation) => {
        if (!(observation.id.includes('complete_list') && !observation.atlasCode && !observation.count)) {
          filteredObservations.push(observation)
        }
      })
      searchedObservations = filteredObservations
    }

    setObservations(searchedObservations)

    const lang = i18n.language

    const initEventSchema = async () => {
      if (searchedEvent === null) { return }
      const fetchedSchema = await storageService.fetch(`${searchedEvent.formID}${lang.charAt(0).toUpperCase() + lang.slice(1)}`)
      setEventSchema(fetchedSchema)
      dispatch(switchSchema(searchedEvent.formID, lang))
    }

    initEventSchema()
  }, [observationEvent])

  const showMessage = (content: string) => {
    dispatch(setMessageState({
      type: 'msg',
      messageContent: content
    }))
  }

  const showDeleteObservation = (eventId: string, unitId: string) => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('remove observation?'),
      cancelLabel: t('do not delete'),
      okLabel: t('delete'),
      onOk: () => handleDeleteObservation(eventId, unitId)
    }))
  }

  const handleDeleteObservation = async (eventId: string, unitId: string) => {
    try {
      await dispatch(deleteObservation(eventId, unitId))
    } catch (error: any) {
      captureException(error)
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message
      }))
    }
  }

  const showDeleteObservationEvent = (eventId: string) => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('remove observation event?'),
      cancelLabel: t('do not delete'),
      okLabel: t('delete'),
      onOk: () => handleDeleteObservationEvent(eventId)
    }))
  }

  const handleDeleteObservationEvent = async (eventId: string) => {
    try {
      await dispatch(deleteObservationEvent(eventId))
      props.onPressHome()
    } catch (error: any) {
      captureException(error)
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message
      }))
    }
  }

  const sendObservationEvent = async (isPublic: boolean) => {
    setModalVisibility(false)
    setSending(true)
    try {
      await dispatch(uploadObservationEvent(event?.id, i18n.language, isPublic))
      showMessage(t('post success'))
      props.onPressHome()
    } catch (error: any) {
      captureException(error)
      if (error.severity === 'low') {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => props.onPressHome()
        }))
        //log user out from the app if the token has expired
      } else {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => {
            props.onLogout()
            dispatch(logoutUser())
            dispatch(resetReducer())
          }
        }))
      }
    }

    setSending(false)
  }

  const handleBugReport = () => {
    dispatch(setMessageState({
      type: 'conf',
      messageContent: t('bug report'),
      cancelLabel: t('do not submit'),
      okLabel: t('submit'),
      onOk: () => {
        log.error({
          location: '/components/overview/OverviewComponent.tsx handleBugReport()',
          error: 'Bug Report',
          data: event,
          user_id: credentials.user?.id
        })
      }
    }))
  }

  const displayDateBegin = () => {
    if (event?.gatheringEvent?.timeStart) {
      return parseDateFromDocumentToUI(event.gatheringEvent.dateBegin + 'T' + event.gatheringEvent.timeStart)
    } else {
      return parseDateFromDocumentToUI(event?.gatheringEvent.dateBegin)
    }
  }

  const displayDateEnd = () => {
    if (event?.gatheringEvent?.timeStart) {
      return parseDateFromDocumentToUI(event.gatheringEvent.dateEnd + 'T' + event.gatheringEvent.timeEnd)
    } else {
      return parseDateFromDocumentToUI(event?.gatheringEvent.dateEnd)
    }
  }

  //override back button to point to home screen in all cases
  useBackHandler(() => {
    if (props.isFocused()) {
      props.onPressHome()
      return true
    }
    return false
  })

  const renderObservation: ListRenderItem<Record<string, any>> = ({ item }) => {

    if (!event || !eventSchema) return null

    return (
      <View key={item.id}>
        <ObservationInfoComponent
          event={event}
          observation={item}
          eventSchema={eventSchema}
          editButton={
            <ButtonComponent
              onPressFunction={
                () => {
                  const id = {
                    eventId: event.id,
                    unitId: item.id
                  }
                  dispatch(setObservationId(id))
                  props.onPressObservation('overview')
                }}
              title={t('edit')} height={40} width={120} buttonStyle={Bs.textAndIconButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={'edit'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
            />
          }
          removeButton={
            <ButtonComponent
              onPressFunction={
                () => {
                  showDeleteObservation(event.id, item.id)
                }}
              title={t('remove')} height={40} width={120} buttonStyle={Bs.textAndIconButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'delete'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
          }
        />
        <View style={{ padding: 5 }}></View>
      </View>
    )
  }

  const ListHeader = () => {
    if (event) {
      return (
        <View style={Cs.overviewContentContainer}>
          <View style={Cs.overviewTextContainer}>
            {event.gatherings[0].locality ? <Text>{t('locality')}: {event.gatherings[0].locality}</Text> : null}
            {event.gatherings[0].localityDescription ? <Text>{t('locality description')}: {event.gatherings[0].localityDescription}</Text> : null}
            <Text>{t('date begin')}: {displayDateBegin()}</Text>
            <Text>{t('date end')}: {displayDateEnd()}</Text>
          </View>
          <View style={Cs.overviewButtonsContainer}>
            <View style={Cs.padding5Container}>
              <ButtonComponent
                onPressFunction={() => {
                  const id = {
                    eventId: event.id,
                    unitId: ''
                  }
                  dispatch(setObservationId(id))
                  props.onPressObservationEvent('overview')
                }}
                title={'Edit'} height={40} width={'100%'} buttonStyle={Bs.textAndIconButton}
                gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                textStyle={Ts.buttonText} iconName={'edit'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
              />
            </View>
            <View style={Cs.padding5Container}>
              <ButtonComponent onPressFunction={() => setModalVisibility(true)} title={'Send'}
                height={40} width={'100%'} buttonStyle={Bs.textAndIconButton}
                gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                textStyle={Ts.buttonText} iconName={'send'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
              />
            </View>
            <View style={Cs.padding5Container}>
              <ButtonComponent onPressFunction={() => showDeleteObservationEvent(event.id)} title={'Delete'}
                height={40} width={'100%'} buttonStyle={Bs.textAndIconButton}
                gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={'delete'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
              />
            </View>
            <View style={Cs.padding5Container}>
              <ButtonComponent onPressFunction={() => handleBugReport()} title={'Bug report'}
                height={40} width={'100%'} buttonStyle={Bs.textAndIconButton}
                gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={'bug-report'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
              />
            </View>
          </View>
        </View>
      )
    } else {
      return <></>
    }
  }

  if (!event || !observations || !eventSchema) {
    return (
      <ActivityComponent text={t('loading')} />
    )
  } else if (sending) {
    return (
      <ActivityComponent text={t('sending')} />
    )
  } else {
    return (
      <>
        <FlatList
          data={observations}
          renderItem={renderObservation}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={<Text>{t('no observations')}</Text>}
          style={Cs.overviewBaseContainer}
        />
        {props.children}
        <SendEventModalComponent modalVisibility={modalVisibility} onCancel={setModalVisibility} sendObservationEvent={sendObservationEvent} />
        <MessageComponent />
      </>
    )
  }
}

export default OverviewComponent