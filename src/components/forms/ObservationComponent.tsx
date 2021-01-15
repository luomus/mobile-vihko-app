import React, { useState, useEffect, ReactChild } from 'react'
import { View, ScrollView } from 'react-native'
<<<<<<< HEAD
import { useBackHandler } from '@react-native-community/hooks'
=======
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
import { useForm } from 'react-hook-form'
import { connect, ConnectedProps } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Point } from 'geojson'
import { LocationObject } from 'expo-location'
<<<<<<< HEAD
import {
  replaceObservationEvents, newObservation, clearObservationLocation, replaceObservationById, clearObservationId,
  deleteObservation, setObservationLocation
} from '../../stores/observation/actions'
=======
import { replaceObservationEvents, newObservation, clearObservationLocation, replaceObservationById, clearObservationId, setObservationLocation } from '../../stores/observation/actions'
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
import { setMessageState, clearMessageState } from '../../stores/message/actions'
import MessageComponent from '../general/MessageComponent'
import Cs from '../../styles/ContainerStyles'
import { ObservationEventType, SchemaType } from '../../stores/observation/types'
import { initForm } from '../../forms/formMethods'
import { set, clone } from 'lodash'
import uuid from 'react-native-uuid'
import i18n from '../../language/i18n'
import ActivityComponent from '../general/ActivityComponent'
import { Button as ButtonElement, Icon } from 'react-native-elements'
import { setEditing } from '../../stores/map/actions'
import { EditingType } from '../../stores/map/types'
import { lineStringConstructor } from '../../converters/geoJSONConverters'
import FloatingIconButtonComponent from './FloatingIconButtonComponent'
import { JX519Fields, overrideJX519Fields, JX652Fields, overrideJX652Fields } from '../../config/fields'
<<<<<<< HEAD
import Colors from '../../styles/Colors'
=======
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17

interface RootState {
  observation: Point,
  observationEvent: ObservationEventType,
  observationId: Record<string, any>,
  observationLocations: Point[],
  editing: EditingType,
  schema: SchemaType,
  path: LocationObject[]
}

const mapStateToProps = (state: RootState) => {
  const { observation, observationEvent, observationId, observationLocations, editing, schema, path } = state
  return { observation, observationEvent, observationLocations, observationId, editing, schema, path }
}

const mapDispatchToProps = {
  newObservation,
  replaceObservationEvents,
  clearObservationLocation,
  setMessageState,
  clearMessageState,
  replaceObservationById,
  clearObservationId,
  setEditing,
<<<<<<< HEAD
  deleteObservation,
  setObservationLocation
=======
  setObservationLocation,
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  toObservationEvent: (id: string) => void,
  toMap: () => void,
  isNew?: boolean,
  rules?: Record<string, any>,
  defaults?: Record<string, any>,
  fromMap?: boolean,
<<<<<<< HEAD
  sourcePage?: string,
  children?: ReactChild,
  isFocused: () => boolean
=======
  children?: ReactChild
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
}

const ObservationComponent = (props: Props) => {

  //for react-hook-form
  const { handleSubmit, setValue, unregister, errors, watch, register } = useForm()
  const { t } = useTranslation()
  const [saving, setSaving] = useState<boolean>(false)
  const lang = i18n.language
  const [form, setForm] = useState<Array<Element | undefined> | null>(null)
  const [observation, setObservation] = useState<Record<string, any> | undefined>(undefined)

  useEffect(() => {
<<<<<<< HEAD
    console.log('useeffect ', props.fromMap, ' ', props.editing, ' ', props.observationId, ' ', props.sourcePage)
=======
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
    //initialize only when editing observations
    if (props.observationId) {
      init()
    }

<<<<<<< HEAD
    //checks if we are coming from MapComponent or ObservationEventComponent
    if (props.sourcePage && !props.editing.started) {
      props.setEditing({
        started: false,
        locChanged: false,
        originalSourcePage: props.sourcePage
      })
    }
  }, [])

  useBackHandler(() => {
    if (props.isFocused()) {
      cleanUp()
      return true
    }

    return false
  })

=======
    //cleanup when component unmounts, ensures that if navigator back-button
    //is used observationLocation, observationId and editing-flags are returned 
    //to defaults
    return () => {
      if (!props.fromMap) {
        props.clearObservationLocation()
        props.setEditing({
          started: false,
          locChanged: false
        })
      }
      props.clearObservationId()
    }
  }, [])

