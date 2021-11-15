
import React from 'react'
import { ParamListBase } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import MapComponent from '../components/map/MapComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>
}

const MapScreen = (props: Props) => {

  const { navigate } = props.navigation
  return (
    <MapComponent
      onPressHome={() => navigate('home')}
      onPressObservation={(isNew: boolean, rules: Record<string, any>, defaults: Record<string, any>) =>
        navigate('observation', { isNew, rules, defaults })}
      onPressEditing={(fromMap?: boolean, sourcePage?: string) => navigate('observation', { fromMap, sourcePage })}
      onPressFinishObservationEvent={(sourcePage: string) => {
        props.navigation.navigate('document', { sourcePage })
      }}
      onPop={() => props.navigation.goBack()}
    />
  )
}

export default MapScreen
