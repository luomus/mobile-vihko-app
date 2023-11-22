import React, { useState, useEffect, useRef, ReactChild } from 'react'
import { ActionSheetIOS, Platform, View } from 'react-native'
import { useBackHandler } from '@react-native-community/hooks'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { mergeWith, omit } from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  rootState,
  DispatchType,
  newObservation,
  clearObservationLocation,
  replaceObservationById,
  clearObservationId,
  setObservationLocation,
  setMessageState,
  setEditing,
  uploadObservationEvent,
  logoutUser,
  resetReducer,
  replaceObservationEventById,
  finishSingleObservation,
} from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import MessageComponent from '../general/MessageComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import { initForm } from '../../forms/formMethods'
import { get, set, clone, merge } from 'lodash'
import uuid from 'react-native-uuid'
import i18n from '../../languages/i18n'
import LoadingComponent from '../general/LoadingComponent'
import {
  forms, biomonForms, singleObservationFields, singleObservationFieldOrder, overrideSingleObservationFields, additionalSingleObservationFields, JX519Fields, JX519ObservationEventFields
} from '../../config/fields'
import Colors from '../../styles/Colors'
import SendEventModalComponent from '../general/SendEventModalComponent'
import MiniMapComponent from '../overview/MiniMapComponent'

type Props = {
  toObservationEvent: (id: string) => void,
  toMap: () => void,
  toList: () => void,
  pushToMap: () => void,
  rules?: Record<string, any>,
  defaults?: Record<string, any>,
  sourcePage?: string,
  children?: ReactChild,
  isFocused: () => boolean,
  goBack: () => void,
  toHome: () => void,
  onLogout: () => void,
}

