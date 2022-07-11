import React from 'react'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { rootState } from '../../stores'
import Colors from '../../styles/Colors'

const GridWarningComponent = () => {

  const grid = useSelector((state: rootState) => state.grid)

  const { t } = useTranslation()

  return (
    <View style={{ backgroundColor: Colors.warning4, padding: 5, height: '15%', width: '100%' }}>
      <Text>{t('grid warning 1') + ' ' + grid?.n + ':' + grid?.e + ' ' + grid?.name + '. ' + t('grid warning 2')}</Text>
    </View>
  )
}

export default GridWarningComponent