import React from 'react'
import { Image, Linking, ScrollView, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import { Trans, useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'
import {
  instructionsEn, instructionsFi, instructionsSv, lajiHomepageEn, lajiHomepageFi, lajiHomepageSv,
  privacyPolicyEn, privacyPolicyFi, termsOfServiceEn, termsOfServiceFi, termsOfServiceSv,
  vihkoEn, vihkoFi, vihkoSv, lolifeEn, lolifeFi, lolifeSv
} from '../../config/urls'

type Props = {
  isVisible: boolean,
  screen: string,
  onClose: () => void
}

const InstructionModalComponent = (props: Props) => {
  const { i18n } = useTranslation()

  let links = []

  let lajiHomepage = ''
  let instructions = ''
  let lolifePage = ''
  let privacyPolicy = ''
  let termsOfService = ''
  let vihkoPage = ''

  if (i18n.language === 'fi') {
    lajiHomepage = lajiHomepageFi
    instructions = instructionsFi
    lolifePage = lolifeFi
    privacyPolicy = privacyPolicyFi
    termsOfService = termsOfServiceFi
    vihkoPage = vihkoFi
  } else if (i18n.language === 'sv') {
    lajiHomepage = lajiHomepageSv
    instructions = instructionsSv
    lolifePage = lolifeSv
    privacyPolicy = privacyPolicyEn
    termsOfService = termsOfServiceSv
    vihkoPage = vihkoSv
  } else {
    lajiHomepage = lajiHomepageEn
    instructions = instructionsEn
    lolifePage = lolifeEn
    privacyPolicy = privacyPolicyEn
    termsOfService = termsOfServiceEn
    vihkoPage = vihkoEn
  }

  if (props.screen === 'home') {
    links = [
      <Text key={lajiHomepage} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(vihkoPage)}></Text>,
      <Text key={instructions} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(instructions)}></Text>,
      <Text key={termsOfService} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(privacyPolicy)}></Text>,
      <Text key={termsOfService} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(termsOfService)}></Text>,
      <Text key={termsOfService} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(lolifePage)}></Text>
    ]
  } else if (props.screen === 'map') {
    links = [
      <Text key={instructions} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(instructions)}></Text>
    ]
  } else if (props.screen === 'observation') {
    links = [
      <Text key={instructions} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(instructions)}></Text>
    ]
  } else if (props.screen === 'document') {
    links = [
      <Text key={lajiHomepage} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(vihkoPage)}></Text>,
      <Text key={instructions} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(instructions)}></Text>
    ]
  } else if (props.screen === 'overview') {
    links = [
      <Text key={lajiHomepage} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(vihkoPage)}></Text>,
      <Text key={instructions} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(instructions)}></Text>
    ]
  } else {
    links = [
      <Text key={lajiHomepage} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(lajiHomepage)}></Text>,
      <Text key={instructions} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(instructions)}></Text>,
      <Text key={termsOfService} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(privacyPolicy)}></Text>,
      <Text key={termsOfService} style={{ color: Colors.linkText }} onPress={() => Linking.openURL(termsOfService)}></Text>
    ]
  }

  return (
    <Modal isVisible={props.isVisible} onBackButtonPress={props.onClose} onBackdropPress={props.onClose}>
      <View style={Cs.messageModalContainer}>
        <ScrollView style={{ margin: 10 }}>
          <Text>
            <Trans i18nKey={'instructions.' + props.screen} components={links} />
          </Text>
          <Image
            resizeMode={'contain'}
            source={require('../../../assets/finbif.png')}
            style={{ alignSelf: 'center', maxWidth: 150, maxHeight: 150 }}
          />
          <Image
            resizeMode={'contain'}
            source={require('../../../assets/hy.png')}
            style={{ alignSelf: 'center', maxWidth: 150, maxHeight: 150 }}
          />
          <Image
            resizeMode={'contain'}
            source={require('../../../assets/life.png')}
            style={{ alignSelf: 'center', maxWidth: 150, maxHeight: 150 }}
          />
        </ScrollView>
      </View>
    </Modal>
  )
}

export default InstructionModalComponent
