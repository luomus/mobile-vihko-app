import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { rootState } from '../../stores'
import { lajiFI, lajiSV, lajiEN } from '../../config/urls'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'

export const HomeIntroductionComponent = () => {

  const [link, setLink] = useState<string>('')

  const schema = useSelector((state: rootState) => state.schema)

  const { t, i18n } = useTranslation()

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
        { schema.formID === 'JX.519' ? t('instructions.mobilevihko.intro') : t('instructions.mobilevihko.intro.fungi') }
      </Text>
    </View>
  )
}