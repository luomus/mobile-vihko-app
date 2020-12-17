import React from 'react'
import WebView from 'react-native-webview'
import { connect, ConnectedProps } from 'react-redux'
import { CredentialsType } from '../../stores/user/types'
import { useBackHandler } from '@react-native-community/hooks'


interface RootState {
  credentials: CredentialsType
}

const mapStateToProps = (state: RootState) => {
  const { credentials } = state
  return { credentials }
}

const connector = connect(
  mapStateToProps,
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  loginURL: string,
  onReturn: (loginAccepted?: boolean) => void,
  onBackPress: () => void,
}

const WebViewComponent = (props: Props) => {
  const onLoadEnd = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent

    if (nativeEvent.url.includes('app-login')) {
      props.onReturn(true)
    }
  }

  useBackHandler(() => {
    props.onBackPress()
    return true
  })

  //in case of timeout, redirect back to LoginScreen
  return (
    <WebView
      source={{ uri: `${props.loginURL}` }}
      onLoadEnd={onLoadEnd}
    />
  )
}

export default connector(WebViewComponent)