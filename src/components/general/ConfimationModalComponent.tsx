import React, { useState } from 'react'
import { Switch, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import { useTranslation } from 'react-i18next'
import ButtonComponent from './ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'

type Props = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  deleteEvent: () => Promise<void>
}

const ConfirmationModalComponent = (props: Props) => {

  const [confirmed, setConfirmed] = useState(false)

  const { t } = useTranslation()

  return (
    <Modal isVisible={props.modalVisibility} backdropOpacity={0.5}
      onBackButtonPress={() => props.setModalVisibility(false)} onBackdropPress={() => props.setModalVisibility(false)}>
      <View style={Cs.modalContainer}>
        <Text style={{ padding: 5 }}>{t('confirmation description')}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ padding: 5, alignSelf: 'center' }}>{t('confirm')}</Text>
          <Switch
            style={Cs.padding5Container}
            value={confirmed}
            onValueChange={() => {
              setConfirmed(!confirmed)
            }}
            thumbColor={
              Colors.neutralButton
            }
            trackColor={{
              false: Colors.unavailableButton,
              true: Colors.dangerButton1
            }}>
          </Switch>
        </View>
        <ButtonComponent disabled={!confirmed}
          onPressFunction={async () => {
            await props.deleteEvent()
            props.setModalVisibility(false)
          }}
          title={t('continue')} height={40} width={200} buttonStyle={Bs.sendEventModalButton}
          gradientColorStart={confirmed ? Colors.dangerButton1 : Colors.unavailableButton}
          gradientColorEnd={confirmed ? Colors.dangerButton2 : Colors.unavailableButton}
          shadowColor={confirmed ? Colors.dangerShadow : Colors.neutralShadow} textStyle={Ts.buttonText}
          iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={confirmed ? Colors.whiteText : Colors.darkText} noMargin
        />
        <ButtonComponent
          onPressFunction={
            () => { props.setModalVisibility(false) }}
          title={t('cancel')}
          height={40} width={200} buttonStyle={Bs.sendEventModalButton}
          gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
          textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.darkText}
        />
      </View>
    </Modal>
  )
}

export default ConfirmationModalComponent