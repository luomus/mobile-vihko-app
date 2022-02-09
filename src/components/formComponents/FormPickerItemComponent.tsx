import React from 'react'
import { Picker } from '@react-native-picker/picker'

interface Props {
  key: string,
  label: string,
  value: string,
}

const FormPickerItemComponent = (props: Props) => {
  return <Picker.Item label={props.label} value={props.value} />
}

export default FormPickerItemComponent