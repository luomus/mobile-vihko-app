import React from 'react'
import { Modal, Linking, Text, View, TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../stores'
import { gridPreviewUrl, resultServiceUrl } from '../../config/urls'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

type Props = {
  isVisible: boolean,
  onBackButtonPress: () => void,
}

const AtlasModalComponent = (props: Props) => {

  const grid = useSelector((state: RootState) => state.grid)

  const { t } = useTranslation()

  return (
    <Modal visible={props.isVisible} onRequestClose={() => props.onBackButtonPress()} transparent>
      <TouchableWithoutFeedback onPress={() => props.onBackButtonPress()}>
        <View style={Cs.transparentModalContainer}>
          <TouchableWithoutFeedback>
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default AtlasModalComponent