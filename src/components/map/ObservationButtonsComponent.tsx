import React from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import ButtonComponent from '../general/ButtonComponent'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { rootState } from '../../stores'
import { listOfHaversineNeighbors } from '../../helpers/geometryHelper'
import { forms, useUiSchemaFields, lolifeObservationTypes } from '../../config/fields'
import i18n from '../../languages/i18n'

interface BasicObject {
  [key: string]: any
}

type Props = {
  confirmationButton: (isNew: boolean, rules?: Record<string, any>, defaults?: Record<string, any>, sourcePage?: string) => void,
  cancelButton: () => void,
  mode: string,
  openModal: (units: Array<Record<string, any>>, eventId: string) => void,
  shiftToEditPage: (eventId: string, unitId: string) => void
}

const ObservationButtonsComponent = (props: Props) => {

  const observation = useSelector((state: rootState) => state.observation)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const region = useSelector((state: rootState) => state.region)
  const schema = useSelector((state: rootState) => state.schema)

  const { t } = useTranslation()

  const createButton = (title: string, buttonStyle: StyleProp<ViewStyle>, onPress: () => void, styleType: string,
    iconName: string | undefined, iconType: string | undefined, width: number) => {
    return (
      <View key={title} style={Cs.padding5Container}>
        <ButtonComponent onPressFunction={() => onPress()} title={title}
          height={40} width={width} buttonStyle={buttonStyle}
          gradientColorStart={styleType === 'primary' ? Colors.primaryButton1 : Colors.neutralButton}
          gradientColorEnd={styleType === 'primary' ? Colors.primaryButton2 : Colors.neutralButton}
          shadowColor={styleType === 'primary' ? Colors.primaryShadow : Colors.neutralShadow}
          textStyle={Ts.buttonText} iconName={iconName} iconType={iconType} iconSize={22}
          contentColor={styleType === 'primary' ? Colors.whiteText : Colors.darkText}
        />
      </View>
    )
  }

  const createLeftSideButtonsList = () => {
    const units: BasicObject[] = observationEvent.events?.[observationEvent.events.length - 1]
      .gatherings[0].units
    const haversineNeighbors: Array<Record<string, any>> = listOfHaversineNeighbors(units, region, observation)
    const eventId: string = observationEvent.events?.[observationEvent.events.length - 1].id

    if (haversineNeighbors.length >= 4) {
      return (
        (
          <View style={Cs.leftButtonColumnContainer}>
            <Text style={Ts.mapButtonsLeftTitle}>{t('edit observations')}:</Text>
            {createButton(
              haversineNeighbors.length + ' ' + t('observation count'),
              Bs.observationNeighborsButton,
              () => props.openModal(haversineNeighbors, eventId),
              'neutral', 'edit', 'material-icons', 150
            )}
          </View>
        )
      )
    } else if (haversineNeighbors.length >= 1) {
      if (useUiSchemaFields.includes(schema.formID)) {
        return (
          <View style={Cs.leftButtonColumnContainer}>
            <Text style={Ts.mapButtonsLeftTitle}>{t('edit observations')}:</Text>
            {haversineNeighbors?.map((neighbor: Record<string, any>) => {

              const rulesField = neighbor.rules.field
              let typeName = lolifeObservationTypes[rulesField] ? t(lolifeObservationTypes[rulesField]) : t('flying squirrel')

              return createButton(
                typeName.length > 14 ? typeName.substring(0, 12) + '...' : typeName,
                Bs.observationNeighborsButton,
                () => props.shiftToEditPage(eventId, neighbor.id),
                'primary', 'edit', 'material-icons', 150
              )
            })}
          </View>
        )
      } else {
        return (
          <View style={Cs.leftButtonColumnContainer}>
            <Text style={Ts.mapButtonsLeftTitle}>{t('edit observations')}:</Text>
            {haversineNeighbors?.map((neighbor: Record<string, any>) =>
              createButton(
                neighbor.identifications[0].taxon.length > 14 ? neighbor.identifications[0].taxon.substring(0, 12) + '...' : neighbor.identifications[0].taxon,
                Bs.observationNeighborsButton,
                () => props.shiftToEditPage(eventId, neighbor.id),
                'primary', 'edit', 'material-icons', 150
              )
            )}
          </View>
        )
      }
    }
  }

  const createRightSideButtonsList = () => {
    let lang = i18n.language
    const unitGroups = schema[lang]?.uiSchemaParams?.unitGroups

    return unitGroups ? unitGroups.map((observation: Record<string, any>) =>
      createButton(
        observation.button.label,
        Bs.observationButton,
        () => props.confirmationButton(true, observation.rules, observation.button.default, 'map'),
        'primary', undefined, undefined, 180
      )
    ) : createButton(
      '+ ' + t('observation'),
      Bs.observationButton,
      () => props.confirmationButton(true, undefined, undefined, 'map'),
      'primary', undefined, undefined, 120
    )
  }

  const observationButtons = () => {
    if (props.mode === 'newObservation') {
      return (
        <View style={Cs.observationButtonColumnsContainer}>
          {createLeftSideButtonsList() ? createLeftSideButtonsList() : <View></View>}
          <View style={Cs.rightButtonColumnContainer}>
            {createRightSideButtonsList()}
            {createButton(
              t('cancel'),
              Bs.homeTextAndIconButton,
              () => props.cancelButton(),
              'neutral', undefined, undefined, schema.formID === forms.lolife ? 180 : 120
            )}
          </View>
        </View>
      )
    }
    if (props.mode === 'changeLocation') {
      return (
        <View style={Cs.rightButtonColumnContainer}>
          {createButton(
            t('save'),
            Bs.observationButton,
            () => props.confirmationButton(true, undefined, undefined, 'map'),
            'primary', undefined, undefined, 120
          )}
          {createButton(
            t('cancel'),
            Bs.homeTextAndIconButton,
            () => props.cancelButton(),
            'neutral', undefined, undefined, 120
          )}
        </View>
      )
    }
  }

  return (
    <View style={Cs.observationButtonsBaseContainer}>
      {observationButtons()}
    </View>
  )
}

export default ObservationButtonsComponent