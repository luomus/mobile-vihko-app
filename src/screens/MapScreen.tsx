import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ParamListBase } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import MapComponent from '../components/map/MapComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>
}

const MapScreen = (props: Props) => {

  const { navigate, replace } = props.navigation
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['right', 'bottom', 'left']}>
      <MapComponent
        onPressHome={() => replace('home')}
        onPressObservation={(rules?: Record<string, any>, defaults?: Record<string, any>, sourcePage?: string) =>
          navigate('observation', { rules, defaults, sourcePage })}
        onPressEditing={(sourcePage?: string) => navigate('observation', { sourcePage })}
        onPressFinishObservationEvent={(sourcePage: string) => {
          props.navigation.navigate('document', { sourcePage })
        }}
        onPressSingleObservation={(rules?: Record<string, any>, defaults?: Record<string, any>, sourcePage?: string) =>
          navigate('singleObservation', { rules, defaults, sourcePage })}
        onPressList={() => navigate('list')}
      />
    </SafeAreaView>
  )
}

export default MapScreen
