import React from 'react'
import { Linking, Text } from 'react-native'
import {
  lajiHomepageEn,
  lajiHomepageFi,
  lajiHomepageSv,
  instructionsEn,
  instructionsFi,
  instructionsSv,
  privacyPolicyEn,
  privacyPolicyFi,
  termsOfServiceEn,
  termsOfServiceFi,
  termsOfServiceSv
} from '../../config/urls'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'

export const InfoPageComponent = () => {
  const { t, i18n } = useTranslation()

  let lajiHomepage = ''
  let instructions = ''
  let privacyPolicy = ''
  let termsOfService = ''

  if (i18n.language === 'fi') {
    lajiHomepage = lajiHomepageFi
    instructions = instructionsFi
    privacyPolicy = privacyPolicyFi
    termsOfService = termsOfServiceFi
  } else if (i18n.language === 'sv') {
    lajiHomepage = lajiHomepageSv
    instructions = instructionsSv
    privacyPolicy = privacyPolicyFi
    termsOfService = termsOfServiceSv
  } else {
    lajiHomepage = lajiHomepageEn
    instructions = instructionsEn
    privacyPolicy = privacyPolicyEn
    termsOfService = termsOfServiceEn
  }

  return (
    <ScrollView style={Cs.infoContainer}>
      <Text style={Ts.infoText}>
        <Text>
          {t('infotext.mobilevihko.1') + ' '}
        </Text>
        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(lajiHomepage)}>
          {`${lajiHomepage}\n\n`}
        </Text>
        <Text>
          {t('infotext.mobilevihko.2') + '\n\n' + t('infotext.mobilevihko.3') + '\n\n' + t('infotext.mobilevihko.4') + ' '}
        </Text>
        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(instructions)}>
          {`${instructions}\n\n`}
        </Text>
        <Text>
          {t('infotext.mobilevihko.5') + ' '}
        </Text>
        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(privacyPolicy)}>
          {`${privacyPolicy}`}
        </Text>
        <Text>
          {' ' + t('infotext.mobilevihko.6') + ' '}
        </Text>
        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(termsOfService)}>
          {`${termsOfService}`}
        </Text>
      </Text>
    </ScrollView>
  )
}