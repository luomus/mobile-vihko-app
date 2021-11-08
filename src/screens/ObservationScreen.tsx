import React from 'react'
import { ParamListBase, Route } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ObservationComponent from '../components/forms/ObservationComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>,
  route: Route<string>
}

const ObservationScreen = (props: Props) => {

  const { navigate, push, isFocused } = props.navigation
  const { fromMap, rules, defaults, sourcePage } = props.route.params

  //handles situation where fromMap can purposefully be undefined
  let fromMapVar = false
  if (fromMap) {
    fromMapVar = true
  }

  return (
    <ObservationComponent
      toObservationEvent={(id: string) => navigate('overview', { id })}
      toMap={() => navigate('map')}
      pushToMap={() => push('map')}
      rules={rules}
      defaults={defaults}
      fromMap={fromMapVar}
      sourcePage={sourcePage}
      isFocused={isFocused}
      goBack={() => props.navigation.goBack()}
    />
  )
}

export default ObservationScreen