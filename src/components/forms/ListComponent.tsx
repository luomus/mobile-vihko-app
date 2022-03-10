import React, { useState, useEffect } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import SearchInput, { createFilter } from 'react-native-search-filter'
import { Icon } from 'react-native-elements'
import {
  rootState,
  DispatchType,
  setObservationId
} from '../../stores'
import ActivityComponent from '../general/ActivityComponent'
import ExtendedNavBarComponent from '../general/ExtendedNavBarComponent'
import AtlasCodeStampComponent from '../general/AtlasCodeStampComponent'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'

type Props = {
  onPressMap: () => void,
  onPressObservation: (sourcePage: string) => void,
  onPressFinishObservationEvent: (sourcePage: string) => void
}

const ListComponent = (props: Props) => {

  const [observed, setObserved] = useState<JSX.Element[] | undefined>(undefined)
  const [search, setSearch] = useState<string>('')

  const observationEvent = useSelector((state: rootState) => state.observationEvent)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  useEffect(() => {
    const units = observationEvent.events[observationEvent.events.length - 1]?.gatherings[0]?.units
    if (units === undefined) { return }
    const filtered = units.filter((unit: Record<string, any>) => unit.id.includes('complete_list'))
    let picked: any[] = []
    let unpicked: any[] = []
    filtered.forEach((observation: Record<string, any>) => {
      if (observation.atlasCode || observation.count) {
        picked.push(observation)
      } else {
        unpicked.push(observation)
      }
    })
    let combined = picked.concat(unpicked)
    let elements = combined.map((observation) => {
      return (
        <TouchableOpacity
          onPress={() => {
            const event = observationEvent.events[observationEvent.events.length - 1].id
            const unitIdentifier = observation.id
            dispatch(setObservationId({
              eventId: event,
              unitId: unitIdentifier
            }))
            props.onPressObservation('list')
          }}
          key={observation.identifications[0].taxon}
          style={Cs.listElementContainer}
        >
          <Text style={(observation.atlasCode || observation.count) ? Ts.listBoldText : Ts.listText}>
            {observation.identifications[0].taxon}
          </Text>
          {
            observation.atlasCode ?
              <AtlasCodeStampComponent onPress={() => null} atlasKey={observation.atlasCode} />
              : observation.count ?
                <Text style={Ts.listBoldCenteredText}>
                  { observation.count.length > 6 ? observation.count.substring(0, 5) + '...' : observation.count}
                </Text>
                : null
          }
        </TouchableOpacity>
      )
    })
    setObserved(elements)
  }, [observationEvent])

  if (!observed) {
    return (
      <ActivityComponent text={'loading'} />
    )
  } else {
    const filteredObservations = observed.filter(createFilter(search, ['key']))
    return (
      <>
        <ExtendedNavBarComponent onPressMap={props.onPressMap} onPressList={undefined} onPressFinishObservationEvent={props.onPressFinishObservationEvent} />
        <View style={{ flex: 1 }}>
          <SearchInput
            onChangeText={(term) => { setSearch(term) }}
            clearIcon={<Icon
              name='cancel'
              type='material-icons'
              color={Colors.dangerButton2}
              size={26}
            />}
            clearIconViewStyles={Cs.clearIconContainer}
            style={Cs.listFilterContainer}
            placeholder={t('filter species')}
          />
          <ScrollView>
            {filteredObservations}
          </ScrollView>
        </View>
      </>
    )
  }
}

export default ListComponent