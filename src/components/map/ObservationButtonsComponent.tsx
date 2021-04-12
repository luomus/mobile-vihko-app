import React from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { rootState } from '../../stores'
import { listOfHaversineNeighbors } from '../../helpers/distanceHelper'

interface BasicObject {
  [key: string]: any
}

type Props = {
  confirmationButton: (isNew?: boolean, rules?: Record<string, any>, defaults?: Record<string, any>, sourcePage?: string) => void,
  cancelButton: () => void,
  mode: string,
  openModal: (units: Array<Record<string, any>>, eventId: string) => void,
  shiftToEditPage: (eventId: string, unitId: string) => void
}

const ObservationButtonsComponent = (props: Props) => {

  const observation = useSelector((state: rootState) => state.observation)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const region = useSelector((state: rootState) => state.region)

  const { t } = useTranslation()

  const createButton = (title: string, bStyle: StyleProp<ViewStyle>, onPress: () => void, icon?: boolean | React.ReactElement<{}>) => {
    return (
      <View key={title} style={Cs.observationTypeButton}>
        <Button
          buttonStyle={bStyle}
          icon={icon}
          title={title}
          titleProps={{
            numberOfLines: 1
          }}
          onPress={() => onPress()}
        />
      </View>
    )
  }

  const createButtonList = () => {
    const units: BasicObject[] = observationEvent.events?.[observationEvent.events.length - 1]
      .gatherings[0].units
    const haversineNeighbors: Array<Record<string, any>> = listOfHaversineNeighbors(units, region, observation)
    const eventId: string = observationEvent.events?.[observationEvent.events.length - 1].id

    if (haversineNeighbors.length >= 4) {
      return (
        (
          <View style={Cs.observationTypeButtonsColumnLeft}>
            <Text style={Ts.mapButtonsLeftTitle}>{t('edit observations')}:</Text>
            {createButton(
              haversineNeighbors.length + ' ' + t('observation count'),
              Bs.observationNeighborsButton,
              () => props.openModal(haversineNeighbors, eventId),
              <Icon name='edit' type='material-icons' color='white' size={22} />
            )}
          </View>
        )
      )
    } else if (haversineNeighbors.length >= 1) {
      return (
        <View style={Cs.observationTypeButtonsColumnLeft}>
          <Text style={Ts.mapButtonsLeftTitle}>{t('edit observations')}:</Text>
          {haversineNeighbors?.map((neighbor: Record<string, any>) =>
            createButton(
              neighbor.identifications[0].taxon,
              Bs.observationNeighborsButton,
              () => props.shiftToEditPage(eventId, neighbor.id),
              <Icon name='edit' type='material-icons' color='white' size={22} />
            )
          )}
        </View>
      )
    }
  }

  const observationButtons = () => {
    if (props.mode === 'newObservation') {
      return (
        <View style={Cs.observationTypeColumnsContainer}>
          {createButtonList() ? createButtonList() : <View></View>}
          <View style={Cs.observationTypeButtonsColumnRight}>
            {createButton('+ ' + t('observation'), Bs.observationButton, () => props.confirmationButton(true))}
            {createButton(t('cancel'), Bs.endButton, () => props.cancelButton())}
          </View>
        </View>
      )
    }
    if (props.mode === 'changeLocation') {
      return (
        <View style={Cs.observationTypeButtonsColumnRight}>
          {createButton(t('save'), Bs.observationButton, () => props.confirmationButton())}
          {createButton(t('cancel'), Bs.endButton, () => props.cancelButton())}
        </View>
      )
    }
  }

  return (
    <View style={Cs.observationTypeButtonsContainer}>
      {observationButtons()}
    </View>
  )
}

export default ObservationButtonsComponent