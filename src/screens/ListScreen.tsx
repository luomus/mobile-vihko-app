import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ParamListBase } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ListComponent from '../components/list/ListComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>
}

const ListScreen = (props: Props) => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['right', 'bottom', 'left']}>
      <ListComponent
        onPressMap={() => props.navigation.replace('map')}
        onPressObservation={(sourcePage?: string) => { props.navigation.navigate('observation', { sourcePage }) }}
        onPressFinishObservationEvent={(sourcePage: string) => {
          props.navigation.navigate('document', { sourcePage })
        }}
      />
    </SafeAreaView>
  )
}

export default ListScreen