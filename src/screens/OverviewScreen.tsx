import React from 'react'
import { CommonActions, ParamListBase, Route } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import OverviewComponent from '../components/overview/OverviewComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>,
  route: Route<string>
}

const OverviewScreen = (props: Props) => {

  const { dispatch, isFocused } = props.navigation
  const { id } = props.route.params

  return (
    <OverviewComponent
      id={id}
      onPressHome={() => { props.navigation.navigate('home') }}
      onPressObservation={(sourcePage?: string) => { props.navigation.navigate('observation', { sourcePage }) }}
      onPressObservationEvent={(sourcePage?: string) => { props.navigation.navigate('document', { sourcePage }) }}
      onLogout={() => {
        dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'login' }]
          })
        )
      }}
      isFocused={() => isFocused()}
    />
  )
}

export default OverviewScreen