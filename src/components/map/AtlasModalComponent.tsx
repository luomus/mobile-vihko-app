import React from 'react'
import { Linking, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import { rootState } from '../../stores'
import { gridPreviewUrl, resultServiceUrl } from '../../config/urls'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

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
        <Icon
          type={'material-icons'}
          name={'cancel'}
          size={30}
          color={Colors.dangerButton2}
          containerStyle={Cs.modalCloseContainer}
          onPress={() => props.onBackButtonPress()}
        />
        <Text>{t('you have chosen the grid') + ' ' + grid?.n + ':' + grid?.e + ' ' + grid?.name + '. ' + t('grid description')}
          {'\n\n'}
          <Text
            style={{ color: Colors.linkText }}
            onPress={() => Linking.openURL(gridPreviewUrl + `${grid?.n}:${grid?.e}`)}>
            {t('link to grid')}
          </Text>
          {'\n\n'}
          <Text
            style={{ color: Colors.linkText }}
            onPress={() => Linking.openURL(resultServiceUrl + `${grid?.n}:${grid?.e}`)}>
            {t('link to result service')}
          </Text>
        </Text>
      </View>
    </Modal>
  )
}

export default AtlasModalComponent