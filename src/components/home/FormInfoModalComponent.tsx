import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

type Props = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  content: string
}

const InstructionModalComponent = (props: Props) => {
  return (
    <Modal isVisible={props.modalVisibility} onBackButtonPress={() => props.setModalVisibility(false)}
      onBackdropPress={() => props.setModalVisibility(false)}>
      <View style={Cs.messageModalContainer}>
        <ScrollView style={{ margin: 10 }}>
          <Icon
            type={'material-icons'}
            name={'cancel'}
            size={30}
            color={Colors.dangerButton2}
            containerStyle={Cs.modalCloseContainer}
            onPress={() => props.setModalVisibility(false)}
          />
          <Text>{props.content}</Text>
        </ScrollView>
      </View>
    </Modal>
  )
}

export default InstructionModalComponent