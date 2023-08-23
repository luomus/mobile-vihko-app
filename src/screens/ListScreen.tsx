import React from 'react'
import { ParamListBase } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ListComponent from '../components/list/ListComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>
}

const ListScreen = (props: Props) => {

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