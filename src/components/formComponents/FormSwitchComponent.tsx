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
    setValue(props.objectTitle, props.defaultValue)
  }, [])

  return (
    <View style={Cs.containerWithJustPadding}>
      <Text>{props.title}</Text>
      <View style={Cs.switchContainer}>
        <Switch
          style={{ padding: 5 }}
          ref={register({ name: props.objectTitle })}
          value={selected}
          onValueChange={() => {
            setSelected(!selected)
            setValue(props.objectTitle, selected)
          }}
          thumbColor={
            Colors.neutral
          }
          trackColor={{
            false: Colors.danger1,
            true: Colors.headerBackground
          }}>
        </Switch>
        {setValue(props.objectTitle, selected)}
      </View>
    </View>
  )
}

export default FormSwitchComponent