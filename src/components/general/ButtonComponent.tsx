import React from 'react'
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import { Icon } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient'
import { BoxShadow } from 'react-native-shadow'
import { Shadow } from 'react-native-shadow-2'

type Props = {
  onPressFunction: () => any,
  title: string | undefined,
  height: number | string,
  width: number | string,
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

  // const shadowOptions = {
  //   height: '100%',
  //   width: '100%',
  //   border: 0,
  //   color: props.shadowColor,
  //   radius: 5,
  //   opacity: 0.2,
  //   x: 0,
  //   y: 3
  // }

  // <BoxShadow setting={shadowOptions}>
  // code
  // </BoxShadow>

  return (
    <Shadow startColor={props.shadowColor} finalColor={props.shadowColor} distance={0} radius={5}
      sides={['bottom']} offset={[0, 2]} paintInside={true}>
      <TouchableOpacity onPress={props.onPressFunction} activeOpacity={0.8}>
        <LinearGradient start={{ x: 0.0, y: 0.0 }} end={{ x: 1.0, y: 1.0 }}
          colors={[props.gradientColorStart, props.gradientColorEnd]} style={[ props.buttonStyle, { width: props.width, height: props.height } ]}>
          { props.iconName ?
            <Icon name={ props.iconName } type={ props.iconType } color={ props.contentColor } size={ props.iconSize } containerStyle={{ marginTop: 5 }} />
            : null
          }
          <Text style={[ props.textStyle, { color: props.contentColor } ]}>{props.title ? ' ' + props.title : ''}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Shadow>
  )
}

export default ButtonComponent