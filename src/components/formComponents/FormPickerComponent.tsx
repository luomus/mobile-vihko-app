import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { View, Text } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import Cs from '../../styles/ContainerStyles'

interface Props {
  title: string,
  objectTitle: string,
  pickerItems: Array<Object>,
  selectedValue: string|null
}

const FormPickerComponent = (props: Props) => {
  const { register, setValue } = useFormContext()
  const [selected, setSelected] = useState(props.selectedValue)

  useEffect(() => {
    register(props.objectTitle)
    setValue(props.objectTitle, props.selectedValue)
  }, [])

  return (
    <View style={Cs.padding10Container}>
      <Text>{props.title}</Text>
      <View style={Cs.formPickerContainer}>
        <Picker
          selectedValue={selected}
          numberOfLines={10}
          onValueChange={itemValue => {
            setSelected(itemValue)
            setValue(props.objectTitle, itemValue)}
          }>
          {props.pickerItems}
        </Picker>
      </View>
    </View>
  )
}

export default FormPickerComponent