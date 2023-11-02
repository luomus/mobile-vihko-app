import React from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import uuid from 'react-native-uuid'
import ButtonComponent from '../general/ButtonComponent'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { rootState } from '../../stores'
import { listOfHaversineNeighbors } from '../../helpers/geometryHelper'
import { useUiSchemaFields, lolifeObservationTypes } from '../../config/fields'
import i18n from '../../languages/i18n'

interface BasicObject {
  [key: string]: any
}

type Props = {
  confirmationButton: (rules?: Record<string, any>, defaults?: Record<string, any>, sourcePage?: string) => void,
  cancelButton: () => void,
  mode: string,
  openModal: (units: Array<Record<string, any>>) => void,
  shiftToEditPage: (unitId: string) => void
}

const ObservationButtonsComponent = (props: Props) => {

  const observation = useSelector((state: rootState) => state.observation)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const region = useSelector((state: rootState) => state.region)
  const schema = useSelector((state: rootState) => state.schema)

  const { t } = useTranslation()

  const createButton = (title: string, buttonStyle: StyleProp<ViewStyle>, onPress: () => void, styleType: string,
    iconName: string | undefined, iconType: string | undefined, width: number | undefined, textWidth?: number | undefined) => {
    return (
      <ButtonComponent onPressFunction={() => onPress()} title={title}
        height={40} width={width} buttonStyle={buttonStyle}
        gradientColorStart={styleType === 'primary' ? Colors.primaryButton1 : Colors.neutralButton}
        gradientColorEnd={styleType === 'primary' ? Colors.primaryButton2 : Colors.neutralButton}
        shadowColor={styleType === 'primary' ? Colors.primaryShadow : Colors.neutralShadow}
        textStyle={Ts.buttonText} iconName={iconName} iconType={iconType} iconSize={22}
        contentColor={styleType === 'primary' ? Colors.whiteText : Colors.darkText}
        textWidth={textWidth} key={uuid.v4().toString()}
      />
    )
  }

  const createLeftSideButtonsList = () => {
    const units: BasicObject[] = observationEvent.events?.[observationEvent.events.length - 1]
      .gatherings[0].units
    const haversineNeighbors: Array<Record<string, any>> = listOfHaversineNeighbors(units, region, observation)

    if (haversineNeighbors.length >= 4) {
      return (
        <View style={Cs.leftButtonColumnContainer}>
          <Text style={Ts.mapButtonsLeftTitle}>{t('edit observations')}:</Text>
          {createButton(
            haversineNeighbors.length + ' ' + t('observation count'),
            Bs.observationNeighborsButton,
            () => props.openModal(haversineNeighbors),
            'primary', 'edit', 'material-icons', 150
          )}
        </View>
      )
    } else if (haversineNeighbors.length >= 1) {
      if (useUiSchemaFields.includes(schema.formID)) {
        return (
          <View style={Cs.leftButtonColumnContainer}>
            <Text style={Ts.mapButtonsLeftTitle}>{t('edit observations')}:</Text>
            {haversineNeighbors?.map((neighbor: Record<string, any>) => {

              const rulesField = neighbor.rules.field
              const typeName = lolifeObservationTypes[rulesField] ? t(lolifeObservationTypes[rulesField]) : t('flying squirrel')

              return createButton(
                typeName.length > 14 ? typeName.substring(0, 12) + '...' : typeName,
                Bs.observationNeighborsButton,
                () => props.shiftToEditPage(neighbor.id),
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
                neighbor.identifications[0].taxon ? neighbor.identifications[0].taxon : neighbor.identifications[0].taxonVerbatim,
                Bs.observationNeighborsButton,
                () => props.shiftToEditPage(neighbor.id),
                'primary', 'edit', 'material-icons', 150, 110,
              )
            )}
          </View>
        )
      }
    }
  }

  const createRightSideButtonsList = () => {
    const lang = i18n.language
    const unitGroups = schema[lang]?.uiSchemaParams?.unitGroups

    return unitGroups ? unitGroups.map((observation: Record<string, any>) =>
      createButton(
        '+ ' + observation.button.label,
        Bs.observationButton,
        () => props.confirmationButton(observation.rules, observation.button.default, 'map'),
        'primary', undefined, undefined, undefined
      )
    ) : createButton(
      '+ ' + t('observation'),
      Bs.observationButton,
      () => props.confirmationButton(undefined, undefined, 'map'),
      'primary', undefined, undefined, undefined
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
              'neutral', undefined, undefined, undefined
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
            () => props.confirmationButton(undefined, undefined, 'map'),
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