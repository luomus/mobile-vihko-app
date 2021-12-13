import React from 'react'
import { CommonActions, ParamListBase, Route } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import DocumentComponent from '../components/forms/DocumentComponent'

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string>,
  route: Route<string>
}

const DocumentScreen = (props: Props) => {

  const { dispatch, isFocused } = props.navigation
  const { sourcePage } = props.route.params

  return (
    <DocumentComponent
      onPressSubmit={() => {
        props.navigation.navigate('home')
      }}
      onPressObservationEvent={(id: string) => {
        props.navigation.navigate('overview', { id })
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