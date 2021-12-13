import React from 'react'
import { View, Text } from 'react-native'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'

interface Props {
  title: string,
  value: string,
}

const SchemaObjectComponent = (props: Props) => {
  return (
    <View style={Cs.observationListElementTextContainer}>
      <View style={Cs.observationListElementTitlesContainer}>
        <Text style={Ts.boldText}>{props.title}</Text>
      </View>
      <View style={Cs.observationListElementValuesContainer}>
        <Text>{props.value}</Text>
      </View>
    </View>
  )
}

export default SchemaObjectComponent