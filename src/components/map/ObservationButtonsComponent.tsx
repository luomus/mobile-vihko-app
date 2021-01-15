import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
<<<<<<< HEAD
import { Icon, Button } from 'react-native-elements'
import { Region } from 'react-native-maps'
import { Point } from 'geojson'
=======
import { Button } from 'react-native-elements'
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import { connect, ConnectedProps } from 'react-redux'
import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { ObservationEventType } from '../../stores/observation/types'
import { SchemaType } from '../../stores/observation/types'
import { listOfHaversineNeighbors } from '../../utilities/haversineFormula'

interface BasicObject {
  [key: string]: any
}

interface RootState {
  observation: Point,
  observationEvent: ObservationEventType,
  region: Region,
=======
import { SchemaType } from '../../stores/observation/types'
import i18n from '../../language/i18n'

interface RootState {
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
  schema: SchemaType
}

const mapStateToProps = (state: RootState) => {
<<<<<<< HEAD
  const { observation, observationEvent, region, schema } = state
  return { observation, observationEvent, region, schema }
=======
  const { schema } = state
  return { schema }
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
}

const connector = connect(
  mapStateToProps
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
<<<<<<< HEAD
  confirmationButton: (isNew?: boolean, rules?: Record<string, any>, defaults?: Record<string, any>, sourcePage?: string) => void,
  cancelButton: () => void,
  mode: string,
  openModal: (units: Array<Record<string, any>>, eventId: string) => void,
  shiftToEditPage: (eventId: string, unitId: string) => void
=======
  confirmationButton: (isNew?: boolean, rules?: Record<string, any>, defaults?: Record<string, any>) => void,
  cancelButton: () => void,
  mode: string
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
}

const ObservationButtonsComponent = (props: Props) => {

  const { t } = useTranslation()

<<<<<<< HEAD
  const createButton = (title: string, bStyle: StyleProp<ViewStyle>, onPress: () => void, icon?: boolean | React.ReactElement<{}>) => {
=======
  const createButton = (title: string, bStyle: StyleProp<ViewStyle>, onPress: () => void) => {
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
    return (
      <View key={title} style={Cs.observationTypeButton}>
        <Button
          buttonStyle={bStyle}
<<<<<<< HEAD
          icon={icon}
          title={title}
          titleProps={{
            numberOfLines: 1
          }}
=======
          title={title}
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
          onPress={() => onPress()}
        />
      </View>
    )
  }

  const createButtonList = () => {
<<<<<<< HEAD
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
=======
    let lang = i18n.language
    const unitGroups = props.schema[lang]?.uiSchemaParams?.unitGroups

    if (unitGroups) {
      return unitGroups?.map((observation: Record<string, any>) =>
        createButton(
          observation.button.label.toUpperCase(),
          Bs.observationButton,
          () => props.confirmationButton(true, observation.rules, observation.button.default)
        )
      )
    } else {
      return createButton(
        t('add new observation').toUpperCase(),
        Bs.observationButton,
        () => props.confirmationButton(true)
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
      )
    }
  }

  const observationButtons = () => {
    if (props.mode === 'newObservation') {
      return (
<<<<<<< HEAD
        <View style={Cs.observationTypeColumnsContainer}>
          <View style={Cs.observationTypeButtonsColumnLeft}>
            {createButtonList()}
          </View>
          <View style={Cs.observationTypeButtonsColumnRight}>
            {createButton(t('add new observation').toUpperCase(), Bs.observationButton, () => props.confirmationButton())}
            {createButton(t('cancel'), Bs.endButton, () => props.cancelButton())}
          </View>
=======
        <View style={Cs.observationTypeButtonsColumn}>
          {createButtonList()}
          {createButton(t('cancel'), Bs.endButton, () => props.cancelButton())}
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
        </View>
      )
    }
    if (props.mode === 'changeLocation') {
      return (
<<<<<<< HEAD
        <View style={Cs.observationTypeButtonsColumnRight}>
=======
        <View style={Cs.observationTypeButtonsColumn}>
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
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