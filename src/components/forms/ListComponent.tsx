import React, { useState, useEffect, useRef } from 'react'
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'
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
import ExtendedNavBarComponent from '../general/ExtendedNavBarComponent'
import AtlasCodeStampComponent from '../general/AtlasCodeStampComponent'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'

type Props = {
  onPressMap: () => void,
  onPressObservation: (sourcePage: string) => void,
  onPressFinishObservationEvent: (sourcePage: string) => void,
  navigation: NativeStackNavigationProp<ParamListBase, string>
}

const ListComponent = (props: Props) => {

  const [observed, setObserved] = useState<any[] | undefined>(undefined)
  const [search, setSearch] = useState<string>('')

  const textInput = useRef<TextInput | null>(null)

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

  const renderBird = ({ item }) => (
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
      </>
    )
  }
}

export default ListComponent