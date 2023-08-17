import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import { useTranslation } from 'react-i18next'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'

type Props = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  setGridModalVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

const AtlasInstructionModalComponent = (props: Props) => {

  const { t } = useTranslation()

  return (
    <Modal isVisible={props.modalVisibility} backdropOpacity={10} onBackButtonPress={() => { props.setModalVisibility(false) }}
      onBackdropPress={() => { props.setModalVisibility(false) }} onModalHide={() => props.setGridModalVisibility(true)}>
      <View style={ Cs.atlasInstructionContainer }>
        <ScrollView>
          <Text style={Ts.homeScreenTitle}>
            {t('bird atlas')}
          </Text>
          <Text style={Ts.zonePickerDescription}>
            {t('grid description intro') + '\n\n' + t('grid description')}
          </Text>
          <View style={Cs.modalStartButtonContainer}>
            <ButtonComponent onPressFunction={() => props.setModalVisibility(false)} title={t('continue')}
              height={40} width={120} buttonStyle={Bs.beginButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={'done'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
            />
            <ButtonComponent onPressFunction={() => props.setModalVisibility(false)} title={t('cancel')}
              height={40} width={120} buttonStyle={Bs.beginButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'cancel'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}

export default AtlasInstructionModalComponent