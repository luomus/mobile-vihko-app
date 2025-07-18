import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, View } from 'react-native'
import { useBackHandler } from '@react-native-community/hooks'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { omit } from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import {
  RootState,
  DispatchType,
  newObservation,
  clearObservationLocation,
  replaceObservationEventById,
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
  rules?: Record<string, any>,
  defaults?: Record<string, any>,
  sourcePage?: string,
  children?: JSX.Element | JSX.Element[],
  isFocused: () => boolean
}

const ObservationComponent = (props: Props) => {

  //for react-hook-form
  const methods = useForm()
  const { t } = useTranslation()
  const [saving, setSaving] = useState<boolean>(false)
  const lang = i18n.language
  const [form, setForm] = useState<Array<React.JSX.Element | undefined> | null>(null)
  const [observationState, setObservationState] = useState<Record<string, any> | undefined>(undefined)
  const [observationEventState, setObservationEventState] = useState<Record<string, any> | undefined>(undefined)

  //reference for scrollView
  const scrollViewRef = useRef<ScrollView | null>(null)

  const editing = useSelector((state: RootState) => state.editing)
  const observation = useSelector((state: RootState) => state.observation)
  const observationEvent = useSelector((state: RootState) => state.observationEvent)
  const observationId = useSelector((state: RootState) => state.observationId)
  const observationEventId = useSelector((state: RootState) => state.observationEventId)
  const schema = useSelector((state: RootState) => state.schema)

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
    if (props.sourcePage === 'map') {
      props.toMap()
    } else if (props.sourcePage === 'list') {
      props.toList()
    } else if (props.sourcePage === 'overview') {
      props.toObservationEvent(observationEventId)
    }
  }

  //initialization (only for editing observations)
  const init = () => {
    //clone events from reducer for modification
    const searchedEvent = observationEvent.events.find(event => {
      return event.id === observationEventId
    })

    if (!searchedEvent) {
      return
    }

    setObservationEventState(clone(searchedEvent))

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

  const onUninitializedForm = () => {
    //if editing observation but observation not yet extracted from observation event
    if (observationId && !observationState) {
      return
    }

    const observationSchema = schema[lang]?.schema?.properties?.gatherings?.items?.properties?.units || null
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
        initForm(setForm, observationState, null, observationSchema, null, observationState.rules, fieldScopes, null, null, null, null, lang, scrollViewRef)
        //trip form edit observation
      } else if (schema.formID === forms.tripForm) {
        initForm(setForm, observationState, null, observationSchema, null, null, null, JX519Fields, overrideJX519Fields, additionalJX519Fields, JX519FieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.birdAtlas) {
        const additionalMHL117 = observationState?.id.includes('complete_list') ? null : additionalMHL117Fields
        initForm(setForm, observationState, null, observationSchema, null, null, null, MHL117Fields, overrideMHL117Fields, additionalMHL117, MHL117FieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.fungiAtlas) {
        initForm(setForm, observationState, null, observationSchema, null, null, null, JX652Fields, overrideJX652Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.dragonflyForm) {
        initForm(setForm, observationState, null, observationSchema, null, null, null, MHL932Fields, overrideMHL932Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.butterflyForm) {
        initForm(setForm, observationState, null, observationSchema, null, null, null, MHL1040Fields, overrideMHL1040Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.largeFlowersForm) {
        initForm(setForm, observationState, null, observationSchema, null, null, null, MHL1042Fields, overrideMHL1042Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.mothForm) {
        initForm(setForm, observationState, null, observationSchema, null, null, null, MHL1043Fields, overrideMHL1043Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.bumblebeeForm) {
        initForm(setForm, observationState, null, observationSchema, null, null, null, MHL1044Fields, overrideMHL1044Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.herpForm) {
        initForm(setForm, observationState, null, observationSchema, null, null, null, MHL1045Fields, overrideMHL1045Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.subarcticForm) {
        initForm(setForm, observationState, null, observationSchema, null, null, null, MHL1046Fields, overrideMHL1046Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.macrolichenForm) {
        initForm(setForm, observationState, null, observationSchema, null, null, null, MHL1047Fields, overrideMHL1047Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.bracketFungiForm) {
        initForm(setForm, observationState, null, observationSchema, null, null, null, MHL1048Fields, overrideMHL1048Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.practicalFungiForm) {
        initForm(setForm, observationState, null, observationSchema, null, null, null, MHL1062Fields, overrideMHL1062Fields, null, null, lang, scrollViewRef)
      }

      //new observations
    } else {
      //flying squirrel new observation
      if (props.rules) {
        initForm(setForm, defaultObject, null, observationSchema, null, props.rules, fieldScopes, null, null, null, null, lang, scrollViewRef)
        //trip form new observation
      } else if (schema.formID === forms.tripForm) {
        initForm(setForm, defaultObject, null, observationSchema, null, null, null, JX519Fields, overrideJX519Fields, additionalJX519Fields, JX519FieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.birdAtlas) {
        const additionalMHL117 = observationState?.id.includes('complete_list') ? null : additionalMHL117Fields
        initForm(setForm, defaultObject, null, observationSchema, null, null, null, MHL117Fields, overrideMHL117Fields, additionalMHL117, MHL117FieldOrder, lang, scrollViewRef)
      } else if (schema.formID === forms.fungiAtlas) {
        initForm(setForm, defaultObject, null, observationSchema, null, null, null, JX652Fields, overrideJX652Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.dragonflyForm) {
        initForm(setForm, defaultObject, null, observationSchema, null, null, null, MHL932Fields, overrideMHL932Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.butterflyForm) {
        initForm(setForm, defaultObject, null, observationSchema, null, null, null, MHL1040Fields, overrideMHL1040Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.largeFlowersForm) {
        initForm(setForm, defaultObject, null, observationSchema, null, null, null, MHL1042Fields, overrideMHL1042Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.mothForm) {
        initForm(setForm, defaultObject, null, observationSchema, null, null, null, MHL1043Fields, overrideMHL1043Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.bumblebeeForm) {
        initForm(setForm, defaultObject, null, observationSchema, null, null, null, MHL1044Fields, overrideMHL1044Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.herpForm) {
        initForm(setForm, defaultObject, null, observationSchema, null, null, null, MHL1045Fields, overrideMHL1045Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.subarcticForm) {
        initForm(setForm, defaultObject, null, observationSchema, null, null, null, MHL1046Fields, overrideMHL1046Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.macrolichenForm) {
        initForm(setForm, defaultObject, null, observationSchema, null, null, null, MHL1047Fields, overrideMHL1047Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.bracketFungiForm) {
        initForm(setForm, defaultObject, null, observationSchema, null, null, null, MHL1048Fields, overrideMHL1048Fields, null, null, lang, scrollViewRef)
      } else if (schema.formID === forms.practicalFungiForm) {
        initForm(setForm, defaultObject, null, observationSchema, null, null, null, MHL1062Fields, overrideMHL1062Fields, null, null, lang, scrollViewRef)
      }
    }
  }

  //as autocomplete field is the only possible validation error, scroll to top when validation error occurs
  const onError = async () => {
    scrollViewRef?.current?.scrollTo({ x: 0, y: 0, animated: false })
  }

  const onSubmit = async (data: { [key: string]: any }) => {
    if (!observationState) {
      await createNewObservation(data)
    } else {
      await updateObservation(data)
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

    if (!(newUnit.unitGathering.geometry.coordinates[0] === observation?.coordinates[0]
      && newUnit.unitGathering.geometry.coordinates[1] === observation?.coordinates[1])) {
      newUnit.unitGathering.geometry = observation
    }

    //add the new observation to latest event, clear location
    //and redirect to map after user oks message
    try {
      await dispatch(newObservation({ unit: newUnit })).unwrap()
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
      if (observation) {
        set(editedUnit, ['unitGathering', 'geometry'], merge(get(editedUnit, ['unitGathering', 'geometry']), observation))

        if (observationEventState?.gatheringEvent?.dateEnd && observationEventState?.gatherings[0]?.geometry?.type === 'Point') {
          const observationEventCopy = {
            ...observationEventState,
            gatherings: [
              {
                ...observationEventState.gatherings[0],
                geometry: editedUnit.unitGathering.geometry
              },
              ...observationEventState.gatherings.slice(1)
            ]
          }
          try {
            await dispatch(replaceObservationEventById({ newEvent: observationEventCopy, eventId: observationEventId })).unwrap()
          } catch (error: any) {
            dispatch(setMessageState({
              type: 'err',
              messageContent: error.message
            }))
          }
        }
      }

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

    //replace original observation with edited one
    try {
      await dispatch(replaceObservationById({ newUnit: editedUnit, eventId: observationEventId, unitId: observationId })).unwrap()
      dispatch(clearObservationLocation())
      dispatch(clearObservationId())
      if (editing.originalSourcePage === 'map') {
        props.toMap()
      } else if (editing.originalSourcePage === 'overview') {
        props.toObservationEvent(observationEventId)
      } else if (editing.originalSourcePage === 'list') {
        props.toList()
      }

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

  //redirects navigator to map for selection of new observation location
  const editObservationLocation = () => {
    if (observationState) {
      dispatch(setObservationLocation(observationState.unitGathering.geometry))
      dispatch(setEditing({
        started: true,
        locChanged: false,
        originalLocation: observation ? observation : editing.originalLocation,
        originalSourcePage: editing.originalSourcePage
      }))
      props.pushToMap()
    }
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
        await dispatch(deleteObservation({ eventId: observationEventId, unitId: observationId })).unwrap()
        dispatch(clearObservationId())
        dispatch(clearObservationLocation())

        //instead of deleting a complete list observation, just reset the fields
      } else {
        let emptyObservation = omit(observationState, 'atlasCode')
        emptyObservation = omit(emptyObservation, 'count')
        emptyObservation = omit(emptyObservation, 'notes')
        emptyObservation = omit(emptyObservation, 'images')
        try {
          await dispatch(replaceObservationById({ newUnit: emptyObservation, eventId: observationEventId, unitId: observationId })).unwrap()
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
        props.toObservationEvent(observationEventId)
      } else if (editing.originalSourcePage === 'list') {
        props.toList()
      }
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
          <ButtonComponent onPressFunction={() => showCancel()}
            title={t('cancel')} height={40} width={120} buttonStyle={Bs.defaultButton}
            gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.darkText}
          />
          <ButtonComponent onPressFunction={methods.handleSubmit(onSubmit, onError)} testID={'saveButton'}
            title={t('save')} height={40} width={120} buttonStyle={Bs.defaultButton}
            gradientColorStart={Colors.successButton1} gradientColorEnd={Colors.successButton2} shadowColor={Colors.successShadow}
            textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.whiteText}
          />
        </View>
        <KeyboardAwareScrollView style={Cs.padding10Container} keyboardShouldPersistTaps='always' ref={scrollViewRef}>
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