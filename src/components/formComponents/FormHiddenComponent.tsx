import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import Os from '../../styles/OtherStyles'

interface Props {
  objectTitle: string,
  defaultValue: string,
}

const FormHiddenComponent = (props: Props) => {
  const { register, setValue } = useFormContext()

  useEffect(() => {
    setValue(props.objectTitle, props.defaultValue)
  }, [])

  return (
    <View key={props.objectTitle} style={Os.hiddenComponent} ref={register({ name: props.objectTitle })}/>
  )
}

export default FormHiddenComponent