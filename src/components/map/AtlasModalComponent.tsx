import React from 'react'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import { useTranslation } from 'react-i18next'
import { rootState } from '../../stores'
import Cs from '../../styles/ContainerStyles'

type Props = {
  isVisible: boolean,
  onBackButtonPress: () => void,
}

const AtlasModalComponent = (props: Props) => {

  const grid = useSelector((state: rootState) => state.grid)

  const { t } = useTranslation()

  return (
    <Modal isVisible={props.isVisible} onBackButtonPress={props.onBackButtonPress} backdropOpacity={0.5} onBackdropPress={props.onBackButtonPress}>
      <View style={Cs.mapModalContainer}>
        <Text>{t('you have chosen the grid') + ' ' + grid?.n + ':' + grid?.e + ' ' + grid?.name + '. ' + t('grid description')}</Text>
      </View>
    </Modal>
  )
}

export default AtlasModalComponent