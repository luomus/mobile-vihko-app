import React from 'react'
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
    <DocumentComponent
      toHome={() => {
        props.navigation.popTo('home')
      }}
      toObservationEvent={(id: string) => {
        props.navigation.popTo('overview', { id })
      }}
      toMap={() => {
        props.navigation.popTo('map')
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
  )
}

export default DocumentScreen