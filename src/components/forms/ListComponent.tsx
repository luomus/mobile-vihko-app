import React, { useState, useEffect, useRef } from 'react'
import { FlatList, ListRenderItem, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
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

type Props = {
  onPressMap: () => void,
  onPressObservation: (sourcePage: string) => void,
  onPressFinishObservationEvent: (sourcePage: string) => void,
  navigation: NativeStackNavigationProp<ParamListBase, string>
}

const ListComponent = (props: Props) => {

  const [observed, setObserved] = useState<any[] | undefined>(undefined)
  const [taxaOnMap, setTaxaOnMap] = useState<string[]>([])
  const [search, setSearch] = useState<string>('')

  const textInput = useRef<TextInput | null>(null)

  const grid = useSelector((state: rootState) => state.grid)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const schema = useSelector((state: rootState) => state.schema)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  useEffect(() => {
    const units: Record<string, any>[] = observationEvent.events[observationEvent.events.length - 1]?.gatherings[0]?.units
    if (units === undefined) { return }

    const filtered: Record<string, any>[] = units.filter((unit: Record<string, any>) => unit.id.includes('complete_list'))

    const taxaOnMap: string[] = units
      .filter((unit: Record<string, any>) => !unit.id.includes('complete_list'))
      .map((unit: Record<string, any>) => unit.identifications[0].taxon)
    setTaxaOnMap(taxaOnMap)

    let picked: Record<string, any>[] = []
    let unpicked: Record<string, any>[] = []

    filtered.forEach((observation: Record<string, any>) => {
      if (observation.atlasCode || observation.count || taxaOnMap.includes(observation.identifications[0].taxon)) {
        picked.push(observation)
      } else {
        unpicked.push(observation)
      }
    })

    let combined = picked.concat(unpicked)
    setObserved(combined)
  }, [observationEvent])

  //opens the keyboard when returning from ObservationComponent
  useEffect(() => {
    if (textInput.current) {
      const openKeyboard = props.navigation.addListener('focus', () => {
        setTimeout(() => {
          textInput.current?.focus()
        }, 1000)
      })

      return openKeyboard
    }
  }, [props.navigation, textInput.current])

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
      <Text style={(item.atlasCode || item.count) ? Ts.listBoldText : Ts.listText}>
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
    <View style={Cs.listFilterContainer}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder={t('filter species')}
        style={Cs.listFilterInput}
        ref={textInput}
      />
      <Icon
        name='cancel'
        type='material-icons'
        color={Colors.dangerButton2}
        size={26}
        onPress={() => {
          textInput.current?.blur()
          setSearch('')
          textInput.current?.focus()
        }}
        iconStyle={Cs.listFilterIcon}
        tvParallaxProperties={undefined}
      />
    </View>
  )

  if (!observed) {
    return (
      <ActivityComponent text={'loading'} />
    )
  } else {
    const filteredObservations = observed.filter(createFilter(search, ['identifications.0.taxon']))
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
      </>
    )
  }
}

export default ListComponent