import React, { useEffect } from 'react'
import { View } from 'react-native'
import Os from '../../styles/OtherStyles'

interface Props {
  objectTitle: string,
  defaultValue: string,
  register: Function,
  setValue: Function,
}

const FormHiddenComponent = (props: Props) => {
  useEffect(() => {
    props.setValue(props.objectTitle, props.defaultValue)
  }, [])

  return (
    <View key={props.objectTitle} style={Os.hiddenComponent} ref={props.register({ name: props.objectTitle })}/>
  )
}

export default FormHiddenComponent