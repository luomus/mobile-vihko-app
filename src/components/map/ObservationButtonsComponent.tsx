import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import { Region } from 'react-native-maps'
import { Point } from 'geojson'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import { connect, ConnectedProps } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ObservationEventType, SchemaType } from '../../stores'
import { listOfHaversineNeighbors } from '../../helpers/distanceHelper'

interface BasicObject {
  [key: string]: any
}

interface RootState {
  observation: Point,
  observationEvent: ObservationEventType,
  region: Region,
  schema: SchemaType
}

const mapStateToProps = (state: RootState) => {
  const { observation, observationEvent, region, schema } = state
  return { observation, observationEvent, region, schema }
}

const connector = connect(
  mapStateToProps
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  confirmationButton: (isNew?: boolean, rules?: Record<string, any>, defaults?: Record<string, any>, sourcePage?: string) => void,
  cancelButton: () => void,
  mode: string,
  openModal: (units: Array<Record<string, any>>, eventId: string) => void,
  shiftToEditPage: (eventId: string, unitId: string) => void
}

const ObservationButtonsComponent = (props: Props) => {

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
    const units: BasicObject[] = props.observationEvent.events?.[props.observationEvent.events.length - 1]
      .gatherings[0].units
    const haversineNeighbors: Array<Record<string, any>> = listOfHaversineNeighbors(units, props.region, props.observation)
    const eventId: string = props.observationEvent.events?.[props.observationEvent.events.length - 1].id

    if (haversineNeighbors.length >= 4) {
      return (
        createButton(
          haversineNeighbors.length + ' ' + t('observation count'),
          Bs.observationNeighborsButton,
          () => props.openModal(haversineNeighbors, eventId),
          <Icon name='edit' type='material-icons' color='white' size={22} />
        )
      )
    } else if (haversineNeighbors.length >= 1) {
      return haversineNeighbors?.map((neighbor: Record<string, any>) =>
        createButton(
          neighbor.identifications[0].taxon,
          Bs.observationNeighborsButton,
          () => props.shiftToEditPage(eventId, neighbor.id),
          <Icon name='edit' type='material-icons' color='white' size={22} />
        )
      )
    }
  }

  const observationButtons = () => {
    if (props.mode === 'newObservation') {
      return (
        <View style={Cs.observationTypeColumnsContainer}>
          <View style={Cs.observationTypeButtonsColumnLeft}>
            {createButtonList()}
          </View>
          <View style={Cs.observationTypeButtonsColumnRight}>
            {createButton(t('add new observation').toUpperCase(), Bs.observationButton, () => props.confirmationButton(true))}
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

export default connector(ObservationButtonsComponent)