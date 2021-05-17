import React from 'react'
import { View, Text } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import { useTranslation } from 'react-i18next'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'

type Props = {
  modalVisibility: boolean,
  onCancel: React.Dispatch<React.SetStateAction<boolean>> | (() => void),
  sendObservationEvent: (isPublic: boolean) => Promise<void>
}

const SendEventModalComponent = (props: Props) => {

  const { t } = useTranslation()

  return (
    <Modal isVisible={props.modalVisibility} backdropOpacity={10} onBackButtonPress={() => { props.onCancel(false) }}>
      <View style={Cs.sendEventModalContainer}>
        <Text style={Cs.containerWithJustPadding}>
          {t('send observation event to server?')}
        </Text>
        <View style={Cs.padding5Container}>
          <ButtonComponent onPressFunction={() => { props.sendObservationEvent(true) }} title={t('send public')}
            height={40} width={250} buttonStyle={Bs.sendEventModalPositiveButton}
            gradientColorStart={Colors.success1} gradientColorEnd={Colors.success2} shadowColor={Colors.successShadow}
            textStyle={Ts.buttonText} iconName={'publish'} iconType={'material-community'} iconSize={22} contentColor={Colors.whiteText}
          />
        </View>
        <View style={Cs.padding5Container}>
          <ButtonComponent onPressFunction={() => { props.sendObservationEvent(false) }} title={t('send private')}
            height={40} width={250} buttonStyle={Bs.sendEventModalNeutralButton}
            gradientColorStart={Colors.neutral} gradientColorEnd={Colors.neutral} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={'security'} iconType={'material-community'} iconSize={22} contentColor={Colors.darkText}
          />
        </View>
        <View style={Cs.padding5Container}>
          <ButtonComponent onPressFunction={() => { props.onCancel(false) }} title={t('do not submit')}
            height={40} width={250} buttonStyle={Bs.sendEventModalNegativeButton}
            gradientColorStart={Colors.neutral} gradientColorEnd={Colors.neutral} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={'close'} iconType={'material-community'} iconSize={22} contentColor={Colors.darkText}
          />
        </View>
      </View>
    </Modal>
  )
}

export default SendEventModalComponent