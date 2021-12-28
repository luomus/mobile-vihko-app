import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
// @ts-ignore
import InsetShadow from 'react-native-inset-shadow'

type Props = {
  onPress: () => void,
  title: string,
  color: string,
  textColor: string
}

const SelectedButtonComponent = (props: Props) => {
  return (
    <TouchableOpacity
      onPress={() => { props.onPress() }} activeOpacity={0.8}
      style={{ height: 40, width: 80, borderRadius: 5, backgroundColor: props.color }}>
      <InsetShadow shadowRadius={5} shadowOffset={5} shadowOpacity={0.9} containerStyle={{ borderRadius: 5, alignItems: 'center' }}>
        <Text style={{ color: props.textColor, padding: 8, fontSize: 15, }}>{props.title}</Text>
      </InsetShadow>
    </TouchableOpacity>
  )
}

export default SelectedButtonComponent