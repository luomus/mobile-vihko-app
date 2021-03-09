import React, { useState, useEffect, ReactChild } from 'react'
import { View, ScrollView } from 'react-native'
import { useBackHandler } from '@react-native-community/hooks'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  rootState,
  newObservation,
  clearObservationLocation,
  replaceObservationById,
  clearObservationId,
  deleteObservation,
  setObservationLocation,
  setMessageState,
  setEditing
} from '../../stores'
import MessageComponent from '../general/MessageComponent'
import Cs from '../../styles/ContainerStyles'
import { initForm } from '../../forms/formMethods'
import { set, clone } from 'lodash'
import uuid from 'react-native-uuid'
import i18n from '../../languages/i18n'
import ActivityComponent from '../general/ActivityComponent'
import { Button as ButtonElement, Icon } from 'react-native-elements'
import { lineStringConstructor } from '../../helpers/geoJSONHelper'
import FloatingIconButtonComponent from './FloatingIconButtonComponent'
import { JX519Fields, overrideJX519Fields, JX652Fields, overrideJX652Fields, additionalJX519Fields } from '../../config/fields'
import Colors from '../../styles/Colors'

type Props = {
  toObservationEvent: (id: string) => void,
  toMap: () => void,
  isNew?: boolean,
  rules?: Record<string, any>,
  defaults?: Record<string, any>,
  fromMap?: boolean,
  sourcePage?: string,
  children?: ReactChild,
  isFocused: () => boolean,
  goBack: (routeKey?: string | null | undefined) => boolean
}

