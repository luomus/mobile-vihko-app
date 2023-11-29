import React, { ReactChild } from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { useTranslation } from 'react-i18next'
import MessageComponent from './MessageComponent'
import { Icon } from 'react-native-elements'
type Props = {
  text: string,
  completed?: boolean,
  children?: ReactChild
}

const LoadingComponent = (props: Props) => {
  const { t } = useTranslation()

  return (
    <View style={Cs.loadingContainer}>
      {props.completed
        ? <Icon iconStyle={{ padding: 5, color: Colors.successButton1 }} name='done' type='material-icons' size={40} />
        : <ActivityIndicator size='large' color={Colors.primary5} />
      }
      <Text style={Ts.loginText}>{t(props.text)}</Text>
      {
        props.children ? props.children : null
      }
      <MessageComponent />
    </View>
  )
}

export default LoadingComponent