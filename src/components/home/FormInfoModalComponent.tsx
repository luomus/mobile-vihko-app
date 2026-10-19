import React from 'react'
import { Modal, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native'
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

type Props = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  content: string
}

const InstructionModalComponent = (props: Props) => {
  return (
    <Modal visible={props.modalVisibility} onRequestClose={() => { props.setModalVisibility(false) }}>
      <TouchableWithoutFeedback onPress={() => { props.setModalVisibility(false) }}>
        <View style={Cs.newModalContainer}>
          <TouchableWithoutFeedback>
            <View style={Cs.messageModalContainer}>
              <ScrollView style={{ margin: 10 }}>
                <MaterialDesignIcons
                  name='close-circle'
                  size={30}
                  color={Colors.dangerButton2}
                  style={Cs.modalCloseContainer}
                  onPress={() => props.setModalVisibility(false)}
                />
                <Text>{props.content}</Text>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default InstructionModalComponent