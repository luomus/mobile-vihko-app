import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import { rootState } from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
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
          <ScrollView style={{ width: '100%' }}>
            {props.observationOptions.map(observation =>
              <View key={observation.id} style={Cs.mapModalItemContainer}>
                <Text style={Ts.centeredBold}>{observation.identifications[0].taxon}</Text>
                <View style={Cs.padding5Container}>
                  <ButtonComponent onPressFunction={() => props.shiftToEditPage(observationId.eventId, observation.id)}
                    title={t('edit button')} height={40} width={120} buttonStyle={Bs.mapModalButton}
                    gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                    textStyle={Ts.buttonText} iconName={'edit'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
                  />
                </View>
                <View style={Cs.padding5Container}>
                  <ButtonComponent onPressFunction={() => props.showSubmitDelete(observationId.eventId, observation.id)}
                    title={t('delete')} height={40} width={120} buttonStyle={Bs.mapModalButton}
                    gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                    textStyle={Ts.buttonText} iconName={'delete'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
                  />
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
      : null
  )
}

export default MapModalComponent