import React from 'react'
import { CommonActions, ParamListBase, Route } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ListComponent from '../components/forms/ListComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>,
  route: Route<string>
}

const ListScreen = (props: Props) => {

  // const { dispatch, isFocused } = props.navigation

  const { navigate } = props.navigation
  return (
    <ListComponent
      onPressMap={() => navigate('map')}
      onPressObservation={(sourcePage?: string) => { props.navigation.navigate('observation', { sourcePage }) }}
      onPressFinishObservationEvent={(sourcePage: string) => {
        props.navigation.navigate('document', { sourcePage })
      }}
    />
  )
}

export default ListScreen