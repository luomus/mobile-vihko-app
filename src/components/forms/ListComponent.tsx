import React, { useState, useEffect } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import SearchInput, { createFilter } from 'react-native-search-filter'
import {
  rootState,
  DispatchType,
  setObservationId
} from '../../stores'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'
import ActivityComponent from '../general/ActivityComponent'
import ExtendedNavBarComponent from '../general/ExtendedNavBarComponent'

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
    const units = observationEvent.events[observationEvent.events.length - 1].gatherings[0].units
    const filtered = units.filter((unit: Record<string, any>) => unit.id.includes('complete_list'))
    let picked: any[] = []
    let unpicked: any[] = []
    filtered.forEach((observation: Record<string, any>) => {
      if (observation.atlasCode) {
        picked.push(observation)
      } else {
        unpicked.push(observation)
      }
    })
    picked.sort((a, b) => a.identifications[0].taxon.localeCompare(b.identifications[0].taxon))
    unpicked.sort((a, b) => a.identifications[0].taxon.localeCompare(b.identifications[0].taxon))
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
          style={{ borderColor: Colors.neutral5, borderBottomWidth: 1, padding: 10 }}>
          <Text style={observation.atlasCode ? { fontWeight: 'bold', fontSize: 24 } : { fontSize: 24 }}>{observation.identifications[0].taxon}</Text>
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
        <View>
          <SearchInput
            onChangeText={(term) => { setSearch(term) }}
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