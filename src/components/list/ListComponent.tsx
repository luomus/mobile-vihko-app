import React, { useState, useEffect, useRef } from 'react'
import { FlatList, ListRenderItem, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { createFilter } from 'react-native-search-filter'
import { Icon } from 'react-native-elements'
import { ParamListBase } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {
  rootState,
  DispatchType,
  setObservationId
} from '../../stores'
import ActivityComponent from '../general/ActivityComponent'
import AtlasCodeStampComponent from '../general/AtlasCodeStampComponent'
import ExtendedNavBarComponent from '../general/ExtendedNavBarComponent'
import GridWarningComponent from '../general/GridWarningComponent'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { forms } from '../../config/fields'
import ListSorterComponent from './ListSorterComponent'
import ListFilterComponent from './ListFilterComponent'
import MessageComponent from '../general/MessageComponent'

type Props = {
  onPressMap: () => void,
  onPressObservation: (sourcePage: string) => void,
  onPressFinishObservationEvent: (sourcePage: string) => void,
  navigation: NativeStackNavigationProp<ParamListBase, string>
}

const ListComponent = (props: Props) => {

  const [observed, setObserved] = useState<any[] | undefined>(undefined)
  const [observedUnedited, setObservedUnedited] = useState<any[] | undefined>(undefined)
  const [filteredObservations, setFilteredObservations] = useState<any[] | undefined>(undefined)
  const [taxaOnMap, setTaxaOnMap] = useState<string[]>([])
  const [picked, setPicked] = useState<Record<string, any>[]>([])
  const [unpicked, setUnpicked] = useState<Record<string, any>[]>([])
  const [search, setSearch] = useState<string>('')

  const textInput = useRef<TextInput | null>(null)

  const grid = useSelector((state: rootState) => state.grid)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const schema = useSelector((state: rootState) => state.schema)

  const dispatch: DispatchType = useDispatch()

  useEffect(() => {
    const units: Record<string, any>[] = observationEvent.events[observationEvent.events.length - 1]?.gatherings[0]?.units
    if (units === undefined) { return }

    const filtered: Record<string, any>[] = units.filter((unit: Record<string, any>) => unit.id.includes('complete_list'))

    const taxaOnMap: string[] = units
      .filter((unit: Record<string, any>) => !unit.id.includes('complete_list'))
      .map((unit: Record<string, any>) => unit.identifications[0].taxon)
    setTaxaOnMap(taxaOnMap)

    let pickedTemp: Record<string, any>[] = []
    let unpickedTemp: Record<string, any>[] = []

    filtered.forEach((observation: Record<string, any>) => {
      if (observation.atlasCode || observation.count || taxaOnMap.includes(observation.identifications[0].taxon)) {
        pickedTemp.push(observation)
      } else {
        unpickedTemp.push(observation)
      }
    })

    let combined = pickedTemp.concat(unpickedTemp)

    setPicked(pickedTemp)
    setUnpicked(unpickedTemp)
    setObserved(combined)
    setObservedUnedited(combined)
  }, [observationEvent])

  useEffect(() => {
    updateList()
  }, [search, observed])

  const updateList = () => {
    if (!observed) return
    else {
      setFilteredObservations(observed.filter(createFilter(search, ['identifications.0.taxon'])))
    }
  }

  const renderBird: ListRenderItem<any> = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        const event = observationEvent.events[observationEvent.events.length - 1].id
        const unitIdentifier = item.id
        dispatch(setObservationId({
          eventId: event,
          unitId: unitIdentifier
        }))
        props.onPressObservation('list')
        textInput?.current?.clear()
        setSearch('')
      }}
      key={item.key}
      style={Cs.listElementContainer}
    >
      <Text style={(item.atlasCode || item.count || taxaOnMap.includes(item.identifications[0].taxon)) ?
        Ts.listBoldText : Ts.listText}>
        {item.identifications[0].taxon}
      </Text>
      {
        item.atlasCode ?
          <AtlasCodeStampComponent onPress={() => null} atlasKey={item.atlasCode} />
          : item.count ?
            <Text style={Ts.listBoldCenteredText}>
              {item.count.length > 6 ? item.count.substring(0, 5) + '...' : item.count}
            </Text>
            : taxaOnMap.includes(item.identifications[0].taxon) ?
              <Icon
                type={'material-icons'}
                name={'location-pin'}
                size={30}
                color={Colors.neutral5}
                tvParallaxProperties={undefined}
              />
              : null
      }
    </TouchableOpacity>
  )

  const ListHeader = (
    <>
      <ListFilterComponent
        search={search}
        setSearch={setSearch}
        textInput={textInput}
        navigation={props.navigation}
      />
      <ListSorterComponent
        setObserved={setObserved}
        updateList={updateList}
        observedUnedited={observedUnedited}
        picked={picked}
        unpicked={unpicked}
      />
    </>
  )

  if (!observed) {
    return (
      <ActivityComponent text={'loading'} />
    )
  } else {
    return (
      <>
        <ExtendedNavBarComponent onPressMap={props.onPressMap} onPressList={undefined} onPressFinishObservationEvent={props.onPressFinishObservationEvent} />
        <View style={Cs.listContainer}>
          <FlatList
            data={filteredObservations}
            renderItem={renderBird}
            ListHeaderComponent={ListHeader}
            keyboardShouldPersistTaps={'always'}
          />
        </View>
        {schema.formID === forms.birdAtlas && grid?.pauseGridCheck ?
          <GridWarningComponent />
          : null
        }
        <MessageComponent />
      </>
    )
  }
}

export default ListComponent