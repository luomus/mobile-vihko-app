import React from 'react'
import { Button } from 'react-native-elements'
import Modal from 'react-native-modal'
import { connect, ConnectedProps } from 'react-redux'
import Bs from '../../styles/ButtonStyles'
import { useTranslation } from 'react-i18next'

interface RootState {
  observationId: Record<string, any>
}

const mapStateToProps = (state: RootState) => {
  const { observationId } = state
  return { observationId }
}

const connector = connect(
  mapStateToProps
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  shiftToEditPage: (eventId: string, unitId: string) => void,
  showSubmitDelete: (eventId: string, unitId: string) => void,
  cancelObservation: () => void,
  isVisible: boolean,
  onBackButtonPress: () => void
}

const MapModalComponent = (props: Props) => {
  const { t } = useTranslation()

  return (
    <Modal isVisible={props.isVisible} onBackButtonPress={props.onBackButtonPress} backdropOpacity={0} onBackdropPress={props.onBackButtonPress}>
      <Button
        buttonStyle={Bs.mapModalPositiveButton}
        title={t('edit button')}
        onPress={() => props.shiftToEditPage(props.observationId.eventId, props.observationId.unitId)}
      />
      <Button
        buttonStyle={Bs.mapModalNegativeButton}
        title={t('delete')}
        onPress={() => props.showSubmitDelete(props.observationId.eventId, props.observationId.unitId)}
      />
    </Modal>
  )
}

export default connector(MapModalComponent)