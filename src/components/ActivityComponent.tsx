import React from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import Cs from '../styles/ContainerStyles'
import Ts from '../styles/TextStyles'
import Colors from '../styles/Colors'
import { useTranslation } from 'react-i18next'
import MessageComponent from './MessageComponent'
type Props = {
  text: string
}

const ActivityComponent = (props: Props) => {
  const { t } = useTranslation()

  return (
    <View style={Cs.loadingContainer}>
      <ActivityIndicator size='large' color={Colors.neutralColor}/>
      <Text style={Ts.loginText}>{t(props.text)}</Text>
      <MessageComponent/>
    </View>
  )
}

export default ActivityComponent