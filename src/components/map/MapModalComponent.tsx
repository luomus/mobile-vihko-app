import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import { Icon } from 'react-native-elements'
import { RootState } from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import { forms, lolifeObservationTypes } from '../../config/fields'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { useTranslation } from 'react-i18next'

type Props = {
  shiftToEditPage: (unitId: string) => void,
  showSubmitDelete: (unitId: string) => void,
  cancelObservation: () => void,
  isVisible: boolean,
  onBackButtonPress: () => void,
  observationOptions: Array<Record<string, any>>
}

const MapModalComponent = (props: Props) => {

  const schema = useSelector((state: RootState) => state.schema)

  const { t } = useTranslation()

  return (
    <Modal isVisible={props.isVisible} onBackButtonPress={props.onBackButtonPress} backdropOpacity={0.5} onBackdropPress={props.onBackButtonPress}>
      <View style={Cs.mapModalContainer}>
        <Icon
          type={'material-icons'}
          name={'cancel'}
          size={30}
          color={Colors.dangerButton2}
          containerStyle={Cs.modalCloseContainer}
          onPress={() => props.onBackButtonPress()}
        />
        <ScrollView style={{ width: '100%' }}>
          {props.observationOptions.map(observation =>
            <View key={observation.id} style={Cs.mapModalItemContainer}>
              {schema.formID !== forms.lolife ?
                <Text style={Ts.centeredBold}>{observation.identifications[0].taxon}</Text>
                :
                <Text style={Ts.centeredBold}>
                  {lolifeObservationTypes[observation.rules.field] ? t(lolifeObservationTypes[observation.rules.field]) : t('flying squirrel')}
                </Text>
              }
              <ButtonComponent onPressFunction={() => props.shiftToEditPage(observation.id)}
                title={t('edit')} height={40} width={120} buttonStyle={Bs.mapModalButton}
                gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                textStyle={Ts.buttonText} iconName={'edit'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
              />
              <ButtonComponent onPressFunction={() => props.showSubmitDelete(observation.id)}
                title={t('delete')} height={40} width={120} buttonStyle={Bs.mapModalButton}
                gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={'delete'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  )
}

export default MapModalComponent