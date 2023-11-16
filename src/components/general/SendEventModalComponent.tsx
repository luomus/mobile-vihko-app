import React from 'react'
import { View } from 'react-native'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { rootState } from '../../stores'
import ButtonComponent from './ButtonComponent'
import { forms } from '../../config/fields'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'

type Props = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  onSendPrivate: () => any,
  onCancel: () => any,
  cancelTitle: string
}

const SendEventModalComponent = (props: Props) => {

  const { t } = useTranslation()

  const schema = useSelector((state: rootState) => state.schema)

  return (
    <Modal isVisible={props.modalVisibility} backdropOpacity={0.5}
      onBackButtonPress={() => props.setModalVisibility(false)} onBackdropPress={() => props.setModalVisibility(false)}>
      <View style={Cs.modalContainer}>
        {schema.formID !== forms.lolife && schema.formID !== forms.birdAtlas &&
          <ButtonComponent
            onPressFunction={
              () => {
                props.setModalVisibility(false)
                props.onSendPrivate()
              }}
            title={t('send private')}
            height={40} width={200} buttonStyle={Bs.sendEventModalButton}
            gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.darkText}
          />
        }
        <ButtonComponent
          onPressFunction={
            () => {
              props.setModalVisibility(false)
              props.onCancel()
            }}
          title={props.cancelTitle}
          height={40} width={200} buttonStyle={Bs.sendEventModalButton}
          gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
          textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.darkText}
        />
      </View>
    </Modal>
  )
}

export default SendEventModalComponent