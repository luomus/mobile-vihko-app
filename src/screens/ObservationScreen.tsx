import React from 'react'
import { ParamListBase, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ObservationComponent from '../components/forms/ObservationComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>,
  route: RouteProp<{
    observation: {
      rules: Record<string, any> | undefined,
      defaults: Record<string, any> | undefined,
      sourcePage: string
    }
  }, 'observation'>
}

const ObservationScreen = (props: Props) => {

  const { push, isFocused, popTo, replace, navigate, goBack } = props.navigation
  const { rules, defaults, sourcePage } = props.route.params

  return (
    <ObservationComponent
      toObservationEvent={(id: string) => replace('overview', { id })}
      toMap={() => navigate('map')}
      toList={() => popTo('list')}
      pushToMap={() => push('map')}
      rules={rules}
      defaults={defaults}
      sourcePage={sourcePage}
      isFocused={isFocused}
      goBack={() => goBack()}
    />
  )
}

export default ObservationScreen