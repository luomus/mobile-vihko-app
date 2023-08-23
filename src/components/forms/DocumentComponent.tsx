import React, { useState, useEffect, useRef, ReactChild } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'react-native-elements'
import { useBackHandler } from '@react-native-community/hooks'
import { useTranslation } from 'react-i18next'
import { set, get, merge, mergeWith, omit } from 'lodash'
import moment from 'moment'
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
  clearPath,
  setEditing
} from '../../stores'
import Cs from '../../styles/ContainerStyles'
import MessageComponent from '../general/MessageComponent'
import { initForm } from '../../forms/formMethods'
import i18n from '../../languages/i18n'
import LoadingComponent from '../general/LoadingComponent'
import SendEventModalComponent from '../general/SendEventModalComponent'
import {
  forms, observationEventFields, JX519ObservationEventFields, MHL117ObservationEventFields, JX652ObservationEventFields,
  overrideObservationEventFields, overrideJX519ObservationEventFields, overrideMHL117ObservationEventFields,
  overrideJX652ObservationEventFields, MHL117ObservationEventFieldOrder,
  MHL932ObservationEventFields, overrideMHL932ObservationEventFields, MHL932ObservationEventFieldOrder,
  MHL1040ObservationEventFields, overrideMHL1040ObservationEventFields, MHL1040ObservationEventFieldOrder,
  MHL1042ObservationEventFields, overrideMHL1042ObservationEventFields, MHL1042ObservationEventFieldOrder,
  MHL1043ObservationEventFields, overrideMHL1043ObservationEventFields, MHL1043ObservationEventFieldOrder,
  MHL1044ObservationEventFields, overrideMHL1044ObservationEventFields, MHL1044ObservationEventFieldOrder,
  MHL1045ObservationEventFields, overrideMHL1045ObservationEventFields, MHL1045ObservationEventFieldOrder,
  MHL1046ObservationEventFields, overrideMHL1046ObservationEventFields, MHL1046ObservationEventFieldOrder,
  MHL1047ObservationEventFields, overrideMHL1047ObservationEventFields, MHL1047ObservationEventFieldOrder,
  MHL1048ObservationEventFields, overrideMHL1048ObservationEventFields, MHL1048ObservationEventFieldOrder
} from '../../config/fields'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'

type Props = {
  toHome: () => void,
  toObservationEvent: (id: string) => void,
  toMap: () => void,
  onLogout: () => void,
  children?: ReactChild,
  sourcePage: string,
  isFocused: () => boolean
}

