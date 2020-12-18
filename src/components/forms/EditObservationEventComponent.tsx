import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useForm } from 'react-hook-form'
import { connect, ConnectedProps } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { replaceObservationEventById, clearObservationId } from '../../stores/observation/actions'
import { setMessageState, clearMessageState } from '../../stores/message/actions'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import { set, merge, omit } from 'lodash'
import MessageComponent from '../general/MessageComponent'
import { ObservationEventType, SchemaType } from '../../stores/observation/types'
import { initForm } from '../../forms/formMethods'
import i18n from '../../language/i18n'
import ActivityComponent from '../general/ActivityComponent'
import FloatingIconButtonComponent from './FloatingIconButtonComponent'
import { JX519ObservationEventFields, JX652ObservationEventFields } from '../../config/fields'

interface BasicObject {
  [key: string]: any
}

interface RootState {
  observationEvent: ObservationEventType,
  observationId: BasicObject,
  schema: SchemaType,
}

const mapStateToProps = (state: RootState) => {
  const { observationEvent, observationId, schema } = state
  return { observationEvent, observationId, schema }
}

const mapDispatchToProps = {
  replaceObservationEventById,
  clearObservationId,
  setMessageState,
  clearMessageState,
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  onPress: (id: string) => void
}

const EditObservationEventComponent = (props: Props) => {
  //states that store the list of all event, the event that's being edited
  const [ event, setEvent ] = useState<Record<string, any> | undefined>(undefined)
  const [ form, setForm ] = useState<Array<Element | undefined>>()
  const [ saving, setSaving ] = useState<boolean>(false)
  //for react-hook-form
  const { handleSubmit, setValue, unregister, errors, watch, register } = useForm()
  const { t } = useTranslation()

  useEffect(() => {
    init()
  }, [])

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
          onOk: () => props.onPress(event.id)
        })
      } catch (error) {
        props.setMessageState({
          type: 'err',
          messageContent: error.message,
        })
      }
    }
  }

  if (saving) {
    return (
      <ActivityComponent text={'saving'}/>
    )
  } else if (!form) {
    onUninitalizedForm()
    return (
      <ActivityComponent text={'loading'}/>
    )
  } else {
    return (
      <View style={Cs.observationContainer}>
        <ScrollView>
          <Text style={Ts.speciesText}>{t('species')}: {t('flying squirrel')}</Text>
          <View style={Cs.formContainer}>
            {form}
          </View>
        </ScrollView>
        <MessageComponent/>
        <View style={Cs.formSaveButtonContainer}>
          <FloatingIconButtonComponent onPress={handleSubmit(onSubmit)}/>
        </View>
      </View>
    )
  }
}

export default connector(EditObservationEventComponent)