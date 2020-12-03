import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { Button } from 'react-native-elements'
import Cs from '../styles/ContainerStyles'
import Bs from '../styles/ButtonStyles'
import { connect, ConnectedProps } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { SchemaType } from '../stores/observation/types'
import i18n from '../language/i18n'

interface RootState {
  schema: SchemaType
}

const mapStateToProps = (state: RootState) => {
  const { schema } = state
  return { schema }
}

const connector = connect(
  mapStateToProps
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  confirmationButton: (rules?: Record<string, any>, defaults?: Record<string, any>) => void,
  cancelButton: () => void,
  mode: string
}

const ObservationButtonsComponent = (props: Props) => {

  const { t } = useTranslation()

  const createButton = (title: string, bStyle: StyleProp<ViewStyle>, onPress: () => void) => {
    return (
      <View key={title} style={Cs.observationTypeButton}>
        <Button
          buttonStyle={bStyle}
          title={title}
          onPress={() => onPress()}
        />
      </View>
    )
  }

  const createButtonList = () => {
    let lang = i18n.language
    const unitGroups = props.schema.schemas[lang]?.uiSchemaParams?.unitGroups

    if (unitGroups) {
      return unitGroups?.map((observation: Record<string, any>) =>
        createButton(
          observation.button.label.toUpperCase(),
          Bs.observationButton,
          () => props.confirmationButton(observation.rules, observation.button.default)
        )
      )
    } else {
      return createButton(
        t('add new observation').toUpperCase(),
        Bs.observationButton,
        () => props.confirmationButton()
      )
    }
  }

  const observationButtons = () => {
    if (props.mode === 'newObservation') {
      return (
        <View style={Cs.observationTypeButtonsColumn}>
          {createButtonList()}
          {createButton(t('cancel'), Bs.endButton, () => props.cancelButton())}
        </View>
      )
    }
    if (props.mode === 'changeLocation') {
      return (
        <View style={Cs.observationTypeButtonsColumn}>
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