const DocumentComponent = (props: Props) => {
  //states that store the list of all event, the event that's being edited
  const [event, setEvent] = useState<Record<string, any> | undefined>(undefined)
  const [form, setForm] = useState<Array<Element | undefined> | null>(null)
  const [saving, setSaving] = useState<boolean>(false)
  //for react-hook-form
  const methods = useForm()
  const { t } = useTranslation()
  //for sending modal
  const [modalVisibility, setModalVisibility] = useState<boolean>(false)
  const [sending, setSending] = useState<boolean>(false)

  //reference for scrollView
  const scrollViewRef = useRef<KeyboardAwareScrollView | null>(null)

  const editing = useSelector((state: rootState) => state.editing)
  const grid = useSelector((state: rootState) => state.grid)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const observationId = useSelector((state: rootState) => state.observationId)
  const path = useSelector((state: rootState) => state.path)
  const schema = useSelector((state: rootState) => state.schema)

  const dispatch: DispatchType = useDispatch()

  useEffect(() => {
    init()

    return () => {
      dispatch(clearObservationId())
      setForm(null)
    }
  }, [])

  useBackHandler(() => {
    if (props.isFocused()) {
      if (props.sourcePage === 'map') {
        props.toHome()
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
      const schemaWithoutUnits = omit(schema[lang]?.schema?.properties, 'gatherings.items.properties.units')
      //set the form
      if (schema.formID === forms.lolife) {
        initForm(setForm, event, null, schemaWithoutUnits, null, observationEventFields, overrideObservationEventFields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.tripForm) {
        initForm(setForm, event, null, schemaWithoutUnits, null, JX519ObservationEventFields, overrideJX519ObservationEventFields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.birdAtlas) {
        initForm(setForm, event, null, schemaWithoutUnits, null, MHL117ObservationEventFields, overrideMHL117ObservationEventFields, null, MHL117ObservationEventFieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.fungiAtlas) {
        initForm(setForm, event, null, schemaWithoutUnits, null, JX652ObservationEventFields, overrideJX652ObservationEventFields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.dragonflyForm) {
        initForm(setForm, event, null, schemaWithoutUnits, null, MHL932ObservationEventFields, overrideMHL932ObservationEventFields, null, MHL932ObservationEventFieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.butterflyForm) {
        initForm(setForm, event, null, schemaWithoutUnits, null, MHL1040ObservationEventFields, overrideMHL1040ObservationEventFields, null, MHL1040ObservationEventFieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.largeFlowersForm) {
        initForm(setForm, event, null, schemaWithoutUnits, null, MHL1042ObservationEventFields, overrideMHL1042ObservationEventFields, null, MHL1042ObservationEventFieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.mothForm) {
        initForm(setForm, event, null, schemaWithoutUnits, null, MHL1043ObservationEventFields, overrideMHL1043ObservationEventFields, null, MHL1043ObservationEventFieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.bumblebeeForm) {
        initForm(setForm, event, null, schemaWithoutUnits, null, MHL1044ObservationEventFields, overrideMHL1044ObservationEventFields, null, MHL1044ObservationEventFieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.herpForm) {
        initForm(setForm, event, null, schemaWithoutUnits, null, MHL1045ObservationEventFields, overrideMHL1045ObservationEventFields, null, MHL1045ObservationEventFieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.subarcticForm) {
        initForm(setForm, event, null, schemaWithoutUnits, null, MHL1046ObservationEventFields, overrideMHL1046ObservationEventFields, null, MHL1046ObservationEventFieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.macrolichenForm) {
        initForm(setForm, event, null, schemaWithoutUnits, null, MHL1047ObservationEventFields, overrideMHL1047ObservationEventFields, null, MHL1047ObservationEventFieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.bracketFungiForm) {
        initForm(setForm, event, null, schemaWithoutUnits, null, MHL1048ObservationEventFields, overrideMHL1048ObservationEventFields, null, MHL1048ObservationEventFieldOrder, lang, scrollViewRef)
      }
    }
  }

  //as complete list field is the only possible validation error, scroll to top when validation error occurs
  const onError = async () => {
    scrollViewRef?.current?.scrollToPosition(0, 0, false)
  }

  const onSubmit = async (data: { [key: string]: any }) => {
    setSaving(true)

    //set editing off if it is on
    if (editing) {
      dispatch(setEditing({
        started: false,
        locChanged: false,
        originalSourcePage: editing.originalSourcePage
      }))
    }

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
          props.toObservationEvent(observationId?.eventId)
        }
        dispatch(clearObservationId())
      } catch (error: any) {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
        }))
        //redirects to home page in case of error
        props.toHome()
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
      setForm(null)
      props.toHome()
    } catch (error: any) {
      if (error.severity === 'low') {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => {
            setForm(null)
            props.toHome()
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

  const showCancel = () => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('discard document?'),
      cancelLabel: t('cancel'),
      okLabel: t('exit'),
      onOk: () => {
        if (props.sourcePage === 'map') {
          props.toMap()
        } else if (props.sourcePage === 'home') {
          props.toHome()
        } else if (props.sourcePage === 'overview') {
          if (!observationId) { return }
          props.toObservationEvent(observationId?.eventId)
        }
      }
    }))
  }

  const deletePath = () => {
    let pathPoints = 0
    path.forEach(section => pathPoints += section.length)

    const firstTimestamp = path[0][0][3]
    const lastTimestamp = path[path.length - 1][path[path.length - 1].length - 1][3]
    const firstMoment = moment(firstTimestamp).format('HH.mm')
    const lastMoment = moment(lastTimestamp).format('HH.mm')

    let messageContent = t('delete path description 1')
      + ' ' + pathPoints + ' '
      + t('delete path description 2')
      + ' ' + firstMoment + ' - ' + lastMoment + '. '
      + t('delete path description 3')

    const birdAtlasMessageContent = t('delete bird atlas path 1')
      + ' ' + grid?.n + ':' + grid?.e + '. '
      + t('delete bird atlas path 2')

    if (schema.formID === forms.birdAtlas) { messageContent += ('\n\n' + birdAtlasMessageContent) }

    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: messageContent,
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
      <LoadingComponent text={'saving'} />
    )
  } else if (!form) {
    onUninitalizedForm()
    return (
      <LoadingComponent text={'loading'} />
    )
  } else if (sending) {
    return (
      <LoadingComponent text={t('sending')} />
    )
  } else {
    return (
      <View style={Cs.formContainer}>
        <View style={Cs.formSaveButtonContainer}>
          <TouchableOpacity onPress={methods.handleSubmit(onSubmit, onError)} testID={'saveButton'}>
            <Icon reverse color={Colors.successButton1} name='done' type='material-icons' raised size={30} />
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView style={Cs.padding10Container} ref={scrollViewRef}>
          <View style={Cs.buttonContainer}>
            <ButtonComponent onPressFunction={() => showCancel()}
              title={t('cancel')} height={40} width={150} buttonStyle={Bs.editObservationButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'close'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
          </View>
          {(event?.formID !== 'MHL.117' && !(path.length === 1 && path[0].length === 0)) ?
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
        <SendEventModalComponent modalVisibility={modalVisibility} onCancel={props.toHome} sendObservationEvent={sendObservationEvent} />
        {props.children}
      </View>
    )
  }
}

export default DocumentComponent