const SingleObservationComponent = (props: Props) => {

  //for react-hook-form
  const methods = useForm()
  const { t } = useTranslation()
  const [saving, setSaving] = useState<boolean>(false)
  const lang = i18n.language
  const [event, setEvent] = useState<Record<string, any> | undefined>(undefined)
  const [form, setForm] = useState<Array<React.JSX.Element | undefined> | null>(null)
  const [observationState, setObservationState] = useState<Record<string, any> | undefined>(undefined)
  const [modalVisibility, setModalVisibility] = useState<boolean>(false)
  const [sending, setSending] = useState<boolean>(false)

  //reference for scrollView
  const scrollViewRef = useRef<KeyboardAwareScrollView | null>(null)

  const editing = useSelector((state: rootState) => state.editing)
  const observation = useSelector((state: rootState) => state.observation)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const observationId = useSelector((state: rootState) => state.observationId)
  const observationEventId = useSelector((state: rootState) => state.observationEventId)
  const schema = useSelector((state: rootState) => state.schema)

  const dispatch: DispatchType = useDispatch()

  useEffect(() => {
    //initialize only when editing observations
    if (observationId) {
      initObservation()
    }

    initEvent()

    //checks which screen we are coming from
    if (props.sourcePage && !editing.started) {
      dispatch(setEditing({
        started: false,
        locChanged: false,
        originalLocation: editing.originalLocation,
        originalSourcePage: props.sourcePage
      }))
    }
  }, [])

  useEffect(() => {
    onUninitializedForm()
  }, [lang])

  useBackHandler(() => {

    if (props.isFocused()) {

      dispatch(setMessageState({
        type: 'redConf',
        messageContent: t('discard observation?'),
        cancelLabel: t('cancel'),
        okLabel: t('discard without saving'),
        onOk: () => {
          cleanUp()
        }
      }))

      return true
    }

    return false
  })

  const cleanUp = () => {
    //cleanup when component unmounts, ensures that if navigator back-button
    //is used observationLocation, observationId and editing-flags are returned
    //to defaults
    dispatch(clearObservationLocation())
    dispatch(setEditing({
      started: false,
      locChanged: false,
      originalLocation: editing.originalLocation,
      originalSourcePage: editing.originalSourcePage
    }))
    dispatch(clearObservationId())
    props.goBack()
  }

  //initialization (only for editing observations)
  const initObservation = () => {
    //clone events from reducer for modification
    const searchedEvent = observationEvent.events.find(event => {
      return event.id === observationEventId
    })

    if (!searchedEvent) {
      return
    }

    //find the correct observation by id
    const searchedObservation = clone(
      searchedEvent.gatherings[0].units.find((observation: Record<string, any>) => {
        return observation.id === observationId
      })
    )

    if (!searchedObservation) {
      return
    }

    setObservationState(searchedObservation)
  }

  const initEvent = () => {
    //find the correct event by id
    const searchedEvent = observationEvent.events.find(event => {
      return event.id === observationEventId
    })

    if (searchedEvent) {
      setEvent(searchedEvent)
    }
  }

  const onUninitializedForm = () => {
    //if editing observation but observation not yet extracted from observation event
    if (observationId && !observationState) {
      return
    }

    const schemaVar = schema[lang]?.schema?.properties?.gatherings?.items?.properties?.units || null
    const defaultObject: Record<string, any> = {}

    if (props.defaults) {
      Object.keys(props.defaults).forEach(key => {
        set(defaultObject, key.split('_'), props.defaults?.[key])
      })
    }

    set(defaultObject, ['unitGathering', 'geometry'], observation)

    const schemaWithoutUnits = omit(schema[lang]?.schema?.properties, 'gatherings.items.properties.units')

    //edit observation
    if (observationId) {
      initForm(setForm, observationState, null, schemaVar, schemaWithoutUnits, null, singleObservationFields, overrideSingleObservationFields, additionalSingleObservationFields, singleObservationFieldOrder, lang, scrollViewRef)
      //new observation
    } else {
      initForm(setForm, defaultObject, null, schemaVar, schemaWithoutUnits, null, singleObservationFields, overrideSingleObservationFields, additionalSingleObservationFields, singleObservationFieldOrder, lang, scrollViewRef)
    }
  }

  //as autocomplete field is the only possible validation error, scroll to top when validation error occurs
  const onError = async () => {
    scrollViewRef?.current?.scrollToPosition(0, 0, false)
  }

  const onSubmit = async (data: { [key: string]: any }, sendMode: string) => {
    if (!observationState) {
      await submitObservation(data)
    } else {
      await updateObservation(data)
    }

    await submitDocument(data)

    if (sendMode === 'public') {
      await sendDocument(true)
    } else if (sendMode === 'private') {
      await sendDocument(false)
    } else {
      props.toHome()
    }
  }

  const submitObservation = async (data: { [key: string]: any }) => {
    setSaving(true)

    const newUnit: Record<string, any> = {}

    //add id and rules in use internally, destroyed before sending
    if (props.sourcePage !== 'list') {
      set(newUnit, 'id', `observation_${uuid.v4()}`)
    } else {
      set(newUnit, 'id', `complete_list_${uuid.v4()}`)
    }

    if (props.rules) {
      set(newUnit, 'rules', props.rules)
    }

    Object.keys(data).forEach(key => {
      if (
        data[key] === undefined || data[key] === null || (!(JX519Fields.includes(key))
          && (key !== 'unitGathering_geometry')) && (key !== 'unitFact_autocompleteSelectedTaxonID') && (key !== 'informalTaxonGroups') && (key !== 'unitGathering_geometry_radius')
      ) {
        return
      }

      const target = get(newUnit, key.split('_'))

      if (typeof data[key] === 'object' && !Array.isArray(data[key]) && target) {
        merge(data[key], target)
      }

      set(newUnit, key.split('_'), data[key])
    })

    if (Object.values(biomonForms).includes(schema.formID) && newUnit.count === '') {
      set(newUnit, 'count', 'X')
    }

    //set correct color for obseration, if available
    const color = schema[lang].uiSchemaParams?.unitColors?.find((unitColor: Record<string, any>) => {
      const field: string = unitColor.rules.field
      if (newUnit[field]) {
        return new RegExp(unitColor.rules.regexp).test(newUnit[unitColor.rules.field])
      }

      return false
    })?.color

    if (color) {
      set(newUnit, 'color', color)
    }

    if (!(newUnit.unitGathering.geometry.coordinates[0] === observation?.coordinates[0]
      && newUnit.unitGathering.geometry.coordinates[1] === observation?.coordinates[1])) {
      newUnit.unitGathering.geometry = observation
    }

    //update the event state before saving document fields
    const eventCopy = event
    if (eventCopy) eventCopy.gatherings[0].units.push(newUnit)
    setEvent(eventCopy)

    //add the new observation to latest event, clear location
    try {
      await dispatch(newObservation(newUnit))
      dispatch(clearObservationLocation())
      setSaving(false)
    } catch (error: any) {
      setSaving(false)
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message
      }))
    }
  }

  const updateObservation = async (data: { [key: string]: any }) => {
    setSaving(true)

    if (!observationState || !observationId) {
      setSaving(false)
      return
    }

    //construct new observation (unit) from old observation, data and new location if present from form and images
    let editedUnit: Record<string, any> = {}

    Object.keys(data).forEach(key => {
      if (
        data[key] === undefined || data[key] === null || (!(JX519Fields.includes(key))
          && (key !== 'unitGathering_geometry')) && (key !== 'unitFact_autocompleteSelectedTaxonID') && (key !== 'informalTaxonGroups') && (key !== 'unitGathering_geometry_radius')
      ) {
        return
      }

      const target = get(editedUnit, key.split('_'))

      if (typeof data[key] === 'object' && !Array.isArray(data[key]) && target) {
        merge(data[key], target)
      }

      set(editedUnit, key.split('_'), data[key])
    })

    //if editing-flag 1st and 2nd elements are true replace location with new location, and clear editing-flag
    if (editing.started && editing.locChanged) {
      observation ? set(editedUnit, ['unitGathering', 'geometry'], merge(get(editedUnit, ['unitGathering', 'geometry']), observation)) : null
      dispatch(setEditing({
        started: false,
        locChanged: false,
        originalLocation: editing.originalLocation,
        originalSourcePage: editing.originalSourcePage
      }))
    }

    editedUnit = {
      ...observationState,
      ...editedUnit,
    }

    //for bird atlas list observations, set count to x, if atlasCode nor count is given
    if (schema.formID === forms.birdAtlas
      && editedUnit.id.includes('complete_list')
      && (!editedUnit.atlasCode || editedUnit.atlasCode === '')
      && !editedUnit.count) {
      set(editedUnit, 'count', 'X')

      //for all biomon observations, set count to x if count is not given
    } else if (Object.values(biomonForms).includes(schema.formID)
      && !editedUnit.count
    ) {
      set(editedUnit, 'count', 'X')
    }

    //update the event state before saving document fields
    const eventCopy = event
    if (eventCopy) eventCopy.gatherings[0].units = [editedUnit]
    setEvent(eventCopy)

    //replace original observation with edited one
    try {
      await dispatch(replaceObservationById(editedUnit, observationEventId, observationId))
      dispatch(clearObservationLocation())
      dispatch(clearObservationId())
      dispatch(setEditing({
        started: false,
        locChanged: false,
        originalLocation: editing.originalLocation,
        originalSourcePage: ''
      }))

    } catch (error: any) {
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message
      }))
    } finally {
      setSaving(false)
    }
  }

  const submitDocument = async (data: { [key: string]: any }) => {
    setSaving(true)

    //set editing off if it is on
    if (editing) {
      dispatch(setEditing({
        started: false,
        locChanged: false,
        originalLocation: editing.originalLocation,
        originalSourcePage: editing.originalSourcePage
      }))
    }

    if (event && observationEventId) {
      let editedEvent = {}

      Object.keys(data).forEach(key => {
        if (!(JX519ObservationEventFields.includes(key))) {
          return
        }

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
        await dispatch(replaceObservationEventById(editedEvent, observationEventId))
        if (props.sourcePage !== 'overview') {
          await dispatch(finishSingleObservation())
          setModalVisibility(true)
        } else {
          props.toObservationEvent(observationEventId)
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

  const sendDocument = async (isPublic: boolean) => {

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

  //redirects navigator to map for selection of new observation location
  const editObservationLocation = () => {
    dispatch(setObservationLocation(observation ? observation : event?.gatherings[0]?.geometry))
    dispatch(setEditing({
      started: true,
      locChanged: false,
      originalLocation: observation ? observation : editing.originalLocation,
      originalSourcePage: editing.originalSourcePage
    }))
    props.pushToMap()
  }

  const showMessage = (content: string) => {
    dispatch(setMessageState({
      type: 'msg',
      messageContent: content
    }))
  }

  const showCancel = () => {
    dispatch(setMessageState({
      type: 'redConf',
      messageContent: t('discard observation?'),
      cancelLabel: t('cancel'),
      okLabel: t('discard without saving'),
      onOk: () => {
        cleanUp()
        if (editing.originalSourcePage === 'map') {
          props.toMap()
        } else if (editing.originalSourcePage === 'overview') {
          if (!observationId) { return }
          props.toObservationEvent(observationEventId)
        } else if (editing.originalSourcePage === 'list') {
          props.toList()
        }
      }
    }))
  }

  const onPressOptionsIOS = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [t('send private'), t('saveWithoutSending'), t('cancel')],
        cancelButtonIndex: 2,
        title: t('send description')
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          methods.handleSubmit((data) => onSubmit(data, 'private'), onError)()
        } else if (buttonIndex === 1) {
          methods.handleSubmit((data) => onSubmit(data, 'not'), onError)()
        }
      }
    )

  if (saving) {
    return (
      <LoadingComponent text={'saving'} />
    )
  } else if (!form) {
    onUninitializedForm()
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
          <ButtonComponent onPressFunction={() => { Platform.OS === 'ios' ? onPressOptionsIOS() : setModalVisibility(true) }}
            title={undefined} height={40} width={40} buttonStyle={Bs.mapIconButton}
            gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={'more-vert'} iconType={'material-icons'} iconSize={26} contentColor={Colors.darkText}
          />
          <ButtonComponent onPressFunction={() => showCancel()}
            title={t('cancel')} height={40} width={90} buttonStyle={Bs.editObservationButton}
            gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={22} contentColor={Colors.darkText}
          />
          <ButtonComponent
            onPressFunction={methods.handleSubmit((data) => onSubmit(data, 'public'), onError)}
            testID={'saveButton'}
            title={t('send public')} height={40} width={160} buttonStyle={Bs.editObservationButton}
            gradientColorStart={Colors.successButton1} gradientColorEnd={Colors.successButton2} shadowColor={Colors.successShadow}
            textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={22} contentColor={Colors.whiteText}
          />
        </View>
        <KeyboardAwareScrollView style={Cs.padding10Container} keyboardShouldPersistTaps='always' ref={scrollViewRef}>
          {(observation || event?.gatherings[0]?.geometry) ?
            <View style={{ width: '95%', alignSelf: 'center' }}>
              <MiniMapComponent geometry={observation ? observation : event?.gatherings[0]?.geometry} color={Colors.observationColor} />
            </View>
            : null
          }
          <View style={Cs.buttonContainer}>
            <ButtonComponent onPressFunction={() => editObservationLocation()}
              title={t('edit location')} height={40} width={150} buttonStyle={Bs.editObservationButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'edit-location'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
          </View>
          <View style={Cs.formContentContainer}>
            <FormProvider {...methods}>
              <>{form}</>
            </FormProvider>
          </View>
        </KeyboardAwareScrollView>
        {props.children}
        <MessageComponent />
        <SendEventModalComponent modalVisibility={modalVisibility} setModalVisibility={setModalVisibility}
          onSendPrivate={methods.handleSubmit((data) => onSubmit(data, 'private'), onError)}
          onCancel={methods.handleSubmit((data) => onSubmit(data, 'not'), onError)} cancelTitle={t('saveWithoutSending')} />
      </View>
    )
  }
}

export default SingleObservationComponent