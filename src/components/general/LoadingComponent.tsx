import React from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { useTranslation } from 'react-i18next'
import MessageComponent from './MessageComponent'
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
type Props = {
  text: string,
  completed?: boolean,
  children?: JSX.Element | JSX.Element[]
}

const LoadingComponent = (props: Props) => {
  const { t } = useTranslation()

  return (
    <View style={Cs.loadingContainer}>
      {props.completed
        ? <MaterialDesignIcons style={{ padding: 5, color: Colors.successButton1 }} name='check' size={40} />
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