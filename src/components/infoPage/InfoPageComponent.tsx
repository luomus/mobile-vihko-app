import React from 'react'
import { Linking, Text, View } from 'react-native'
import { privacyPolicyEn, privacyPolicyFi } from '../../config/urls'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'

export const InfoPageComponent = () => {
  const { t, i18n } = useTranslation()

  let privacyPolicy = ''

  if (i18n.language === 'fi') {
    privacyPolicy = privacyPolicyFi
  } else if (i18n.language === 'sv') {
    privacyPolicy = privacyPolicyFi
  } else (
    privacyPolicy = privacyPolicyEn
  )

  return (
    <View style={Cs.infoContainer}>
      <Text style={Ts.infoText}>
        {`${t('see privacy policy')} `}
        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(privacyPolicy)}>
          {`${t('privacy policy')}\n\n`}
        </Text>
      </Text>
    </View>
  )
}