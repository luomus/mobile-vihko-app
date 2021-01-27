import React, { useState, useEffect, ReactChild } from 'react'
import { View, ScrollView } from 'react-native'
import { useForm } from 'react-hook-form'
import { connect, ConnectedProps } from 'react-redux'
import { useBackHandler } from '@react-native-community/hooks'
import { useTranslation } from 'react-i18next'
import { finishObservationEvent } from '../../actionCreators/observationEventCreators'
import { replaceObservationEventById, clearObservationId, setObservationEventFinished, uploadObservationEvent } from '../../stores/observation/actions'
import { setMessageState, clearMessageState } from '../../stores/message/actions'
import Cs from '../../styles/ContainerStyles'
import { set, merge, omit } from 'lodash'
import MessageComponent from '../general/MessageComponent'
import { ObservationEventType, SchemaType } from '../../stores/observation/types'
import { CredentialsType } from '../../stores/user/types'
import { initForm } from '../../forms/formMethods'
import i18n from '../../language/i18n'
import ActivityComponent from '../general/ActivityComponent'
import FloatingIconButtonComponent from './FloatingIconButtonComponent'
import SendEventModalComponent from '../general/SendEventModalComponent'
import { JX519ObservationEventFields, JX652ObservationEventFields } from '../../config/fields'

interface BasicObject {
  [key: string]: any
}

interface RootState {
  credentials: CredentialsType,
  observationEvent: ObservationEventType,
  observationId: BasicObject,
  schema: SchemaType,
}

const mapStateToProps = (state: RootState) => {
  const { credentials, observationEvent, observationId, schema } = state
  return { credentials, observationEvent, observationId, schema }
}

const mapDispatchToProps = {
  replaceObservationEventById,
  clearObservationId,
  setMessageState,
  clearMessageState,
  setObservationEventFinished,
  uploadObservationEvent,
  finishObservationEvent
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  onPressSubmit: () => void,
  children?: ReactChild,
  sourcePage: string,
  isFocused: () => boolean
}

const EditObservationEventComponent = (props: Props) => {
  //states that store the list of all event, the event that's being edited
  const [event, setEvent] = useState<Record<string, any> | undefined>(undefined)
  const [form, setForm] = useState<Array<Element> | undefined>(undefined)
  const [saving, setSaving] = useState<boolean>(false)
  //for react-hook-form
  const { handleSubmit, setValue, unregister, errors, watch, register } = useForm()
  const { t } = useTranslation()
  //for sending modal
  const [modalVisibility, setModalVisibility] = useState<boolean>(false)
  const [sending, setSending] = useState<boolean>(false)

  useEffect(() => {
    init()

    return () => {
      props.clearObservationId()
      setForm(undefined)
    }
  }, [])

  useBackHandler(() => {
    if (props.isFocused()) {
      if (props.sourcePage === 'MapComponent') {
        props.onPressSubmit()
        return true
      }
    }
    return false
  })

  const init = () => {
    //find the correct event by id
    const searchedEvent = props.observationEvent.events.find(event => {
      return event.id === props.observationId.eventId
    })

    if (searchedEvent) {
      setEvent(searchedEvent)
    }
  }

  const onUninitalizedForm = () => {
    if (event) {
      const lang = i18n.language
      let schema = omit(props.schema[lang]?.schema?.properties, 'gatherings.items.properties.units')
      //set the form
      if (props.schema.formID === 'JX.519') {
        initForm(setForm, event, null, register, setValue, watch, errors, unregister, schema, null, JX519ObservationEventFields, null, lang)
      } else if (props.schema.formID === 'JX.652') {
        initForm(setForm, event, null, register, setValue, watch, errors, unregister, schema, null, JX652ObservationEventFields, null, lang)
      }
    }
  }

  const onSubmit = async (data: { [key: string]: any }) => {
    setSaving(true)
    let editedEvent = {}

    Object.keys(data).forEach(key => {
      set(editedEvent, key.split('_'), data[key])
    })

    if (event) {
      editedEvent = merge(event, editedEvent)

      //replace events with the modified copy
      try {
        await props.replaceObservationEventById(editedEvent, props.observationId.eventId)
        props.clearObservationId()
        setSaving(false)
        props.setMessageState({
          type: 'msg',
          messageContent: t('changes saved'),
          onOk: () => {
            props.finishObservationEvent()
            setModalVisibility(true)
          }
        })
      } catch (error) {
        props.setMessageState({
          type: 'err',
          messageContent: error.message,
        })
      }
    }
  }

  const sendObservationEvent = async (isPublic: boolean) => {
    setModalVisibility(false)
    setSending(true)
    try {
      await props.uploadObservationEvent(event?.id, props.credentials, i18n.language, isPublic)
      showMessage(t('post success'))
      setForm(undefined)
      props.onPressSubmit()
    } catch (error) {
      props.setMessageState({
        type: 'err',
        messageContent: error.message,
        onOk: () => {
          setForm(undefined)
          props.onPressSubmit()
        }
      })
    }

    setSending(false)
  }

  const showMessage = (content: string) => {
    props.setMessageState({
      type: 'msg',
      messageContent: content
    })
  }

  if (saving) {
    return (
      <ActivityComponent text={'saving'} />
    )
  } else if (!form) {
    onUninitalizedForm()
    return (
      <ActivityComponent text={'loading'} />
    )
  } else if (sending) {
    return (
      <ActivityComponent text={t('sending')} />
    )
  } else {
    return (
      <View style={Cs.observationContainer}>
        <ScrollView>
          <View style={Cs.formContainer}>
            {form}
          </View>
        </ScrollView>
        <MessageComponent />
        <View style={Cs.formSaveButtonContainer}>
          <FloatingIconButtonComponent onPress={handleSubmit(onSubmit)} />
        </View>
        <SendEventModalComponent modalVisibility={modalVisibility} onCancel={props.onPressSubmit} sendObservationEvent={sendObservationEvent} />
        {props.children}
      </View>
    )
  }
}

export default connector(EditObservationEventComponent)