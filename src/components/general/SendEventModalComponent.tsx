import React from 'react'
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../stores'
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
  cancelTitle: string,
  setConfirmationModalVisibility: React.Dispatch<React.SetStateAction<boolean>> | undefined,
  eventId: string | undefined
}

const SendEventModalComponent = (props: Props) => {

  const { t } = useTranslation()

  const observationEvent = useSelector((state: RootState) => state.observationEvent)
  const observing = useSelector((state: RootState) => state.observing)
  const schema = useSelector((state: RootState) => state.schema)

  return (
    <Modal visible={props.modalVisibility} onRequestClose={() => { props.setModalVisibility(false) }} transparent>
      <TouchableWithoutFeedback onPress={() => { props.setModalVisibility(false) }}>
        <View style={Cs.transparentModalContainer}>
          <TouchableWithoutFeedback>
            <View style={Cs.modalContainer}>
              <Text style={{ padding: 5 }}>{t('send description')}</Text>
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
              {observing && observationEvent.events[observationEvent.events.length - 1].id === props.eventId ?
                <ButtonComponent
                  onPressFunction={
                    () => {
                      if (!props.setConfirmationModalVisibility) return
                      props.setModalVisibility(false)
                      props.setConfirmationModalVisibility(true)
                    }}
                  title={t('end without saving')}
                  height={40} width={200} buttonStyle={Bs.sendEventModalButton}
                  gradientColorStart={Colors.dangerButton1} gradientColorEnd={Colors.dangerButton2} shadowColor={Colors.dangerShadow}
                  textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.whiteText}
                />
                : null
              }
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default SendEventModalComponent