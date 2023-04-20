import React, { ReactChild } from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { useTranslation } from 'react-i18next'
import MessageComponent from './MessageComponent'
type Props = {
  text: string,
  children?: ReactChild
}

const LoadingComponent = (props: Props) => {
  const { t } = useTranslation()

  return (
    <View style={Cs.loadingContainer}>
      <ActivityIndicator size='large' color={Colors.primary5}/>
      <Text style={Ts.loginText}>{t(props.text)}</Text>
      {
        props.children ? props.children : null
      }
      <MessageComponent/>
    </View>
  )
}

export default LoadingComponent