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
  const { rules, defaults, sourcePage } = props.route.params

  return (
    <ObservationComponent
      toObservationEvent={(id: string) => navigate('overview', { id })}
      toMap={() => navigate('map')}
      toList={() => navigate('list')}
      pushToMap={() => push('map')}
      rules={rules}
      defaults={defaults}
      sourcePage={sourcePage}
      isFocused={isFocused}
      goBack={() => props.navigation.goBack()}
    />
  )
}

export default ObservationScreen