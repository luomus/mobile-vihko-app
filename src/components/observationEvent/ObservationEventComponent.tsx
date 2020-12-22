import React, { useState, ReactChild } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import { useBackHandler } from '@react-native-community/hooks'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Bs from '../../styles/ButtonStyles'
import { connect, ConnectedProps } from 'react-redux'
import {
  replaceObservationEvents,
  setObservationId,
  uploadObservationEvent,
  deleteObservationEvent,
  deleteObservation,
} from '../../stores/observation/actions'
import { setMessageState, clearMessageState } from '../../stores/message/actions'
import i18n from '../../language/i18n'
import { useTranslation } from 'react-i18next'
import ObservationInfoComponent from './ObservationInfoComponent'
import SendEventModalComponent from './SendEventModalComponent'
import MessageComponent from '../general/MessageComponent'
import { parseDateForUI } from '../../utilities/dateHelper'
import { CredentialsType } from '../../stores/user/types'
import { ObservationEventType } from '../../stores/observation/types'
import ActivityComponent from '../general/ActivityComponent'

interface RootState {
  observationEvent: ObservationEventType,
  observationId: Record<string, any>,
  credentials: CredentialsType,
  message: Record<string, any>,
}

const mapStateToProps = (state: RootState) => {
  const { observationEvent, observationId, credentials, message } = state
  return { observationEvent, observationId, credentials, message }
}

const mapDispatchToProps = {
  setObservationId,
  setMessageState,
  clearMessageState,
  replaceObservationEvents,
  uploadObservationEvent,
  deleteObservationEvent,
  deleteObservation,
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  id: string,
  onPressHome: () => void,
  onPressObservation: () => void,
  onPressObservationEvent: () => void,
  isFocused: () => boolean,
  children?: ReactChild
}

const ObservationEventComponent = (props: Props) => {
  const { t } = useTranslation()
  const event: Record<string, any> | null = props.observationEvent.events.find(e => e.id === props.id) || null
  const observations: Record<string, any>[] = event?.gatherings[0]?.units || null
  const [sending, setSending] = useState<boolean>(false)
  const [modalVisibility, setModalVisibility] = useState<boolean>(false)

  const showMessage = (content: string) => {
    props.setMessageState({
      type: 'msg',
      messageContent: content
    })
  }

  const showDeleteObservation = (eventId: string, unitId: string) => {
    props.setMessageState({
      type: 'dangerConf',
      messageContent: t('remove observation?'),
      onOk: () => deleteObservation(eventId, unitId),
      okLabel: t('delete')
    })
  }

  const deleteObservation = async (eventId: string, unitId: string) => {
    try {
      await props.deleteObservation(eventId, unitId)
    } catch (error) {
      props.setMessageState({
        type: 'err',
        messageContent: error.message
      })
    }
  }

  const showDeleteObservationEvent = (eventId: string) => {
    props.setMessageState({
      type: 'dangerConf',
      messageContent: t('remove observation event?'),
      onOk: () => deleteObservationEvent(eventId),
      okLabel: t('delete')
    })
  }

  const deleteObservationEvent = async (eventId: string) => {
    try {
      await props.deleteObservationEvent(eventId)
      props.onPressHome()
    } catch (error) {
      props.setMessageState({
        type: 'err',
        messageContent: error.message
      })
    }
  }

  const sendObservationEvent = async (isPublic: boolean) => {
    setModalVisibility(false)
    setSending(true)
    try {
      await props.uploadObservationEvent(event?.id, props.credentials, i18n.language, isPublic)
      showMessage(t('post success'))
      props.onPressHome()
    } catch (error) {
      props.setMessageState({
        type: 'err',
        messageContent: error.message,
        onOk: () => props.onPressHome()
      })
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
                  props.setObservationId(id)
                  props.onPressObservationEvent()
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
                      props.setObservationId(id)
                      props.onPressObservation()
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
          <SendEventModalComponent modalVisibility={modalVisibility} setModalVisibility={setModalVisibility} sendObservationEvent={sendObservationEvent}/>
          <MessageComponent />
        </ScrollView>
      </View>
    )
  }
}

export default connector(ObservationEventComponent)

