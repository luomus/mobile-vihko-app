import React, { useState, useEffect } from 'react'
import { View, Text, Switch } from 'react-native'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

interface Props {
  title: string,
  objectTitle: string,
  defaultValue: boolean,
  register: Function,
  setValue: Function,
  watch: Function,
  errors: Object,
  unregister: Function,
}

const FormPickerComponent = (props: Props) => {
  const [selected, setSelected] = useState(props.defaultValue)

  useEffect(() => {
    props.setValue(props.objectTitle, props.defaultValue)
  }, [])

  return (
    <View style={Cs.containerWithJustPadding}>
      <Text>{props.title}</Text>
      <View style={Cs.switchContainer}>
        <Switch
          style={{ padding: 5 }}
          ref={props.register({ name: props.objectTitle })}
          value={selected}
          onValueChange={() => {
            setSelected(!selected)
            props.setValue(props.objectTitle, selected)
          }}
          trackColor={{
            false: Colors.negativeColor,
            true: Colors.positiveColor }}>
        </Switch>
        {props.setValue(props.objectTitle, selected)}
      </View>
    </View>
  )
}

export default FormPickerComponent