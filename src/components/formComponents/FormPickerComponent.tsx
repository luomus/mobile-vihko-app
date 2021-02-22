import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { View, Text, Picker } from 'react-native'
import Cs from '../../styles/ContainerStyles'

interface Props {
  title: string,
  objectTitle: string,
  pickerItems: Array<Object>,
  selectedValue: string|null,
}

const FormPickerComponent = (props: Props) => {
  const { register, setValue } = useFormContext()
  const [selected, setSelected] = useState(props.selectedValue)

  useEffect(() => {
    setValue(props.objectTitle, props.selectedValue)
  }, [])

  return (
    <View style={Cs.containerWithJustPadding}>
      <Text>{props.title}</Text>
      <View style={Cs.formPickerContainer}>
        <Picker
          ref={register({ name: props.objectTitle })}
          selectedValue={selected}
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