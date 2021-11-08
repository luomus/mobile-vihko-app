import React from 'react'
import { View, Text } from 'react-native'
import Modal from 'react-native-modal'
import i18n from '../../languages/i18n'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'

type Props = {
  isVisible: boolean,
  onClose: () => void
}

const LanguageModalComponent = (props: Props) => {

  return (
    <Modal isVisible={props.isVisible} onBackButtonPress={props.onClose} onBackdropPress={props.onClose}>
      <View style={Cs.userModalContainer}>
        <Text
          style={Ts.languageText}
          onPress={() => {
            i18n.changeLanguage('fi')
            props.onClose()
          }}
        >
          FI
        </Text>
        <Text
          style={Ts.languageText}
          onPress={() => {
            i18n.changeLanguage('sv')
            props.onClose()
          }}
        >
          SV
        </Text>
        <Text
          style={Ts.languageText}
          onPress={() => {
            i18n.changeLanguage('en')
            props.onClose()
          }}
        >
          EN
        </Text>
      </View>
    </Modal>
  )
}

export default LanguageModalComponent