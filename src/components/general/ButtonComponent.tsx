import React from 'react'
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient'
import Bs from '../../styles/ButtonStyles'

type Props = {
  onPressFunction: () => any,
  disabled?: boolean | undefined,
  title: string | undefined,
  height: number | undefined,
  width: string | number | undefined,
  buttonStyle: StyleProp<ViewStyle>,
  gradientColorStart: string,
  gradientColorEnd: string,
  shadowColor: string,
  textStyle: StyleProp<TextStyle>,
  textWidth?: number,
  iconName: string | undefined,
  iconType: string | undefined,
  iconSize: number | undefined,
  contentColor: string,
  noMargin?: boolean,
  testID?: string,
}

const ButtonComponent = (props: Props) => {
  return (
    <View>
      <TouchableOpacity onPress={props.onPressFunction} disabled={props.disabled} activeOpacity={0.8} testID={props.testID}
        style={[
          Bs.buttonShadow,
          { shadowColor: props.shadowColor },
          props.noMargin ? null : { margin: 5 }
        ]}>
        <LinearGradient start={{ x: 0.0, y: 0.0 }} end={{ x: 1.0, y: 1.0 }}
          colors={[props.gradientColorStart, props.gradientColorEnd]}
          style={[props.buttonStyle, { width: props.width, height: props.height }]}>
          {props.iconName ?
            <Icon name={props.iconName} type={props.iconType} color={props.contentColor} size={props.iconSize}
              containerStyle={{ marginTop: 5 }} />
            : null
          }
          <Text style={[props.textStyle, { color: props.contentColor }, { width: props.textWidth }]} numberOfLines={1}>{props.title ? ' ' + props.title : ''}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}

export default ButtonComponent