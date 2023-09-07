import React, { useState, useEffect, useRef, ReactChild } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useBackHandler } from '@react-native-community/hooks'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import { omit } from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  rootState,
  DispatchType,
  newObservation,
  clearObservationLocation,
  replaceObservationById,
  clearObservationId,
  deleteObservation,
  setObservationLocation,
  setMessageState,
  setEditing
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
import { pathToLineStringConstructor } from '../../helpers/geoJSONHelper'
import {
  JX519Fields, overrideJX519Fields, additionalJX519Fields, JX519FieldOrder,
  MHL117Fields, overrideMHL117Fields, MHL117FieldOrder, additionalMHL117Fields,
  JX652Fields, overrideJX652Fields, MHL932Fields, overrideMHL932Fields, forms, biomonForms,
  MHL1040Fields, overrideMHL1040Fields, MHL1042Fields, overrideMHL1042Fields,
  MHL1043Fields, overrideMHL1043Fields, MHL1044Fields, overrideMHL1044Fields,
  MHL1045Fields, overrideMHL1045Fields, MHL1046Fields, overrideMHL1046Fields,
  MHL1047Fields, overrideMHL1047Fields, MHL1048Fields, overrideMHL1048Fields,
  MHL1062Fields, overrideMHL1062Fields
} from '../../config/fields'
import Colors from '../../styles/Colors'

type Props = {
  toObservationEvent: (id: string) => void,
  toMap: () => void,
  toList: () => void,
  pushToMap: () => void,
  isNew?: boolean,
  rules?: Record<string, any>,
  defaults?: Record<string, any>,
  sourcePage?: string,
  children?: ReactChild,
  isFocused: () => boolean,
  goBack: () => void
}

