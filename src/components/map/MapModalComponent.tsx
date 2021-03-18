import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import { useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import { rootState } from '../../stores'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import { useTranslation } from 'react-i18next'

type Props = {
  shiftToEditPage: (eventId: string, unitId: string) => void,
  showSubmitDelete: (eventId: string, unitId: string) => void,
  cancelObservation: () => void,
  isVisible: boolean,
  onBackButtonPress: () => void,
  observationOptions: Array<Record<string, any>>
}

const MapModalComponent = (props: Props) => {

  const observationId = useSelector((state: rootState) => state.observationId)

  const { t } = useTranslation()

  return (
    observationId ?
      <Modal isVisible={props.isVisible} onBackButtonPress={props.onBackButtonPress} backdropOpacity={0.5} onBackdropPress={props.onBackButtonPress}>
        <View style={Cs.mapModalContainer}>
          <ScrollView>
            {props.observationOptions.map(observation =>
              <View key={observation.id} style={Cs.mapModalItemContainer}>
                <Text style={Ts.centeredBold}>{observation.identifications[0].taxon}</Text>
                <Button
                  buttonStyle={Bs.mapModalPositiveButton}
                  title={t('edit button')}
                  onPress={() => props.shiftToEditPage(observationId.eventId, observation.id)}
                />
                <Button
                  buttonStyle={Bs.mapModalNegativeButton}
                  title={t('delete')}
                  onPress={() => props.showSubmitDelete(observationId.eventId, observation.id)}
                />
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
      : null
  )
}

export default MapModalComponent