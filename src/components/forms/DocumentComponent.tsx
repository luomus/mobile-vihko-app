import React, { useState, useEffect, useRef, ReactChild } from 'react'
import { View } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useBackHandler } from '@react-native-community/hooks'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  rootState,
  DispatchType,
  finishObservationEvent,
  replaceObservationEventById,
  clearObservationId,
  uploadObservationEvent,
  setMessageState,
  logoutUser,
  resetReducer
} from '../../stores'
import Cs from '../../styles/ContainerStyles'
import { set, get, merge, mergeWith, omit } from 'lodash'
import MessageComponent from '../general/MessageComponent'
import { initForm } from '../../forms/formMethods'
import i18n from '../../languages/i18n'
import ActivityComponent from '../general/ActivityComponent'
import SaveButtonComponent from './SaveButtonComponent'
import SendEventModalComponent from '../general/SendEventModalComponent'
import { observationEventFields, JX519ObservationEventFields, JX652ObservationEventFields,
  overrideObservationEventFields, overrideJX519ObservationEventFields, overrideJX652ObservationEventFields } from '../../config/fields'

type Props = {
  onPressSubmit: () => void,
  onPressObservationEvent: (id: string) => void,
  onLogout: () => void,
  children?: ReactChild,
  sourcePage: string,
  isFocused: () => boolean
}

const DocumentComponent = (props: Props) => {
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

  //reference for scrollView
  const scrollView = useRef<KeyboardAwareScrollView | null>(null)

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
      if (props.sourcePage === 'map') {
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
      if (schema.formID === 'MHL.45') {
        initForm(setForm, event, null, schemaWithoutUnits, null, observationEventFields, overrideObservationEventFields, null, null, lang, scrollView)
      } else if (schema.formID === 'JX.519') {
        initForm(setForm, event, null, schemaWithoutUnits, null, JX519ObservationEventFields, overrideJX519ObservationEventFields, null, null, lang, scrollView)
      } else if (schema.formID === 'JX.652') {
        initForm(setForm, event, null, schemaWithoutUnits, null, JX652ObservationEventFields, overrideJX652ObservationEventFields, null, null, lang, scrollView)
      }
    }
  }

  const onSubmit = async (data: { [key: string]: any }) => {
    setSaving(true)

    if (event && observationId) {
      let editedEvent = {}

      Object.keys(data).forEach(key => {
        const target = get(editedEvent, key.split('_'))

        if (typeof data[key] === 'object' && !Array.isArray(data[key]) && target) {
          merge(data[key], target)
        }

        set(editedEvent, key.split('_'), data[key])
      })

      const customizer = (target: any, replacer: any) => {
        if (Array.isArray(replacer) && !(( target && typeof target[0] === 'object') || typeof replacer[0] === 'object')) {
          return replacer
        }
      }

      editedEvent = mergeWith(event, editedEvent, customizer)

      //replace events with the modified copy
      try {
        await dispatch(replaceObservationEventById(editedEvent, observationId.eventId))
        if (props.sourcePage !== 'overview') {
          await dispatch(finishObservationEvent())
          setModalVisibility(true)
        } else {
          props.onPressObservationEvent(observationId?.eventId)
        }
        dispatch(clearObservationId())
      } catch (error) {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
        }))
        //redirects to home page in case of error
        props.onPressSubmit()
      } finally {
        setSaving(false)
      }
    }
  }

  const sendObservationEvent = async (isPublic: boolean) => {
    setModalVisibility(false)
    setSending(true)
    try {
      await dispatch(uploadObservationEvent(event?.id, i18n.language, isPublic))
      showMessage(t('post success'))
      setForm(undefined)
      props.onPressSubmit()
    } catch (error) {
      if (error.message !== t('user token has expired')) {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => {
            setForm(undefined)
            props.onPressSubmit()
          }
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
      <View style={Cs.formContainer}>
        <KeyboardAwareScrollView ref={ scrollView }>
          <View style={Cs.formContentContainer}>
            <FormProvider {...methods}>
              {form}
            </FormProvider>
          </View>
        </KeyboardAwareScrollView>
        <MessageComponent />
        <View style={Cs.formSaveButtonContainer}>
          <SaveButtonComponent onPress={methods.handleSubmit(onSubmit)} />
        </View>
        <SendEventModalComponent modalVisibility={modalVisibility} onCancel={props.onPressSubmit} sendObservationEvent={sendObservationEvent} />
        {props.children}
      </View>
    )
  }
}

export default DocumentComponent