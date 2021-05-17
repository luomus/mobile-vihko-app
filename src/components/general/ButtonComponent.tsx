import React from 'react'
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import { Icon } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient'
import { BoxShadow } from 'react-native-shadow'

type Props = {
  onPressFunction: () => any,
  title: string | undefined,
  height: number,
  width: number,
  buttonStyle: StyleProp<ViewStyle>,
  gradientColorStart: string,
  gradientColorEnd: string,
  shadowColor: string,
  textStyle: StyleProp<TextStyle>,
  iconName: string | undefined,
  iconType: string | undefined,
  iconSize: number | undefined,
  contentColor: string
}

const ButtonComponent = (props: Props) => {

  const shadowOptions = {
    height: props.height,
    width: props.width,
    border: 0,
    color: props.shadowColor,
    radius: 5,
    opacity: 0.2,
    x: 0,
    y: 3
  }

  return (
    <BoxShadow setting={shadowOptions}>
      <TouchableOpacity onPress={props.onPressFunction}>
        <LinearGradient start={{ x: 0.0, y: 0.0 }} end={{ x: 1.0, y: 1.0 }}
          colors={[props.gradientColorStart, props.gradientColorEnd]} style={[ props.buttonStyle, { width: props.width, height: props.height } ]}>
          { props.iconName ?
            <Icon name={ props.iconName } type={ props.iconType } color={ props.contentColor } size={ props.iconSize } containerStyle={{ marginTop: 5 }} />
            : null
          }
          <Text style={[ props.textStyle, { color: props.contentColor } ]}>{props.title ? ' ' + props.title : ''}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </BoxShadow>
  )
}

export default ButtonComponent