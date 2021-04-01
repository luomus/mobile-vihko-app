import React, { useState, useEffect, ReactChild } from 'react'
import { View, ScrollView } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useBackHandler } from '@react-native-community/hooks'
import { useTranslation } from 'react-i18next'
import {
  rootState,
  DispatchType,
  finishObservationEvent,
  replaceObservationEventById,
  clearObservationId,
  uploadObservationEvent,
  setMessageState
} from '../../stores'
import Cs from '../../styles/ContainerStyles'
import { set, merge, omit } from 'lodash'
import MessageComponent from '../general/MessageComponent'
import { initForm } from '../../forms/formMethods'
import i18n from '../../languages/i18n'
import ActivityComponent from '../general/ActivityComponent'
import FloatingIconButtonComponent from './FloatingIconButtonComponent'
import SendEventModalComponent from '../general/SendEventModalComponent'
import { JX519ObservationEventFields, JX652ObservationEventFields } from '../../config/fields'

type Props = {
  onPressSubmit: () => void,
  onPressObservationEvent: () => void,
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
  const methods = useForm()
  const { t } = useTranslation()
  //for sending modal
  const [modalVisibility, setModalVisibility] = useState<boolean>(false)
  const [sending, setSending] = useState<boolean>(false)

  const credentials = useSelector((state: rootState) => state.credentials)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const observationId = useSelector((state: rootState) => state.observationId)
  const schema = useSelector((state: rootState) => state.schema)

  const dispatch: DispatchType = useDispatch()

  useEffect(() => {
    init()

    return () => {
      dispatch(clearObservationId())
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
    const searchedEvent = observationEvent.events.find(event => {
      return event.id === observationId?.eventId
    })

    if (searchedEvent) {
      setEvent(searchedEvent)
    }
  }

  const onUninitalizedForm = () => {
    if (event) {
      const lang = i18n.language
      let schemaWithoutUnits = omit(schema[lang]?.schema?.properties, 'gatherings.items.properties.units')
      //set the form
      if (schema.formID === 'JX.519') {
        initForm(setForm, event, null, schemaWithoutUnits, null, JX519ObservationEventFields, null, null, lang)
      } else if (schema.formID === 'JX.652') {
        initForm(setForm, event, null, schemaWithoutUnits, null, JX652ObservationEventFields, null, null, lang)
      }
    }
  }

  const onSubmit = async (data: { [key: string]: any }) => {
    setSaving(true)
    let editedEvent = {}

    Object.keys(data).forEach(key => {
      set(editedEvent, key.split('_'), data[key])
    })

    if (event && observationId) {
      editedEvent = merge(event, editedEvent)

      //replace events with the modified copy
      try {
        await dispatch(replaceObservationEventById(editedEvent, observationId.eventId))
        if (props.sourcePage !== 'ObservationEventComponent') {
          await dispatch(finishObservationEvent())
          setModalVisibility(true)
        } else {
          props.onPressObservationEvent()
        }
        dispatch(clearObservationId())
        setSaving(false)
      } catch (error) {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
        }))
      }
    }
  }

  const sendObservationEvent = async (isPublic: boolean) => {
    setModalVisibility(false)
    setSending(true)
    try {
      await dispatch(uploadObservationEvent(event?.id, credentials, i18n.language, isPublic))
      showMessage(t('post success'))
      setForm(undefined)
      props.onPressSubmit()
    } catch (error) {
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message,
        onOk: () => {
          setForm(undefined)
          props.onPressSubmit()
        }
      }))
    }

    setSending(false)
  }

  const showMessage = (content: string) => {
    dispatch(setMessageState({
      type: 'msg',
      messageContent: content
    }))
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
            <FormProvider {...methods}>
              {form}
            </FormProvider>
          </View>
        </ScrollView>
        <MessageComponent />
        <View style={Cs.formSaveButtonContainer}>
          <FloatingIconButtonComponent onPress={methods.handleSubmit(onSubmit)} />
        </View>
        <SendEventModalComponent modalVisibility={modalVisibility} onCancel={props.onPressSubmit} sendObservationEvent={sendObservationEvent} />
        {props.children}
      </View>
    )
  }
}

export default EditObservationEventComponent