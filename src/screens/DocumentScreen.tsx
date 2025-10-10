import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CommonActions, ParamListBase, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import DocumentComponent from '../components/forms/DocumentComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>,
  route: RouteProp<{
    document: {
      sourcePage: string
    }
  }, 'document'>
}

const DocumentScreen = (props: Props) => {

  const { dispatch, isFocused } = props.navigation
  const { sourcePage } = props.route.params

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['right', 'bottom', 'left']}>
      <DocumentComponent
        toHome={() => {
          props.navigation.replace('home')
        }}
        toObservationEvent={(id: string) => {
          props.navigation.replace('overview', { id })
        }}
        toMap={() => {
          props.navigation.navigate('map')
        }}
        onLogout={() => {
          dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'login' }]
            })
          )
        }}
        sourcePage={sourcePage}
        isFocused={() => isFocused()}
      />
    </SafeAreaView>
  )
}

export default DocumentScreen