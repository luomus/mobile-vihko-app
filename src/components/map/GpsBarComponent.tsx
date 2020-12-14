import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'

type Props = {
  stopObserving: () => void
}

const GpsBarComponent = (props: Props) => {

  const { t } = useTranslation()

  return (
    <View style={Cs.gpsStatusBar}>
      <View style={Cs.gpsBarLeft}>
        <Icon name='fiber-manual-record' color='red' size={30} />
        <Text style={{ color: 'white' }}>{t('gps recording on')}</Text>
      </View>
      <TouchableOpacity onPress={() => props.stopObserving()}>
        <View style={Cs.gpsBarRight}>
          <Text style={{ color: 'white', marginLeft: 5 }}>{t('stop observation event')}</Text>
          <Icon name='stop' color='red' size={30} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default GpsBarComponent