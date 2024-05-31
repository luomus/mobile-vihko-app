import React from 'react'
import { StyleProp, Text, TextStyle, TouchableOpacity } from 'react-native'

type Props = {
  onPress: () => void,
  title: string,
  height: number,
  width?: number,
  color: string,
  textStyle: StyleProp<TextStyle>,
  textColor: string,
  noMargin?: boolean
}

const SelectedButtonComponent = (props: Props) => {
  return (
    <TouchableOpacity
      onPress={() => { props.onPress() }} activeOpacity={0.8}
      style={[
        { height: props.height, width: props.width, backgroundColor: props.color, borderRadius: 5, paddingTop: 4 },
        props.noMargin ? null : { margin: 5 }
      ]}
    >
      <Text style={[props.textStyle, { color: props.textColor }]}>{props.title}</Text>
    </TouchableOpacity>
  )
}

export default SelectedButtonComponent