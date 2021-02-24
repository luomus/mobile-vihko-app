import React, { useState, useEffect } from 'react'
import { Text, TextInput, View } from 'react-native'
import Os from '../../styles/OtherStyles'
import Cs from '../../styles/ContainerStyles'
import { useFormContext } from 'react-hook-form'

interface Props {
  title: string,
  objectTitle: string,
  parentObjectTitle: string,
  keyboardType:
    'default' |
    'email-address' |
    'numeric' |
    'phone-pad' |
    'visible-password' |
    'ascii-capable' |
    'numbers-and-punctuation' |
    'url' |
    'number-pad' |
    'name-phone-pad' |
    'decimal-pad' |
    'twitter' |
    'web-search' |
    undefined,
  defaultValue: string,
  isArrayItem: boolean,
  parentCallback: Function | undefined,
  editable: boolean,
}

const FormInputComponent = (props: Props) => {

  const [currentValue, setCurrentValue] = useState<string>(props.defaultValue)
  const { register, setValue, watch } = useFormContext()

  const addValueToArray = (value: string) => {
    const values = watch(props.parentObjectTitle)
    const index = values.indexOf(currentValue)
    if (index > -1) {
      values.splice(index, 1)
    }
    values.push(value)
    setValue(props.parentObjectTitle, values)
    setCurrentValue(value)
  }

  const typeSelector = (value: string) => {
    if (props.keyboardType === 'numeric') {
      return parseInt(value)
    } else {
      return value
    }
  }

  useEffect(() => {
    props.parentObjectTitle !== ''
      ? addValueToArray(props.defaultValue)
      : setValue(props.objectTitle, props.defaultValue)
    if (props.parentCallback !== undefined) {
      props.parentCallback({ title: props.title, value: props.defaultValue })
    }
  }, [])

  return (
    <View style={props.isArrayItem ? Cs.formArrayInputContainer : Cs.formInputContainer}>
      {!props.isArrayItem
        ? <Text>{props.title}</Text>
        : null
      }
      <TextInput
        style={Os.textInput}
        keyboardType={props.keyboardType}
        editable={props.editable}
        onChangeText={text => {
          props.parentObjectTitle !== ''
            ? addValueToArray(text)
            : setValue(props.objectTitle, typeSelector(text))
          props.parentCallback !== undefined
            ? props.parentCallback({ title: props.title, value: typeSelector(text) })
            : null
        }}
        defaultValue={props.defaultValue.toString()}
        ref={props.parentObjectTitle === ''
          ? register({ name: props.objectTitle })
          : null }
      />
    </View>
  )
}

export default FormInputComponent