const ObservationComponent = (props: Props) => {

  //for react-hook-form
  const methods = useForm()
  const { t } = useTranslation()
  const [saving, setSaving] = useState<boolean>(false)
  const lang = i18n.language
  const [form, setForm] = useState<Array<Element | undefined> | null>(null)
  const [observationState, setObservationState] = useState<Record<string, any> | undefined>(undefined)

  const editing = useSelector((state: rootState) => state.editing)
  const observation = useSelector((state: rootState) => state.observation)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const observationId = useSelector((state: rootState) => state.observationId)
  const path = useSelector((state: rootState) => state.path)
  const schema = useSelector((state: rootState) => state.schema)

  const dispatch = useDispatch()

  useEffect(() => {
    //initialize only when editing observations
    if (observationId) {
      init()
    }

    //checks if we are coming from MapComponent or ObservationEventComponent
    if (props.sourcePage && !editing.started) {
      dispatch(setEditing({
        started: false,
        locChanged: false,
        originalSourcePage: props.sourcePage
      }))
    }
  }, [])

  useBackHandler(() => {

    if (props.isFocused()) {

      dispatch(setMessageState({
        type: 'dangerConf',
        messageContent: t('discard observation?'),
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
      return event.id === observationId.eventId
    })

    if (!searchedEvent) {
      return
    }

    //find the correct observation by id
    const searchedObservation = clone(
      searchedEvent.gatherings[0].units.find((observation: Record<string, any>) => {
        return observation.id === observationId.unitId
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

    let schemaVar = schema[lang]?.schema?.properties?.gatherings?.items?.properties?.units || null
    let fieldScopes = schema[lang]?.schema?.uiSchemaParams?.unitFieldScopes || null
    let defaultObject: Record<string, any> = {}

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
        initForm(setForm, observationState, observationState.rules, schemaVar, fieldScopes, null, null, null, lang)
        //trip form new observation
      } else if (schema.formID === 'JX.519') {
        initForm(setForm, observationState, null, schemaVar, null, JX519Fields, overrideJX519Fields, additionalJX519Fields, lang)
      } else if (schema.formID === 'JX.652') {
        initForm(setForm, observationState, null, schemaVar, null, JX652Fields, overrideJX652Fields, null, lang)
      }
      //new observations
    } else {
      //flying squirrel new observation
      if (props.rules) {
        initForm(setForm, defaultObject, props.rules, schemaVar, fieldScopes, null, null, null, lang)
        //trip form edit observation
      } else if (schema.formID === 'JX.519') {
        initForm(setForm, defaultObject, null, schemaVar, null, JX519Fields, overrideJX519Fields, additionalJX519Fields, lang)
      } else if (schema.formID === 'JX.652') {
        initForm(setForm, defaultObject, null, schemaVar, null, JX652Fields, overrideJX652Fields, null, lang)
      }
    }
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

    let newUnit: Record<string, any> = {}

    //add id and rules in use internally, destroyed before sending
    set(newUnit, 'id', `observation_${uuid.v4()}`)

    if (props.rules) {
      set(newUnit, 'rules', props.rules)
    }

    Object.keys(data).forEach(key => {
      set(newUnit, key.split('_'), data[key])
    })

    //set correct color for obseration, if available
    let color = schema[lang].uiSchemaParams?.unitColors?.find((unitColor: Record<string, any>) => {
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
      dispatch(newObservation(newUnit, lineStringConstructor(path)))
      dispatch(clearObservationLocation())
      setSaving(false)
      props.toMap()
    } catch (error) {
      setSaving(false)
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message
      }))
    }
  }

  const updateObservation = async (data: { [key: string]: any }) => {
    setSaving(true)

    if (!observationState) {
      setSaving(false)
      return
    }

    //construct new observation (unit) from old observation, data and new location if present from form and images
    let editedUnit = {}

    Object.keys(data).forEach(key => {
      set(editedUnit, key.split('_'), data[key])
    })

    //if editing-flag 1st and 2nd elements are true replace location with new location, and clear editing-flag
    if (editing.started && editing.locChanged) {
      observation ? set(editedUnit, ['unitGathering', 'geometry'], observation) : null
      dispatch(clearObservationLocation())
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

    //replace original observation with edited one
    try {
      dispatch(replaceObservationById(editedUnit, observationId.eventId, observationId.unitId))
      dispatch(clearObservationId())

      if (editing.originalSourcePage === 'MapComponent') {
        props.toMap()
      } else if (editing.originalSourcePage === 'ObservationEventComponent') {
        props.toObservationEvent(observationId.eventId)
      }

      dispatch(setEditing({
        started: false,
        locChanged: false,
        originalSourcePage: ''
      }))

      dispatch(clearObservationId())

    } catch (error) {
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message
      }))
    } finally {
      setSaving(false)
    }
  }

  //redirects navigator to map for selection of new observation location
  const handleChangeToMap = () => {
    if (observationState) {
      dispatch(setObservationLocation(observationState.unitGathering.geometry))
      dispatch(setEditing({
        started: true,
        locChanged: false,
        originalSourcePage: editing.originalSourcePage
      }))
      props.toMap()
    }
  }

  const handleRemove = async () => {
    setSaving(true)
    try {
      dispatch(deleteObservation(observationId.eventId, observationId.unitId))
      dispatch(clearObservationId())

      if (editing.originalSourcePage === 'MapComponent') {
        props.toMap()
      } else if (editing.originalSourcePage === 'ObservationEventComponent') {
        props.toObservationEvent(observationId.eventId)
      }
      dispatch(setEditing({
        started: false,
        locChanged: false,
        originalSourcePage: ''
      }))
    } catch (error) {
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
      <ActivityComponent text={'saving'} />
    )
  } if (!form) {
    onUninitializedForm()
    return (
      <ActivityComponent text={'loading'} />
    )
  } else {
    return (
      <View style={Cs.observationContainer}>
        <ScrollView keyboardShouldPersistTaps='always'>
          {observationId ?
            <View style={Cs.buttonContainer}>
              <ButtonElement
                buttonStyle={{}}
                disabled={saving}
                title={t('edit location')}
                iconRight={true}
                icon={<Icon name='edit-location' type='material-icons' color='white' size={22} />}
                onPress={() => handleChangeToMap()}
              />
            </View>
            : null
          }
          {observationId ?
            <View style={Cs.buttonContainer}>
              <ButtonElement
                buttonStyle={{ backgroundColor: Colors.negativeButton }}
                disabled={saving}
                title={t('delete')}
                iconRight={true}
                icon={<Icon name='delete' type='material-icons' color='white' size={22} />}
                onPress={() => handleRemove()}
              />
            </View>
            : null
          }
          <View style={Cs.formContainer}>
            <FormProvider {...methods}>
              {form}
            </FormProvider>
          </View>
        </ScrollView>
        {props.children}
        <MessageComponent />
        <View style={Cs.formSaveButtonContainer}>
          <FloatingIconButtonComponent onPress={methods.handleSubmit(onSubmit)} />
        </View>
      </View>
    )
  }
}

export default ObservationComponent