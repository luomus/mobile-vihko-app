import React, { useState, useEffect } from 'react'
import { View, Text, Switch } from 'react-native'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'
import { useFormContext } from 'react-hook-form'

interface Props {
  title: string,
  objectTitle: string,
  defaultValue: boolean,
}

const FormSwitchComponent = (props: Props) => {
  const { register, setValue } = useFormContext()
  const [selected, setSelected] = useState(props.defaultValue)

  useEffect(() => {
    register(props.objectTitle)
    setValue(props.objectTitle, props.defaultValue)
  }, [])

  return (
    <View style={Cs.padding10Container}>
      <Text>{props.title}</Text>
      <View style={Cs.switchContainer}>
        <Switch
          style={Cs.padding5Container}
          value={selected}
          onValueChange={() => {
            setSelected(!selected)
            setValue(props.objectTitle, selected)
          }}
          thumbColor={
            Colors.neutralButton
          }
          trackColor={{
            false: Colors.dangerButton1,
            true: Colors.primary5
          }}>
        </Switch>
        {setValue(props.objectTitle, selected)}
      </View>
    </View>
  )
}

export default FormSwitchComponent