import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import Cs from '../styles/ContainerStyles'
import Ts from '../styles/TextStyles'
import Bs from '../styles/ButtonStyles'
import { connect, ConnectedProps } from 'react-redux'
import {
  replaceObservationEvents,
  setObservationId,
  uploadObservationEvent,
  deleteObservationEvent,
  deleteObservation,
} from '../stores/observation/actions'
import { setMessageState, clearMessageState } from '../stores/message/actions'
import { useTranslation } from 'react-i18next'
import ObservationInfoComponent from './ObservationInfoComponent'
import MessageComponent from './MessageComponent'
import { parseDateForUI } from '../utilities/dateHelper'
import { CredentialsType } from '../stores/user/types'
import { ObservationEventType } from '../stores/observation/types'
import ActivityComponent from './ActivityComponent'

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
}

const ObservationEventComponent = (props: Props) => {
  const { t } = useTranslation()
  const event: Record<string, any> | null = props.observationEvent.events.find(e => e.id === props.id) || null
  const observations: Record<string, any>[] = event?.gatherings[0]?.units || null
  const [sending, setSending] = useState<boolean>(false)

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

  const showSendObservationEvent = () => {
    props.setMessageState({
      type: 'conf',
      messageContent: t('send observation event to server?'),
      okLabel: t('send'),
      cancelLabel: t('cancel'),
      onOk: () => sendObservationEvent()
    })
  }

  const sendObservationEvent = async () => {
    setSending(true)
    try {
      await props.uploadObservationEvent(event?.id, props.credentials)
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
                onPress={() => showSendObservationEvent()}
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
          <MessageComponent />
        </ScrollView>
      </View>
    )
  }
}

export default connector(ObservationEventComponent)

