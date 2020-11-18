import React, { useEffect, useState } from 'react'
import { View, Text, Picker } from 'react-native'
import Cs from '../styles/ContainerStyles'

interface Props {
  title: string,
  objectTitle: string,
  pickerItems: Array<Object>,
  selectedValue: string|null,
  register: Function,
  setValue: Function,
  watch: Function,
  errors: Object,
  unregister: Function,
}

const FormPickerComponent = (props: Props) => {
  const [selected, setSelected] = useState(props.selectedValue)

  useEffect(() => {
    props.setValue(props.objectTitle, props.selectedValue)
  }, [])

  return (
    <View style={Cs.containerWithJustPadding}>
      <Text>{props.title}</Text>
      <View style={Cs.formPickerContainer}>
        <Picker
          ref={props.register({ name: props.objectTitle })}
          selectedValue={selected}
          onValueChange={itemValue => {
            setSelected(itemValue)
            props.setValue(props.objectTitle, itemValue)}
          }>
          {props.pickerItems}
        </Picker>
      </View>
    </View>
  )
}

export default FormPickerComponent