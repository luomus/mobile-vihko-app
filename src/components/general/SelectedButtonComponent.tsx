import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Colors from '../../styles/Colors'
// @ts-ignore
import InsetShadow from 'react-native-inset-shadow'

type Props = {
  onPress: () => void,
  title: string
}

const SelectedButtonComponent = (props: Props) => {
  return (
    <TouchableOpacity
      onPress={() => { props.onPress() }} activeOpacity={0.8}
      style={{ height: 40, width: 80, borderRadius: 5, backgroundColor: Colors.neutral3 }}>
      <InsetShadow shadowRadius={5} shadowOffset={5} shadowOpacity={0.9} containerStyle={{ borderRadius: 5, alignItems: 'center' }}>
        <Text style={{ color: Colors.darkText, padding: 8, fontSize: 15, }}>{props.title}</Text>
      </InsetShadow>
    </TouchableOpacity>
  )
}

export default SelectedButtonComponent