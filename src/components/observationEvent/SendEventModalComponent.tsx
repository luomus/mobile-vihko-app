import React from 'react'
import { View, Text } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import { useTranslation } from 'react-i18next'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'

type Props = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  sendObservationEvent: (isPublic: boolean) => Promise<void>
}

const sendEventModalComponent = (props: Props) => {

  const { t } = useTranslation()

  return (
    <Modal isVisible={props.modalVisibility} backdropOpacity={10} onBackButtonPress={() => { props.setModalVisibility(false) }}>
      <View style={Cs.sendEventModalContainer}>
        <Text style={Cs.containerWithJustPadding}>
          {t('send observation event to server?')}
        </Text>
        <Button
          title={t('send public')}
          buttonStyle={Bs.sendEventModalPositiveButton}
          icon={<Icon type={'material-community'} name={'publish'} color={'white'} />}
          iconRight={true}
          onPress={ () => {props.sendObservationEvent(true)} }
        />
        <Button
          title={t('send private')}
          buttonStyle={Bs.sendEventModalNeutralButton}
          icon={<Icon type={'material-community'} name={'security'} color={'white'} />}
          iconContainerStyle={Cs.iconStretchContainer}
          iconRight={true}
          onPress={ () => {props.sendObservationEvent(false)} }
        />
        <Button
          title={t('cancel')}
          buttonStyle={Bs.sendEventModalNegativeButton}
          icon={<Icon type={'material-community'} name={'close'} color={'white'} />}
          iconContainerStyle={Cs.iconStretchContainer}
          iconRight={true}
          onPress={() => { props.setModalVisibility(false) }}
        />
      </View>
    </Modal>
  )
}

export default sendEventModalComponent