const ObservationComponent = (props: Props) => {

  //for react-hook-form
  const methods = useForm()
  const { t } = useTranslation()
  const [saving, setSaving] = useState<boolean>(false)
  const lang = i18n.language
  const [form, setForm] = useState<Array<React.JSX.Element | undefined> | null>(null)
  const [observationState, setObservationState] = useState<Record<string, any> | undefined>(undefined)

  //reference for scrollView
  const scrollViewRef = useRef<KeyboardAwareScrollView | null>(null)

  const editing = useSelector((state: rootState) => state.editing)
  const observation = useSelector((state: rootState) => state.observation)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const observationId = useSelector((state: rootState) => state.observationId)
  const path = useSelector((state: rootState) => state.path)
  const schema = useSelector((state: rootState) => state.schema)

  const dispatch: DispatchType = useDispatch()

  useEffect(() => {
    //initialize only when editing observations
    if (observationId) {
      init()
    }

    //checks which screen we are coming from
    if (props.sourcePage && !editing.started) {
      dispatch(setEditing({
        started: false,
        locChanged: false,
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
        type: 'dangerConf',
        messageContent: t('discard observation?'),
        cancelLabel: t('cancel'),
        okLabel: t('exit'),
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
      originalSourcePage: editing.originalSourcePage
    }))
    dispatch(clearObservationId())
    props.goBack()
  }

  //initialization (only for editing observations)
  const init = () => {
    //clone events from reducer for modification
    const searchedEvent = observationEvent.events.find(event => {
      return event.id === observationId?.eventId
    })

    if (!searchedEvent) {
      return
    }

    //find the correct observation by id
    const searchedObservation = clone(
      searchedEvent.gatherings[0].units.find((observation: Record<string, any>) => {
        return observation.id === observationId?.unitId
      })
    )

    if (!searchedObservation) {
      return
    }

    setObservationState(searchedObservation)
  }

  const onUninitializedForm = () => {
    //if editing observation but observation not yet extracted from observation event
    if (observationId && !observationState) {
      return
    }

    const schemaVar = schema[lang]?.schema?.properties?.gatherings?.items?.properties?.units || null
    const fieldScopes = schema[lang]?.uiSchemaParams?.unitFieldScopes || null
    const defaultObject: Record<string, any> = {}

    if (props.defaults) {
      Object.keys(props.defaults).forEach(key => {
        set(defaultObject, key.split('_'), props.defaults?.[key])
      })
    }

    set(defaultObject, ['unitGathering', 'geometry'], observation)

    //edit observations
    if (observationId) {
      //flying squirrel edit observation
      if (observationState?.rules) {
        initForm(setForm, observationState, observationState.rules, schemaVar, fieldScopes, null, null, null, null, lang, scrollViewRef)
        //trip form edit observation
      } else if (schema.formID === forms.tripForm) {
        initForm(setForm, observationState, null, schemaVar, null, JX519Fields, overrideJX519Fields, additionalJX519Fields, JX519FieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.birdAtlas) {
        const additionalMHL117 = observationState?.id.includes('complete_list') ? null : additionalMHL117Fields
        initForm(setForm, observationState, null, schemaVar, null, MHL117Fields, overrideMHL117Fields, additionalMHL117, MHL117FieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.fungiAtlas) {
        initForm(setForm, observationState, null, schemaVar, null, JX652Fields, overrideJX652Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.dragonflyForm) {
        initForm(setForm, observationState, null, schemaVar, null, MHL932Fields, overrideMHL932Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.butterflyForm) {
        initForm(setForm, observationState, null, schemaVar, null, MHL1040Fields, overrideMHL1040Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.largeFlowersForm) {
        initForm(setForm, observationState, null, schemaVar, null, MHL1042Fields, overrideMHL1042Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.mothForm) {
        initForm(setForm, observationState, null, schemaVar, null, MHL1043Fields, overrideMHL1043Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.bumblebeeForm) {
        initForm(setForm, observationState, null, schemaVar, null, MHL1044Fields, overrideMHL1044Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.herpForm) {
        initForm(setForm, observationState, null, schemaVar, null, MHL1045Fields, overrideMHL1045Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.subarcticForm) {
        initForm(setForm, observationState, null, schemaVar, null, MHL1046Fields, overrideMHL1046Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.macrolichenForm) {
        initForm(setForm, observationState, null, schemaVar, null, MHL1047Fields, overrideMHL1047Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.bracketFungiForm) {
        initForm(setForm, observationState, null, schemaVar, null, MHL1048Fields, overrideMHL1048Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.practicalFungiForm) {
        initForm(setForm, observationState, null, schemaVar, null, MHL1062Fields, overrideMHL1062Fields, null, null, lang, scrollViewRef)
      }

      //new observations
    } else {
      //flying squirrel new observation
      if (props.rules) {
        initForm(setForm, defaultObject, props.rules, schemaVar, fieldScopes, null, null, null, null, lang, scrollViewRef)
        //trip form new observation
      } else if (schema.formID === forms.tripForm) {
        initForm(setForm, defaultObject, null, schemaVar, null, JX519Fields, overrideJX519Fields, additionalJX519Fields, JX519FieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.birdAtlas) {
        const additionalMHL117 = observationState?.id.includes('complete_list') ? null : additionalMHL117Fields
        initForm(setForm, defaultObject, null, schemaVar, null, MHL117Fields, overrideMHL117Fields, additionalMHL117, MHL117FieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.fungiAtlas) {
        initForm(setForm, defaultObject, null, schemaVar, null, JX652Fields, overrideJX652Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.dragonflyForm) {
        initForm(setForm, defaultObject, null, schemaVar, null, MHL932Fields, overrideMHL932Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.butterflyForm) {
        initForm(setForm, defaultObject, null, schemaVar, null, MHL1040Fields, overrideMHL1040Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.largeFlowersForm) {
        initForm(setForm, defaultObject, null, schemaVar, null, MHL1042Fields, overrideMHL1042Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.mothForm) {
        initForm(setForm, defaultObject, null, schemaVar, null, MHL1043Fields, overrideMHL1043Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.bumblebeeForm) {
        initForm(setForm, defaultObject, null, schemaVar, null, MHL1044Fields, overrideMHL1044Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.herpForm) {
        initForm(setForm, defaultObject, null, schemaVar, null, MHL1045Fields, overrideMHL1045Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.subarcticForm) {
        initForm(setForm, defaultObject, null, schemaVar, null, MHL1046Fields, overrideMHL1046Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.macrolichenForm) {
        initForm(setForm, defaultObject, null, schemaVar, null, MHL1047Fields, overrideMHL1047Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.bracketFungiForm) {
        initForm(setForm, defaultObject, null, schemaVar, null, MHL1048Fields, overrideMHL1048Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.practicalFungiForm) {
        initForm(setForm, defaultObject, null, schemaVar, null, MHL1062Fields, overrideMHL1062Fields, null, null, lang, scrollViewRef)
      }
    }
  }

  //as autocomplete field is the only possible validation error, scroll to top when validation error occurs
  const onError = async () => {
    scrollViewRef?.current?.scrollToPosition(0, 0, false)
  }

  const onSubmit = async (data: { [key: string]: any }) => {
    if (!observationState) {
      createNewObservation(data)
    } else {
      updateObservation(data)
    }
  }

  const createNewObservation = async (data: { [key: string]: any }) => {
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
      if (data[key] === undefined || data[key] === null) {
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

    //add the new observation to latest event, clear location
    //and redirect to map after user oks message
    try {
      await dispatch(newObservation(newUnit, pathToLineStringConstructor(path)))
      dispatch(clearObservationLocation())
      setSaving(false)
      if (editing.originalSourcePage === 'map') {
        props.toMap()
      } else if (editing.originalSourcePage === 'list') {
        props.toList()
      }
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
      if ((data[key] === undefined || data[key] === null) && key !== 'atlasCode') {
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

    //replace original observation with edited one
    try {
      await dispatch(replaceObservationById(editedUnit, observationId?.eventId, observationId?.unitId))
      dispatch(clearObservationLocation())
      dispatch(clearObservationId())
      if (editing.originalSourcePage === 'map') {
        props.toMap()
      } else if (editing.originalSourcePage === 'overview') {
        props.toObservationEvent(observationId?.eventId)
      } else if (editing.originalSourcePage === 'list') {
        props.toList()
      }

      dispatch(setEditing({
        started: false,
        locChanged: false,
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

  //redirects navigator to map for selection of new observation location
  const editObservationLocation = () => {
    if (observationState) {
      dispatch(setObservationLocation(observationState.unitGathering.geometry))
      dispatch(setEditing({
        started: true,
        locChanged: false,
        originalSourcePage: editing.originalSourcePage
      }))
      props.pushToMap()
    }
  }

  const showCancel = () => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('discard observation?'),
      cancelLabel: t('cancel'),
      okLabel: t('exit'),
      onOk: () => {
        cleanUp()
        if (editing.originalSourcePage === 'map') {
          props.toMap()
        } else if (editing.originalSourcePage === 'overview') {
          if (!observationId) { return }
          props.toObservationEvent(observationId?.eventId)
        } else if (editing.originalSourcePage === 'list') {
          props.toList()
        }
      }
    }))
  }

  const showDelete = () => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('remove observation?'),
      onOk: async () => await handleDelete(),
      okLabel: t('delete')
    }))
  }

  const handleDelete = async () => {

    if (!observationId) { return }

    setSaving(true)
    try {
      if (!observationState?.id.includes('complete_list')) {
        await dispatch(deleteObservation(observationId?.eventId, observationId?.unitId))
        dispatch(clearObservationId())
        dispatch(clearObservationLocation())

        //instead of deleting a complete list observation, just reset the fields
      } else {
        let emptyObservation = omit(observationState, 'atlasCode')
        emptyObservation = omit(emptyObservation, 'count')
        emptyObservation = omit(emptyObservation, 'notes')
        emptyObservation = omit(emptyObservation, 'images')
        try {
          await dispatch(replaceObservationById(emptyObservation, observationId?.eventId, observationId?.unitId))
        } catch (error: any) {
          dispatch(setMessageState({
            type: 'err',
            messageContent: error.message
          }))
        }
        dispatch(clearObservationId())
      }

      if (editing.originalSourcePage === 'map') {
        props.toMap()
      } else if (editing.originalSourcePage === 'overview') {
        props.toObservationEvent(observationId?.eventId)
      } else if (editing.originalSourcePage === 'list') {
        props.toList()
      }
      dispatch(setEditing({
        started: false,
        locChanged: false,
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

  if (saving) {
    return (
      <LoadingComponent text={'saving'} />
    )
  } if (!form) {
    onUninitializedForm()
    return (
      <LoadingComponent text={'loading'} />
    )
  } else {
    return (
      <View style={Cs.formContainer}>
        <View style={Cs.formSaveButtonContainer}>
          <TouchableOpacity onPress={methods.handleSubmit(onSubmit, onError)} testID={'saveButton'}>
            <Icon reverse color={Colors.successButton1} name='done' type='material-icons' raised size={30} />
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView style={Cs.padding10Container} keyboardShouldPersistTaps='always' ref={scrollViewRef}>
          <View style={Cs.buttonContainer}>
            <ButtonComponent onPressFunction={() => showCancel()}
              title={t('cancel')} height={40} width={150} buttonStyle={Bs.editObservationButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'close'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
          </View>
          {observationId
            && !((schema.formID === forms.birdAtlas || Object.values(biomonForms).includes(schema.formID))
              && observationState?.id.includes('complete_list')) ?
            <View style={Cs.buttonContainer}>
              <ButtonComponent onPressFunction={() => editObservationLocation()}
                title={t('edit location')} height={40} width={150} buttonStyle={Bs.editObservationButton}
                gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={'edit-location'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
              />
            </View>
            : null
          }
          {observationId
            && !(schema.formID === forms.birdAtlas && !observationState?.atlasCode && !observationState?.count)
            && !(Object.values(biomonForms).includes(schema.formID) && !observationState?.count) ?
            <View style={Cs.buttonContainer}>
              <ButtonComponent onPressFunction={() => showDelete()}
                title={t('delete')} height={40} width={150} buttonStyle={Bs.editObservationButton}
                gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={'delete'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
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
        {props.children}
        <MessageComponent />
      </View>
    )
  }
}

export default ObservationComponent