import React from 'react'
import { View, FlatList, Text } from 'react-native'
import Modal from 'react-native-modal'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'

type Props = {
  isVisible: boolean,
  onClose: () => void
}

const InstructionModalComponent = (props: Props) => {
  const { t } = useTranslation()

  return (
    <Modal isVisible={props.isVisible} onBackButtonPress={props.onClose} onBackdropPress={props.onClose}>
      <View style={Cs.observationAddModal}>
        <FlatList
          data={[...Array(7).keys()].map(val => {return { key: `${val + 1}` }})}
          renderItem={({ item }) =>
            <View style={Cs.instructionContainer}>
              <Text>{item.key + '. '}</Text><Text>{t('instructions.' + item.key)}</Text>
            </View>
          }
        />
      </View>
    </Modal>
  )
}

export default InstructionModalComponent