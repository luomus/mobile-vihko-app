import React, { useState, ReactChild, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useBackHandler } from '@react-native-community/hooks'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Bs from '../../styles/ButtonStyles'
import Colors from '../../styles/Colors'
import { useDispatch, useSelector } from 'react-redux'
import i18n from '../../languages/i18n'
import {
  rootState,
  DispatchType,
  setObservationId,
  uploadObservationEvent,
  setMessageState,
  deleteObservation,
  deleteObservationEvent,
  logoutUser,
  resetReducer
} from '../../stores'
import { useTranslation } from 'react-i18next'
import ObservationInfoComponent from './ObservationInfoComponent'
import SendEventModalComponent from '../general/SendEventModalComponent'
import MessageComponent from '../general/MessageComponent'
import { parseDateForUI } from '../../helpers/dateHelper'
import ActivityComponent from '../general/ActivityComponent'
import ButtonComponent from '../general/ButtonComponent'
import storageService from '../../services/storageService'

type Props = {
  id: string,
  onPressHome: () => void,
  onPressObservation: (sourcePage?: string) => void,
  onPressObservationEvent: (sourcePage: string) => void,
  onLogout: () => void,
  isFocused: () => boolean,
  children?: ReactChild
}

const ObservationEventComponent = (props: Props) => {

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
    const searchedObservations: Record<string, any>[] = searchedEvent?.gatherings[0]?.units || null
    setEvent(searchedEvent)
    setObservations(searchedObservations)

    const lang = i18n.language

    const initEventSchema = async () => {
      if (searchedEvent === null) { return }
      const fetchedSchema = await storageService.fetch(`${searchedEvent.formID}${lang.charAt(0).toUpperCase() + lang.slice(1)}`)
      setEventSchema(fetchedSchema)
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
    } catch (error) {
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
    } catch (error) {
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
      await dispatch(uploadObservationEvent(event?.id, credentials, i18n.language, isPublic))
      showMessage(t('post success'))
      props.onPressHome()
    } catch (error) {
      if (error.message !== t('user token has expired')) {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => props.onPressHome()
        }))
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

  //override back button to point to home screen in all cases
  useBackHandler(() => {
    if (props.isFocused()) {
      props.onPressHome()
      return true
    }
    return false
  })

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
      <ScrollView contentContainerStyle={Cs.overviewBaseContainer}>
        <View style={Cs.overviewContentContainer}>
          <View style={Cs.overviewTextContainer}>
            <Text>{t('dateBegin')}: {parseDateForUI(event.gatheringEvent.dateBegin)}</Text>
            <Text>{t('dateEnd')}: {parseDateForUI(event.gatheringEvent.dateEnd)}</Text>
          </View>
          <View style={Cs.overviewButtonsContainer}>
            <View style={Cs.padding5Container}>
              <ButtonComponent onPressFunction={() => {
                const id = {
                  eventId: event.id,
                  unitId: ''
                }
                dispatch(setObservationId(id))
                props.onPressObservationEvent('ObservationEventComponent')
              }}
                title={undefined} height={40} width={45} buttonStyle={Bs.editEventButton}
                gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                textStyle={Ts.buttonText} iconName={'edit'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
              />
            </View>
            <View style={Cs.padding5Container}>
              <ButtonComponent onPressFunction={() => setModalVisibility(true)} title={undefined}
                height={40} width={45} buttonStyle={Bs.sendEventButton}
                gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                textStyle={Ts.buttonText} iconName={'send'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
              />
            </View>
            <View style={Cs.padding5Container}>
              <ButtonComponent onPressFunction={() => showDeleteObservationEvent(event.id)} title={undefined}
                height={40} width={45} buttonStyle={Bs.removeEventButton}
                gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={'delete'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
              />
            </View>
          </View>
        </View>
        <Text style={Ts.observationText}>{t('observations')}:</Text>
        {observations.map(observation =>
          <View key={observation.id}>
            <ObservationInfoComponent
              event={event}
              observation={observation}
              eventSchema={eventSchema}
              editButton={
                <ButtonComponent onPressFunction={() => {
                  const id = {
                    eventId: event.id,
                    unitId: observation.id
                  }
                  dispatch(setObservationId(id))
                  props.onPressObservation('ObservationEventComponent')
                }}
                  title={t('edit button')} height={40} width={120} buttonStyle={Bs.basicPrimaryButton}
                  gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                  textStyle={Ts.buttonText} iconName={'edit'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
                />
              }
              removeButton={
                <ButtonComponent onPressFunction={() => {
                  showDeleteObservation(event.id, observation.id)
                }}
                  title={t('remove')} height={40} width={120} buttonStyle={Bs.basicNeutralButton}
                  gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                  textStyle={Ts.buttonText} iconName={'delete'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
                />
              }
            />
            <View style={{ padding: 5 }}></View>
          </View>
        )}
        {props.children}
        <SendEventModalComponent modalVisibility={modalVisibility} onCancel={setModalVisibility} sendObservationEvent={sendObservationEvent} />
        <MessageComponent />
      </ScrollView>
    )
  }
}

export default ObservationEventComponent