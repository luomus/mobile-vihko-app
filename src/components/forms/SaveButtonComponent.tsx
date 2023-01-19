import React from 'react'
import { Dimensions, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import Colors from '../../styles/Colors'

type Props = {
  onPress: () => void
}

const SaveButtonComponent = (props: Props) => {
  return (
    <TouchableOpacity onPress={props.onPress} testID={'saveButton'}>
      <Icon reverse color={Colors.successButton1} name='done' type='material-icons' raised size={Dimensions.get('screen').width * 0.075} tvParallaxProperties={undefined} />
    </TouchableOpacity>
  )
}

export default SaveButtonComponent