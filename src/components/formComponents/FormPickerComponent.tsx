import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Picker } from '@react-native-picker/picker'
import { ErrorMessage } from '@hookform/error-message'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

interface Props {
  title: string,
  objectTitle: string,
  pickerItems: Array<Object>,
  selectedValue: string | null,
  validation?: Record<string, any>
}

const FormPickerComponent = (props: Props) => {
  const { register, setValue, formState } = useFormContext()
  const [selected, setSelected] = useState(props.selectedValue)

  const { t } = useTranslation()

  useEffect(() => {
    if (props.validation) {
      register(props.objectTitle, props.validation)
    } else {
      register(props.objectTitle)
    }
    setValue(props.objectTitle, props.selectedValue)
  }, [])

  const errorMessageTranslation = (errorMessage: string): Element => {
    const errorTranslation = t(errorMessage)
    return <Text style={{ color: Colors.dangerButton2 }}>{errorTranslation}</Text>
  }

  return (
    <View style={Cs.padding10Container}>
      <Text>{props.title}</Text>
      <ErrorMessage
        errors={formState.errors}
        name={props.objectTitle}
        render={({ message }) => <Text style={{ color: Colors.dangerButton2 }}>{errorMessageTranslation(message)}</Text>}
      />
      <View style={Cs.formPickerContainer}>
        <Picker
          selectedValue={selected}
          numberOfLines={10}
          onValueChange={itemValue => {
            setSelected(itemValue)
            setValue(props.objectTitle, itemValue)
          }
          }>
          {props.pickerItems}
        </Picker>
      </View>
    </View>
  )
}

export default FormPickerComponent