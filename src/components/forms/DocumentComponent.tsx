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
  resetReducer,
  clearPath
} from '../../stores'
import Cs from '../../styles/ContainerStyles'
import { set, get, merge, mergeWith, omit } from 'lodash'
import MessageComponent from '../general/MessageComponent'
import { initForm } from '../../forms/formMethods'
import i18n from '../../languages/i18n'
import ActivityComponent from '../general/ActivityComponent'
import SaveButtonComponent from './SaveButtonComponent'
import SendEventModalComponent from '../general/SendEventModalComponent'
import {
  forms, observationEventFields, JX519ObservationEventFields, MHL117ObservationEventFields, JX652ObservationEventFields,
  overrideObservationEventFields, overrideJX519ObservationEventFields, overrideMHL117ObservationEventFields,
  overrideJX652ObservationEventFields, MHL117ObservationEventFieldOrder
} from '../../config/fields'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'

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
  const path = useSelector((state: rootState) => state.path)
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
      if (schema.formID === forms.lolife) {
        initForm(setForm, event, null, schemaWithoutUnits, null, observationEventFields, overrideObservationEventFields, null, null, lang, scrollView)
      } else if (schema.formID === forms.tripForm) {
        initForm(setForm, event, null, schemaWithoutUnits, null, JX519ObservationEventFields, overrideJX519ObservationEventFields, null, null, lang, scrollView)
      } else if (schema.formID === forms.birdAtlas) {
        initForm(setForm, event, null, schemaWithoutUnits, null, MHL117ObservationEventFields, overrideMHL117ObservationEventFields, null, MHL117ObservationEventFieldOrder, lang, scrollView)
      } else if (schema.formID === forms.fungiAtlas) {
        initForm(setForm, event, null, schemaWithoutUnits, null, JX652ObservationEventFields, overrideJX652ObservationEventFields, null, null, lang, scrollView)
      }
    }
  }

  //as complete list field is the only possible validation error, scroll to top when validation error occurs
  const onError = async () => {
    scrollView?.current?.scrollToPosition(0, 0, false)
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
        if (Array.isArray(replacer) && !((target && typeof target[0] === 'object') || typeof replacer[0] === 'object')) {
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
      } catch (error: any) {
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
    } catch (error: any) {
      if (error.severity === 'low') {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => {
            setForm(undefined)
            props.onPressSubmit()
            if (error.message.includes(t('locality failure'))) showMessage(t('post success'))
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

  const deletePath = () => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('delete path description'),
      onOk: () => dispatch(clearPath())
    }))
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
        <View style={Cs.formSaveButtonContainer}>
          <SaveButtonComponent onPress={methods.handleSubmit(onSubmit, onError)} />
        </View>
        <KeyboardAwareScrollView style={Cs.padding10Container} ref={scrollView}>
          {!(path.length === 1 && path[0].length === 0) ?
            <View style={Cs.buttonContainer}>
              <ButtonComponent onPressFunction={() => deletePath()}
                title={t('delete path')} height={40} width={150} buttonStyle={Bs.editObservationButton}
                gradientColorStart={Colors.dangerButton1} gradientColorEnd={Colors.dangerButton2} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={'delete'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
              />
            </View>
            : null
          }
          <View style={Cs.formContentContainer}>
            <FormProvider {...methods}>
              <>{form}</>
            </FormProvider>
          </View>
        </KeyboardAwareScrollView>
        <MessageComponent />
        <SendEventModalComponent modalVisibility={modalVisibility} onCancel={props.onPressSubmit} sendObservationEvent={sendObservationEvent} />
        {props.children}
      </View>
    )
  }
}

export default DocumentComponent