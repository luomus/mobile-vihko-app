import React from 'react'
import { CommonActions, ParamListBase, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import SingleObservationComponent from '../components/forms/SingleObservationComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>,
  route: RouteProp<{
    singleObservation: {
      rules: Record<string, any> | undefined,
      defaults: Record<string, any> | undefined,
      sourcePage: string
    }
  }, 'singleObservation'>
}

const SingleObservationScreen = (props: Props) => {

  const { dispatch, push, isFocused, popTo } = props.navigation
  const { rules, defaults, sourcePage } = props.route.params

  return (
    <SingleObservationComponent
      toObservationEvent={(id: string) => popTo('overview', { id })}
      toMap={() => popTo('map')}
      toList={() => popTo('list')}
      pushToMap={() => push('map')}
      rules={rules}
      defaults={defaults}
      sourcePage={sourcePage}
      isFocused={isFocused}
      goBack={() => props.navigation.goBack()}
      toHome={() => {
        props.navigation.popTo('home')
      }}
      onLogout={() => {
        dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'login' }]
          })
        )
      }}
    />
  )
}

export default SingleObservationScreen