import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
  rootState,
  DispatchType,
  setObservationId
} from '../../stores'
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

  const observationEvent = useSelector((state: rootState) => state.observationEvent)

  const dispatch: DispatchType = useDispatch()

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
          key={observation.id}
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
    return (
      <>
        <ExtendedNavBarComponent onPressMap={props.onPressMap} onPressList={undefined} onPressFinishObservationEvent={props.onPressFinishObservationEvent} />
        <View>
          {observed}
        </View>
      </>
    )
  }
}

export default ListComponent