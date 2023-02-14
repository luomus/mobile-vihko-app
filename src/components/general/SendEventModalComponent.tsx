import React from 'react'
import { View, Text } from 'react-native'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { rootState } from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import { forms } from '../../config/fields'
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

  const schema = useSelector((state: rootState) => state.schema)

  return (
    <Modal isVisible={props.modalVisibility} backdropOpacity={10} onBackButtonPress={() => { props.onCancel(false) }}>
      <View style={Cs.modalContainer}>
        <Text style={Cs.padding10Container}>
          {t('send observation event to server?')}
        </Text>
        <ButtonComponent onPressFunction={() => { props.sendObservationEvent(true) }} title={t('send public')}
          height={40} width={200} buttonStyle={Bs.sendEventModalButton}
          gradientColorStart={Colors.successButton1} gradientColorEnd={Colors.successButton2} shadowColor={Colors.successShadow}
          textStyle={Ts.buttonText} iconName={'publish'} iconType={'material-community'} iconSize={22} contentColor={Colors.whiteText}
        />
        {schema.formID !== forms.lolife && schema.formID !== forms.birdAtlas &&
          <ButtonComponent onPressFunction={() => { props.sendObservationEvent(false) }} title={t('send private')}
            height={40} width={200} buttonStyle={Bs.sendEventModalButton}
            gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={'security'} iconType={'material-community'} iconSize={22} contentColor={Colors.darkText}
          />
        }
        <ButtonComponent onPressFunction={() => { props.onCancel(false) }} title={t('do not submit')}
          height={40} width={200} buttonStyle={Bs.sendEventModalButton}
          gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
          textStyle={Ts.buttonText} iconName={'close'} iconType={'material-community'} iconSize={22} contentColor={Colors.darkText}
        />
      </View>
    </Modal>
  )
}

export default SendEventModalComponent