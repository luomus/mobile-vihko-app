import React from 'react'
import { Dimensions, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

type Props = {
  onPress: () => void
}

const FloatingIconButtonComponent = (props: Props) => {
  return (
    <TouchableOpacity style={Cs.floatingButton} onPress={props.onPress}>
      <Icon reverse color={Colors.success1} name='done' type='material-icons' raised size={Dimensions.get('screen').width * 0.075}/>
    </TouchableOpacity>
  )
}

export default FloatingIconButtonComponent