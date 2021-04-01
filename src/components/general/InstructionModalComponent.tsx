import React from 'react'
import { Linking, View, FlatList, Text } from 'react-native'
import Modal from 'react-native-modal'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import { vihkoEn, vihkoFi, vihkoSv } from '../../config/urls'

type Props = {
  isVisible: boolean,
  onClose: () => void
}

const InstructionModalComponent = (props: Props) => {
  const { t, i18n } = useTranslation()

  let vihko = ''

  if (i18n.language === 'fi') {
    vihko = vihkoFi
  } else if (i18n.language === 'sv') {
    vihko = vihkoSv
  } else {
    vihko = vihkoEn
  }

  return (
    <Modal isVisible={props.isVisible} onBackButtonPress={props.onClose} onBackdropPress={props.onClose}>
      <View style={Cs.observationAddModal}>
        <FlatList
          data={[...Array(7).keys()].map(val => { return { key: `${val + 1}` } })}
          renderItem={({ item }) =>
            <View style={Cs.instructionContainer}>
              <Text>{t('instructions.mobilevihko.' + item.key)}</Text>
            </View>
          }
        />
        <Text style={{ paddingLeft: 10 }}>
          <Text>
            {t('instructions.mobilevihko.8')}
          </Text>
          <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(vihko)}>
            {' ' + `${t('instructions.mobilevihko.link')}`}
          </Text>
          <Text>
            {t('instructions.mobilevihko.9')}
          </Text>
        </Text>
      </View>
    </Modal>
  )
}

export default InstructionModalComponent