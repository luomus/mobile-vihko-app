import React, { useState } from 'react'
import { View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

type Props = {
  setObserved: React.Dispatch<React.SetStateAction<any[] | undefined>>,
  updateList: () => void,
  observedUnedited: any[] | undefined,
  picked: Record<string, any>[],
  unpicked: Record<string, any>[]
}

const ListSorterComponent = (props: Props) => {
  const [selected, setSelected] = useState('default')

  const { t } = useTranslation()

  const sortTaxonList = (itemValue: string) => {
    if (props.picked.length < 1 && props.unpicked.length < 1) return

    if (itemValue === 'default') {
      if (props.observedUnedited) {
        props.setObserved(props.observedUnedited)
        props.updateList()
      }

    // } else if (itemValue === 'systematic') {

    } else if (itemValue === 'name') {
      const sortByName = (list: Record<string, any>[]) => {
        return list.sort((a, b) => {
          const textA = a.identifications[0].taxon;
          const textB = b.identifications[0].taxon;
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
      }
      const pickedSorted = sortByName(props.picked)
      const unpickedSorted = sortByName(props.unpicked)
      props.setObserved(pickedSorted.concat(unpickedSorted))
      props.updateList()

    } else if (itemValue === 'scientific') {
      const sortByScientificName = (list: Record<string, any>[]) => {
        return list.sort((a, b) => {
          const textA = a.scientificName;
          const textB = b.scientificName;
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
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
        selectedValue={selected}
        numberOfLines={10}
        onValueChange={itemValue => {
          setSelected(itemValue)
          sortTaxonList(itemValue)
        }}
      >
        <Picker.Item label={t('filter.default')} value='default' style={{ fontSize: 24, color: Colors.neutral6 }} />
        {/* <Picker.Item label={t('filter.systematic')} value='systematic' style={{ fontSize: 24, color: Colors.neutral6 }} /> */}
        <Picker.Item label={t('filter.name')} value='name' style={{ fontSize: 24, color: Colors.neutral6 }} />
        <Picker.Item label={t('filter.scientific')} value='scientific' style={{ fontSize: 24, color: Colors.neutral6 }} />
      </Picker>
    </View>
  )
}

export default ListSorterComponent