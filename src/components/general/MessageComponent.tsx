import React from 'react'
import { View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import { DispatchType, rootState, popMessageState } from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { useTranslation } from 'react-i18next'

const MessageComponent = () => {

  const message = useSelector((state: rootState) => state.message)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  const topMessage = message[0]
  let isVisible = false

  if (topMessage) {
    isVisible = true
  }

  const onOk = () => {
    dispatch(popMessageState())
    if (topMessage.onOk) {
      topMessage.onOk()
    }
  }

  const onCancel = () => {
    dispatch(popMessageState())
    if (topMessage.onCancel) {
      topMessage.onCancel()
    }
  }

  const onBackButtonPress = () => {
    if (topMessage?.type === 'conf') {
      onCancel()
    } else {
      onOk()
    }
  }

  const buttonLabel = () => {
    const okLabel = topMessage?.okLabel
    return okLabel ? okLabel : t('ok')
  }

  const leftLabel = () => {
    const okLabel = topMessage?.okLabel
    return okLabel ? okLabel : t('yes')
  }

  const rightLabel = () => {
    const cancelLabel = topMessage?.cancelLabel
    return cancelLabel ? cancelLabel : t('no')
  }

  const oneButtonCreator = (buttonType: string, buttonLabel: string) => {
    if (buttonType === 'primary') {
      return (
        <View style={Cs.padding5Container}>
          {primaryButton(buttonLabel, 'check')}
        </View>
      )
    } else {
      return (
        <View style={Cs.padding5Container}>
          {neutralButton(buttonLabel, 'check')}
        </View>
      )
    }
  }

  const twoButtonCreator = (
    leftButtonType: string,
    leftButtonLabel: string,
    rightButtonType: string,
    rightButtonLabel: string
  ) => {
    if (leftButtonType === 'primary' && rightButtonType === 'neutral') {
      return (
        <View style={Cs.messageButtonsContainer}>
          <View style={Cs.padding5Container}>
            {primaryButton(leftButtonLabel, 'check')}
          </View>
          <View style={Cs.padding5Container}>
            {neutralButton(rightButtonLabel, 'cancel')}
          </View>
        </View>
      )
    } else {
      return (
        <View style={Cs.messageButtonsContainer}>
          <View style={Cs.padding5Container}>
            {neutralButton(leftButtonLabel, 'check')}
          </View>
          <View style={Cs.padding5Container}>
            {primaryButton(rightButtonLabel, 'cancel')}
          </View>
        </View>
      )
    }
  }

  const primaryButton = (label: string, iconName: string): JSX.Element => {
    return (
      <ButtonComponent onPressFunction={iconName === 'check' ? onOk : onCancel} title={label}
        height={40} width={120} buttonStyle={Bs.basicPrimaryButton}
        gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
        textStyle={Ts.buttonText} iconName={iconName} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
      />
    )
  }

  const neutralButton = (label: string, iconName: string): JSX.Element => {
    return (
      <ButtonComponent onPressFunction={iconName === 'check' ? onOk : onCancel} title={label}
        height={40} width={120} buttonStyle={Bs.basicNeutralButton}
        gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
        textStyle={Ts.buttonText} iconName={iconName} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
      />
    )
  }

  const buttonLayoutSelector = () => {
    switch (topMessage?.type) {
      case 'err':
      case 'msg':
        return oneButtonCreator('neutral', buttonLabel())
      case 'conf':
        return twoButtonCreator('primary', leftLabel(), 'neutral', rightLabel())
      case 'dangerConf':
        return twoButtonCreator('neutral', leftLabel(), 'primary', rightLabel())
    }
  }

  return (
    <Modal isVisible={isVisible} onBackButtonPress={onBackButtonPress}>
      <View style={Cs.messageAndInstructionsModalContainer}>
        {message.length <= 1 ?
          null :
          <Text style={Ts.alignedRightText}>
            1/{message.length}
          </Text>
        }
        <View>
          {topMessage?.type === 'err' ?
            <Icon type={'material-icons'} name={'report-problem'} color={'red'} size={50} />
            : null
          }
          <Text style={Cs.padding5Container}>
            {topMessage?.messageContent}
          </Text>
        </View>
        {buttonLayoutSelector()}
      </View>
    </Modal>
  )
}

export default MessageComponent