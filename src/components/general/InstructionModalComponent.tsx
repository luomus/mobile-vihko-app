import React from 'react'
import { Linking, View, FlatList, Text } from 'react-native'
import Modal from 'react-native-modal'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import { vihkoEn, vihkoFi, vihkoSv, instructionsEn, instructionsFi, instructionsSv } from '../../config/urls'
import { ScrollView } from 'react-native-gesture-handler'

type Props = {
  isVisible: boolean,
  onClose: () => void
}

const InstructionModalComponent = (props: Props) => {
  const { t, i18n } = useTranslation()

  let vihko = ''
  let instructions = ''

  if (i18n.language === 'fi') {
    vihko = vihkoFi
    instructions = instructionsFi
  } else if (i18n.language === 'sv') {
    vihko = vihkoSv
    instructions = instructionsSv
  } else {
    vihko = vihkoEn
    instructions = instructionsEn
  }

  return (
    <Modal isVisible={props.isVisible} onBackButtonPress={props.onClose} onBackdropPress={props.onClose}>
      <View style={Cs.messageAndInstructionsModalContainer}>
        <ScrollView>
          <View>
            <FlatList
              data={[...Array(7).keys()].map(val => { return { key: `${val + 1}` } })}
              renderItem={({ item }) =>
                <View style={Cs.instructionContainer}>
                  <Text>{t('instructions.mobilevihko.' + item.key)}</Text>
                </View>
              }
            />
            <Text>
              <Text>
                {t('instructions.mobilevihko.8')}
              </Text>
              <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(vihko)}>
                {' ' + `${t('instructions.mobilevihko.link')}`}
              </Text>
              <Text>
                {t('instructions.mobilevihko.9')}
                {'\n\n'}
              </Text>
              <Text>
                {t('instructions.mobilevihko.10')}
              </Text>
              <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(instructions)}>
                {' ' + `${'https://laji.fi/about/4981'}`}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}

export default InstructionModalComponent