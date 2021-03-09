import React from 'react'
import { View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import { rootState, popMessageState } from '../../stores'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import { useTranslation } from 'react-i18next'

const MessageComponent = () => {

  const message = useSelector((state: rootState) => state.message)

  const dispatch = useDispatch()

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

  const oneButtonCreator = (buttonStyle: Record<string, any>, buttonLabel: string) => {
    return (
      <View style={Cs.singleButton}>
        <Button
          title={buttonLabel}
          buttonStyle={buttonStyle}
          iconRight={true}
          icon={<Icon type={'material-community'} name={'check'} color={'white'} />}
          onPress={onOk}
        />
      </View>
    )
  }

  const twoButtonCreator = (
    leftButtonStyle: Record<string, any>,
    leftButtonLabel: string,
    rightButtonStyle: Record<string, any>,
    rightButtonLabel: string
  ) => {
    return (
      <View style={Cs.editObservationButtonContainer}>
        <View style={Cs.singleButton}>
          <Button
            title={leftButtonLabel}
            buttonStyle={leftButtonStyle}
            iconRight={true}
            icon={<Icon type={'material-community'} name={'check'} color={'white'} />}
            onPress={onOk}
          />
        </View>
        <View style={Cs.singleButton}>
          <Button
            title={rightButtonLabel}
            buttonStyle={rightButtonStyle}
            iconRight={true}
            icon={<Icon type={'material-community'} name={'close'} color={'white'} />}
            onPress={onCancel}
          />
        </View>
      </View>
    )
  }

  const buttonLayoutSelector = () => {
    switch (topMessage?.type) {
      case 'err':
      case 'msg':
        return oneButtonCreator(Bs.basicNeutralButton, buttonLabel())
      case 'conf':
        return twoButtonCreator(Bs.basicNeutralButton, leftLabel(), Bs.basicNegativeButton, rightLabel())
      case 'dangerConf':
        return twoButtonCreator(Bs.basicNegativeButton, leftLabel(), Bs.basicNeutralButton, rightLabel())
    }
  }

  return (
    <Modal isVisible={isVisible} onBackButtonPress={onBackButtonPress}>
      <View style={Cs.observationAddModal}>
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
          <Text style={Cs.containerWithJustPadding}>
            {topMessage?.messageContent}
          </Text>
        </View>
        {buttonLayoutSelector()}
      </View>
    </Modal>
  )
}

export default MessageComponent