>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
  //initialization (only for editing observations)
  const init = () => {
    //clone events from reducer for modification
    const searchedEvent = props.observationEvent.events.find(event => {
      return event.id === props.observationId.eventId
    })

    if (!searchedEvent) {
      return
    }

    //find the correct observation by id
    const searchedObservation = clone(
      searchedEvent.gatherings[0].units.find((observation: Record<string, any>) => {
        return observation.id === props.observationId.unitId
      })
    )

    if (!searchedObservation) {
      return
    }

    setObservation(searchedObservation)
  }

  const onUninitializedForm = () => {
    //if editing observation but observation not yet extracted from observation event
    if (props.observationId && !observation) {
      return
    }

    let schema = props.schema[lang]?.schema?.properties?.gatherings?.items?.properties?.units || null
    let fieldScopes = props.schema[lang]?.schema?.uiSchemaParams?.unitFieldScopes || null
    let defaultObject: Record<string, any> = {}

    if (props.defaults) {
      Object.keys(props.defaults).forEach(key => {
        set(defaultObject, key.split('_'), props.defaults?.[key])
      })
    }

    set(defaultObject, ['unitGathering', 'geometry'], props.observation)

    //edit observations
    if (props.observationId) {
      //flying squirrel edit observation
      if (observation?.rules) {
        initForm(setForm, observation, observation.rules, register, setValue, watch, errors, unregister, schema, fieldScopes, null, null, lang)
        //trip form new observation
      } else if (props.schema.formID === 'JX.519') {
        initForm(setForm, observation, null, register, setValue, watch, errors, unregister, schema, null, JX519Fields, overrideJX519Fields, lang)
      } else if (props.schema.formID === 'JX.652') {
        initForm(setForm, observation, null, register, setValue, watch, errors, unregister, schema, null, JX652Fields, overrideJX652Fields, lang)
      }
      //new observations
    } else {
      //flying squirrel new observation
      if (props.rules) {
        initForm(setForm, defaultObject, props.rules, register, setValue, watch, errors, unregister, schema, fieldScopes, null, null, lang)
        //trip form edit observation
      } else if (props.schema.formID === 'JX.519') {
        initForm(setForm, defaultObject, null, register, setValue, watch, errors, unregister, schema, null, JX519Fields, overrideJX519Fields, lang)
      } else if (props.schema.formID === 'JX.652') {
        initForm(setForm, defaultObject, null, register, setValue, watch, errors, unregister, schema, null, JX652Fields, overrideJX652Fields, lang)
      }
    }
  }

  const onSubmit = async (data: { [key: string]: any }) => {
    if (!observation) {
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
    let color = props.schema[lang].uiSchemaParams?.unitColors?.find((unitColor: Record<string, any>) => {
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
      await props.newObservation(newUnit, lineStringConstructor(props.path))
      props.clearObservationLocation()
      setSaving(false)
      props.toMap()
    } catch (error) {
      setSaving(false)
      props.setMessageState({
        type: 'err',
        messageContent: error.message
      })
    }
  }

  const updateObservation = async (data: { [key: string]: any }) => {
    setSaving(true)

    if (!observation) {
      setSaving(false)
      return
    }

    //construct new observation (unit) from old observation, data and new location if present from form and images
    let editedUnit = {}

    Object.keys(data).forEach(key => {
      set(editedUnit, key.split('_'), data[key])
    })

    //if editing-flag 1st and 2nd elements are true replace location with new location, and clear editing-flag
    if (props.editing.started && props.editing.locChanged) {
      props.observation ? set(editedUnit, ['unitGathering', 'geometry'], props.observation) : null
      props.clearObservationLocation()
      props.setEditing({
        started: false,
<<<<<<< HEAD
        locChanged: false,
        originalSourcePage: props.editing.originalSourcePage
=======
        locChanged: false
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
      })
    }

    editedUnit = {
      ...observation,
      ...editedUnit,
    }

    //replace original observation with edited one
    try {
      await props.replaceObservationById(editedUnit, props.observationId.eventId, props.observationId.unitId)
      props.clearObservationId()
<<<<<<< HEAD

      if (props.editing.originalSourcePage === 'MapComponent') {
        props.toMap()
      } else if (props.editing.originalSourcePage === 'ObservationEventComponent') {
        props.toObservationEvent(props.observationId.eventId)
      }

      props.setEditing({
        started: false,
        locChanged: false,
        originalSourcePage: ''
      })

      props.clearObservationId()

=======
      props.fromMap ? props.toMap() : props.toObservationEvent(props.observationId.eventId)
      setSaving(false)
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
    } catch (error) {
      props.setMessageState({
        type: 'err',
        messageContent: error.message
      })
<<<<<<< HEAD
    } finally {
=======
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
      setSaving(false)
    }
  }

  //redirects navigator to map for selection of new observation location
  const handleChangeToMap = () => {
    if (observation) {
      props.setObservationLocation(observation.unitGathering.geometry)
      props.setEditing({
        started: true,
<<<<<<< HEAD
        locChanged: false,
        originalSourcePage: props.editing.originalSourcePage
=======
        locChanged: false
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
      })
      props.toMap()
    }
  }

<<<<<<< HEAD
  const handleRemove = async () => {
    setSaving(true)
    try {
      await props.deleteObservation(props.observationId.eventId, props.observationId.unitId)
      props.clearObservationId()

      if (props.editing.originalSourcePage === 'MapComponent') {
        props.toMap()
      } else if (props.editing.originalSourcePage === 'ObservationEventComponent') {
        props.toObservationEvent(props.observationId.eventId)
      }
      props.setEditing({
        started: false,
        locChanged: false,
        originalSourcePage: ''
      })
    } catch (error) {
      props.setMessageState({
        type: 'err',
        messageContent: error.message
      })
    } finally {
      setSaving(false)
    }
  }

  const cleanUp = () => {
    //cleanup when component unmounts, ensures that if navigator back-button
    //is used observationLocation, observationId and editing-flags are returned
    //to defaults
    console.log('cleanup', props.fromMap)
    props.clearObservationLocation()
    props.setEditing({
      started: false,
      locChanged: false,
      originalSourcePage: props.editing.originalSourcePage
    })
    props.clearObservationId()
  }

=======
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
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
<<<<<<< HEAD
          {props.observationId ?
=======
          {(!props.fromMap && props.observationId) ?
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
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
<<<<<<< HEAD
          {props.observationId ?
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
=======
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
          <View style={Cs.formContainer}>
            {form}
          </View>
        </ScrollView>
        {props.children}
        <MessageComponent />
        <View style={Cs.formSaveButtonContainer}>
          <FloatingIconButtonComponent onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    )
  }
}

export default connector(ObservationComponent)