import React, { useState, useEffect } from 'react'
import { View, Text, Linking } from 'react-native'
import { useTranslation } from 'react-i18next'
import { lajiFI, lajiSV, lajiEN } from '../../config/urls'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'

export const HomeIntroductionComponent = () => {

  const { t, i18n } = useTranslation()

  const [link, setLink] = useState<string>('')

  useEffect(() => {
    changeLinkPage()
  }, [i18n.language])

  const changeLinkPage = () => {
    if (i18n.language === 'fi') {
      setLink(lajiFI)
    } else if (i18n.language === 'sv') {
      setLink(lajiSV)
    } else (
      setLink(lajiEN)
    )
  }

  return (
    <View style={Cs.homeInfoContainer}>
      <Text style={Ts.linkToLajiText}>
        {t('instructions.mobilevihko.intro') + ' '}
      </Text>
    </View>
  )
}