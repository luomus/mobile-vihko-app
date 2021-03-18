import React, { useState, ReactChild } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import { useBackHandler } from '@react-native-community/hooks'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Bs from '../../styles/ButtonStyles'
import { useDispatch, useSelector } from 'react-redux'
import {
  rootState,
  DispatchType,
  setObservationId,
  uploadObservationEvent,
  setMessageState,
  deleteObservation,
  deleteObservationEvent
} from '../../stores'
import i18n from '../../languages/i18n'
import { useTranslation } from 'react-i18next'
import ObservationInfoComponent from './ObservationInfoComponent'
import SendEventModalComponent from '../general/SendEventModalComponent'
import MessageComponent from '../general/MessageComponent'
import { parseDateForUI } from '../../helpers/dateHelper'
import ActivityComponent from '../general/ActivityComponent'

type Props = {
  id: string,
  onPressHome: () => void,
  onPressObservation: (sourcePage?: string) => void,
  onPressObservationEvent: (sourcePage: string) => void,
  isFocused: () => boolean,
  children?: ReactChild
}

const ObservationEventComponent = (props: Props) => {

  const [sending, setSending] = useState<boolean>(false)
  const [modalVisibility, setModalVisibility] = useState<boolean>(false)

  const credentials = useSelector((state: rootState) => state.credentials)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  const event: Record<string, any> | null = observationEvent.events.find(e => e.id === props.id) || null
  const observations: Record<string, any>[] = event?.gatherings[0]?.units || null

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
      onOk: () => handleDeleteObservation(eventId, unitId),
      okLabel: t('delete')
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
      onOk: () => handleDeleteObservationEvent(eventId),
      okLabel: t('delete')
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
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message,
        onOk: () => props.onPressHome()
      }))
    }

    setSending(false)
  }

  //override back button to point to home screen in all cases
  useBackHandler(() => {
    if (props.isFocused() ) {
      props.onPressHome()
      return true
    }
    return false
  })

  if (!event || !observations) {
    return (
      <ActivityComponent text={t('loading')} />
    )
  } else if (sending) {
    return (
      <ActivityComponent text={t('sending')} />
    )
  } else {
    return (
      <View style={Cs.singleObservationEventContainer}>
        <ScrollView>
          <View style={Cs.eventTopContainer}>
            <View style={Cs.eventTextContainer}>
              <Text>{t('dateBegin')}: {parseDateForUI(event.gatheringEvent.dateBegin)}</Text>
              <Text>{t('dateEnd')}: {parseDateForUI(event.gatheringEvent.dateEnd)}</Text>
            </View>
            <View style={Cs.eventButtonsContainer}>
              <Button
                buttonStyle={Bs.editEventButton}
                containerStyle={Cs.padding5Container}
                icon={<Icon name='edit' type='material-icons' color='white' size={22} />}
                onPress={() => {
                  const id = {
                    eventId: event.id,
                    unitId: ''
                  }
                  dispatch(setObservationId(id))
                  props.onPressObservationEvent('ObservationEventComponent')
                }}
              />
              <Button
                buttonStyle={Bs.sendEventButton}
                icon={<Icon name='send' type='material-icons' color='white' size={22} />}
                onPress={() => setModalVisibility(true)}
              />
              <Button
                buttonStyle={Bs.removeEventButton}
                containerStyle={Cs.padding5Container}
                icon={<Icon name='delete' type='material-icons' color='white' size={22} />}
                onPress={() => showDeleteObservationEvent(event.id)}
              />
            </View>
          </View>
          <Text style={Ts.observationText}>{t('observations')}:</Text>
          {observations.map(observation =>
            <View key={observation.id}>
              <ObservationInfoComponent
                event={event}
                observation={observation}
                editButton={
                  <Button
                    buttonStyle={Bs.basicNeutralButton}
                    title={t('edit button')}
                    iconRight={true}
                    icon={<Icon name='edit' type='material-icons' color='white' size={22} />}
                    onPress={() => {
                      const id = {
                        eventId: event.id,
                        unitId: observation.id
                      }
                      dispatch(setObservationId(id))
                      props.onPressObservation('ObservationEventComponent')
                    }}
                  />
                }
                removeButton={
                  <Button
                    buttonStyle={Bs.basicNegativeButton}
                    title={t('remove button')}
                    iconRight={true}
                    icon={<Icon name='delete' type='material-icons' color='white' size={22} />}
                    onPress={() => {
                      showDeleteObservation(event.id, observation.id)
                    }}
                  />
                }
              />
              <View style={{ padding: 5 }}></View>
            </View>
          )}
          {props.children}
          <SendEventModalComponent modalVisibility={modalVisibility} onCancel={setModalVisibility} sendObservationEvent={sendObservationEvent}/>
          <MessageComponent />
        </ScrollView>
      </View>
    )
  }
}

export default ObservationEventComponent