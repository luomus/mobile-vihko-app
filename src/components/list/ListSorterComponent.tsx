import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { Picker } from '@react-native-picker/picker'
import { useTranslation } from 'react-i18next'
import { rootState } from '../../stores'
import { forms } from '../../config/fields'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

type Props = {
  setObserved: React.Dispatch<React.SetStateAction<any[] | undefined>>,
  updateList: () => void,
  observedUnedited: any[] | undefined,
  picked: Record<string, any>[],
  unpicked: Record<string, any>[],
  orderOptions: Array<string>
  order: string,
  setOrder: React.Dispatch<React.SetStateAction<string>>
}

const ListSorterComponent = (props: Props) => {

  const schema = useSelector((state: rootState) => state.schema)

  const { t } = useTranslation()

  const sortTaxonList = (itemValue: string) => {
    if (props.picked.length < 1 && props.unpicked.length < 1) return

    if ((itemValue === 'default' && schema.formID !== forms.birdAtlas) || itemValue === 'commonness') {
      if (props.observedUnedited) {
        props.setObserved(props.observedUnedited)
        props.updateList()
      }

    } else if (itemValue === 'systematic' || (itemValue === 'default' && schema.formID === forms.birdAtlas)) {
      const sortBySystematicOrder = (list: Record<string, any>[]) => {
        return list.sort((a, b) => a.taxonomicOrder - b.taxonomicOrder)
      }
      const pickedSorted = sortBySystematicOrder(props.picked)
      const unpickedSorted = sortBySystematicOrder(props.unpicked)
      props.setObserved(pickedSorted.concat(unpickedSorted))
      props.updateList()

    } else if (itemValue === 'name') {
      const sortByName = (list: Record<string, any>[]) => {
        return list.sort((a, b) => {
          const textA = a.identifications[0].taxon
            ? a.identifications[0].taxon.toLowerCase()
            : a.identifications[0].taxonVerbatim.toLowerCase()
          const textB = b.identifications[0].taxon
            ? b.identifications[0].taxon.toLowerCase()
            : b.identifications[0].taxonVerbatim.toLowerCase()
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
      }
      const pickedSorted = sortByName(props.picked)
      const unpickedSorted = sortByName(props.unpicked)
      props.setObserved(pickedSorted.concat(unpickedSorted))
      props.updateList()

    } else if (itemValue === 'scientific') {
      const sortByScientificName = (list: Record<string, any>[]) => {
        return list.sort((a, b) => {
          const textA = a.scientificName ? a.scientificName.toLowerCase() : undefined
          const textB = b.scientificName ? b.scientificName.toLowerCase() : undefined
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
      }
      const pickedSorted = sortByScientificName(props.picked)
      const unpickedSorted = sortByScientificName(props.unpicked)
      props.setObserved(pickedSorted.concat(unpickedSorted))
      props.updateList()
    }
  }

  return (
    <View style={Cs.listSorterContainer}>
      <Picker
        selectedValue={props.order}
        numberOfLines={10}
        onValueChange={itemValue => {
          props.setOrder(itemValue)
          sortTaxonList(itemValue)
        }}
      >
        {
          props.orderOptions.map(option => (
            <Picker.Item key={option} label={t(`filter.${option}`)} value={option} style={{ fontSize: 24, color: Colors.neutral6 }} />
          ))
        }
      </Picker>
    </View>
  )
}

export default ListSorterComponent