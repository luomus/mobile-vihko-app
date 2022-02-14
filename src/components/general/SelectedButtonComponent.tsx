import React from 'react'
import { StyleProp, Text, TextStyle, TouchableOpacity } from 'react-native'
// @ts-ignore
import InsetShadow from 'react-native-inset-shadow'

type Props = {
  onPress: () => void,
  title: string,
  height: number,
  width: number,
  color: string,
  textStyle: StyleProp<TextStyle>,
  textColor: string
}

const SelectedButtonComponent = (props: Props) => {
  return (
    <TouchableOpacity
      onPress={() => { props.onPress() }} activeOpacity={0.8}
      style={{ width: props.width, height: props.height, borderRadius: 5, backgroundColor: props.color }}>
      <InsetShadow shadowRadius={5} shadowOffset={5} shadowOpacity={0.9} containerStyle={{ borderRadius: 5, alignItems: 'center' }}>
        <Text style={props.textStyle}>{props.title}</Text>
      </InsetShadow>
    </TouchableOpacity>
  )
}

export default SelectedButtonComponent