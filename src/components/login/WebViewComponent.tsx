import React from 'react'
import WebView from 'react-native-webview'
import { useBackHandler } from '@react-native-community/hooks'

type Props = {
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

export default WebViewComponent