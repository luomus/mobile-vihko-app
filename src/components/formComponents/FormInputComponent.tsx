import React, { useState, useEffect, useRef } from 'react'
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
  defaultValue: string | number | Array<string> | undefined,
  isArrayItem: boolean,
  parentCallback: Function | undefined,
  editable: boolean
}

const FormInputComponent = (props: Props) => {

  const textInput = useRef<TextInput | null>(null)

  const [currentValue, setCurrentValue] = useState<string>(props.defaultValue ? props.defaultValue.toString() : '')

  const { register, setValue } = useFormContext()

  useEffect(() => {
    if (!props.isArrayItem) {
      initField()
    }
  }, [])

  const parseInput = (input: string) => {
    return props.keyboardType === 'numeric' ? input !== '' ? parseInt(input) : undefined : input
  }

  const initField = () => {
    register(props.objectTitle)
    setValue(props.objectTitle, parseInput(currentValue))
  }

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
          props.isArrayItem && props.parentCallback
            ? props.parentCallback({ objectTitle: props.objectTitle, value: parseInput(text) })
            : setValue(props.objectTitle, parseInput(text))
          setCurrentValue(text)
        }}
        defaultValue={currentValue}
        ref={textInput}
        multiline
        testID={props.title}
      />
    </View>
  )
}

export default FormInputComponent