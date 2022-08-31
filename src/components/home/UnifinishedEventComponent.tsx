import React, { useState, useEffect, } from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { rootState } from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import { forms } from '../../config/fields'
import { parseDateFromDocumentToUI } from '../../helpers/dateHelper'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Os from '../../styles/OtherStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { useTranslation } from 'react-i18next'

type Props = {
  onContinueObservationEvent: (tracking: boolean) => void,
  stopObserving: () => void
}

const UnfinishedEventComponent = (props: Props) => {

  const [unfinishedEvent, setUnfinishedEvent] = useState<Record<string, any> | null>(null)

  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const observationEventInterrupted = useSelector((state: rootState) => state.observationEventInterrupted)
  const tracking = useSelector((state: rootState) => state.tracking)

  const { t } = useTranslation()

  useEffect(() => {
    setUnfinishedEvent(observationEvent.events[observationEvent.events.length - 1])
  }, [observationEvent])

  const observationCount = (): number => {
    if (!unfinishedEvent) {
      return 0
    } else if (unfinishedEvent.formID !== forms.birdAtlas) {
      return unfinishedEvent.gatherings[0].units.length
    } else {
      let sum = 0
      unfinishedEvent.gatherings[0].units.forEach((unit: Record<string, any>) => {
        if (!(unit.id.includes('complete_list') && !unit.atlasCode && !unit.count)) { sum += 1 }
      })
      return sum
    }
  }

  const displayDateTime = () => {
    if (unfinishedEvent?.gatheringEvent?.timeStart) {
      return parseDateFromDocumentToUI(unfinishedEvent.gatheringEvent.dateBegin + 'T' + unfinishedEvent.gatheringEvent.timeStart)
    } else {
      return parseDateFromDocumentToUI(unfinishedEvent?.gatheringEvent.dateBegin)
    }
  }

  if (unfinishedEvent === null) {
    return (
      <Text style={Ts.previousObservationsTitle}>{t('loading')}</Text>
    )
  } else {
    return (
      <View style={Cs.continueEventContainer}>
        <Text style={Ts.homeScreenTitle}>
          {observationEventInterrupted ?
            t('interrupted observation event') :
            t('ongoing event')
          }
        </Text>
        <Text style={Ts.unfinishedEventTextClear}>{t('started at') + ': ' + displayDateTime()}</Text>
        <Text style={Ts.unfinishedEventTextFaded}>{t('observations in list') + ': ' + observationCount() + ' ' +
          (unfinishedEvent.gatherings[0].units.length === 1 ? t('piece') : t('pieces'))}</Text>
        <View style={Cs.unfinishedEventButtonsContainer}>
          <View style={Cs.padding5Container}>
            <ButtonComponent onPressFunction={() => props.onContinueObservationEvent(tracking)} title={t('to map')}
              height={40} width={120} buttonStyle={Bs.homeTextAndIconButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={'map-outline'} iconType={'material-community'} iconSize={22} contentColor={Colors.whiteText}
            />
          </View>
          <View style={Cs.padding5Container}>
            <ButtonComponent onPressFunction={() => props.stopObserving()} title={t('stop')}
              height={40} width={120} buttonStyle={Bs.homeTextAndIconButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'stop'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
              testID={'stopFromHomeComponent'}
            />
          </View>
        </View>
        <View style={Os.horizontalLine} />
      </View>)
  }
}

export default UnfinishedEventComponent