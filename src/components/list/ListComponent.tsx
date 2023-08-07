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
  setListOrder,
  setObservationId
} from '../../stores'
import LoadingComponent from '../general/LoadingComponent'
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
import useChange from '../../helpers/useChange'

type Props = {
  onPressMap: () => void,
  onPressObservation: (sourcePage: string) => void,
  onPressFinishObservationEvent: (sourcePage: string) => void,
  navigation: NativeStackNavigationProp<ParamListBase, string>
}

const ListComponent = (props: Props) => {

  const textInput = useRef<TextInput | null>(null)

  const grid = useSelector((state: rootState) => state.grid)
  const listOrder = useSelector((state: rootState) => state.listOrder)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const schema = useSelector((state: rootState) => state.schema)

  const [observed, setObserved] = useState<any[] | undefined>(undefined)
  const [observedUnedited, setObservedUnedited] = useState<any[] | undefined>(undefined)
  const [filteredObservations, setFilteredObservations] = useState<any[] | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [taxaOnMap, setTaxaOnMap] = useState<string[]>([])
  const [picked, setPicked] = useState<Record<string, any>[]>([])
  const [unpicked, setUnpicked] = useState<Record<string, any>[]>([])
  const [search, setSearch] = useState<string>('')

  const dispatch: DispatchType = useDispatch()

  const getTaxonID = (unit: Record<string, any>) => {
    if (schema.formID === forms.birdAtlas || !unit.id.includes('complete_list')) {
      return unit.unitFact?.autocompleteSelectedTaxonID
        ? unit.unitFact.autocompleteSelectedTaxonID
        : undefined
    } else {
      return unit.identifications[0].taxonID
    }
  }

  const getTaxonName = (unit: Record<string, any>) => {
    if (schema.formID === forms.birdAtlas) {
      return unit.identifications[0].taxon
    } else {
      return unit.identifications[0].taxonVerbatim
    }
  }

  useEffect(() => {
    const units: Record<string, any>[] = observationEvent.events[observationEvent.events.length - 1]?.gatherings[0]?.units
    if (units === undefined) { return }

    const filtered: Record<string, any>[] = units.filter((unit: Record<string, any>) => unit.id.includes('complete_list'))

    const taxaOnMap: string[] = units
      .filter((unit: Record<string, any>) => !unit.id.includes('complete_list'))
      .map((unit: Record<string, any>) => getTaxonID(unit))
    setTaxaOnMap(taxaOnMap)

    const pickedTemp: Record<string, any>[] = []
    const unpickedTemp: Record<string, any>[] = []

    filtered.forEach((observation: Record<string, any>) => {
      if (observation.atlasCode || observation.count || taxaOnMap.includes(getTaxonID(observation))) {
        pickedTemp.push(observation)
      } else {
        unpickedTemp.push(observation)
      }
    })

    const combined = pickedTemp.concat(unpickedTemp)

    setPicked(pickedTemp)
    setUnpicked(unpickedTemp)
    setObserved(combined)
    setObservedUnedited(combined)

    if (listOrder.class === '') {
      dispatch(setListOrder({ class: schema.formID === forms.birdAtlas ? 'systematic' : 'commonness' }))
    }
  }, [observationEvent])

  useChange(() => {
    updateList()
  }, [search, observed])

  const updateList = () => {
    if (!observed) {
      return
    } else if (listOrder.class === 'scientific' || listOrder.class === 'scientific-systematic') {
      setFilteredObservations(observed.filter(createFilter(search, ['scientificName'])))
    } else {
      setFilteredObservations(observed.filter(createFilter(search,
        schema.formID === forms.birdAtlas
          ? ['identifications.0.taxon']
          : ['identifications.0.taxonVerbatim']
      )))
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
      <Text
        style={(item.atlasCode || item.count || taxaOnMap.includes(getTaxonID(item))) ? Ts.listBoldText : Ts.listText}
        numberOfLines={1}
      >
        {(listOrder.class !== 'scientific' && listOrder.class !== 'scientific-systematic') ? getTaxonName(item) : item.scientificName}
      </Text>
      {
        item.atlasCode ?
          <AtlasCodeStampComponent onPress={() => null} atlasKey={item.atlasCode} />
          : item.count ?
            <Text style={Ts.listCountText}>
              {item.count.length > 8 ? item.count.substring(0, 5) + '...' : item.count}
            </Text>
            : taxaOnMap.includes(getTaxonID(item)) ?
              <Icon
                type={'material-icons'}
                name={'location-pin'}
                size={30}
                color={Colors.neutral5}
                containerStyle={{ paddingRight: 30 }}
              />
              : null
      }
    </TouchableOpacity>
  )

  const ListHeader = (
    <>
      <ListSorterComponent
        setObserved={setObserved}
        updateList={updateList}
        observedUnedited={observedUnedited}
        picked={picked}
        unpicked={unpicked}
      />
      <ListFilterComponent
        search={search}
        setSearch={setSearch}
        textInput={textInput}
        navigation={props.navigation}
      />
    </>
  )

  if (!observed || loading) {
    return (
      <LoadingComponent text={'loading'} />
    )
  } else {
    return (
      <>
        <ExtendedNavBarComponent onPressMap={props.onPressMap} onPressList={undefined}
          onPressFinishObservationEvent={props.onPressFinishObservationEvent} setLoading={setLoading} />
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