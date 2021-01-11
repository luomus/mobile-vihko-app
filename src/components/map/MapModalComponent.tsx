import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import { connect, ConnectedProps } from 'react-redux'
import Modal from 'react-native-modal'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
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
  onBackButtonPress: () => void,
  observationOptions: Array<Record<string, any>>
}

const MapModalComponent = (props: Props) => {
  const { t } = useTranslation()

  return (
    <Modal isVisible={props.isVisible} onBackButtonPress={props.onBackButtonPress} backdropOpacity={0.5} onBackdropPress={props.onBackButtonPress}>
      <View style={Cs.mapModalContainer}>
        <ScrollView>
          {props.observationOptions.map(observation =>
            <View key={observation.id} style={Cs.mapModalItemContainer}>
              <Text style={Ts.centeredBold}>{observation.identifications[0].taxon}</Text>
              <Button
                buttonStyle={Bs.mapModalPositiveButton}
                title={t('edit button')}
                onPress={() => props.shiftToEditPage(props.observationId.eventId, observation.id)}
              />
              <Button
                buttonStyle={Bs.mapModalNegativeButton}
                title={t('delete')}
                onPress={() => props.showSubmitDelete(props.observationId.eventId, observation.id)}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  )
}

export default connector(MapModalComponent)