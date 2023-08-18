import React, { useEffect } from 'react'
import { ActionSheetIOS, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DispatchType, rootState, setListOrder } from '../../stores'
import Cs from '../../styles/ContainerStyles'
import Os from '../../styles/OtherStyles'
import Colors from '../../styles/Colors'
import { Icon } from 'react-native-elements'

type Props = {
  setObserved: React.Dispatch<React.SetStateAction<any[] | undefined>>,
  observedUnedited: any[] | undefined,
  picked: Record<string, any>[],
  unpicked: Record<string, any>[]
}

const ListSorterComponent = (props: Props) => {

  const listOrder = useSelector((state: rootState) => state.listOrder)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  const dictionary: { [key: string]: any } = {
    commonness: t('filter.commonness'),
    systematic: t('filter.systematic'),
    name: t('filter.name'),
    scientific: t('filter.scientific'),
    'scientific-systematic': t('filter.scientific-systematic')
  }

  useEffect(() => {
    sortTaxonList(listOrder.class)
  }, [listOrder])

  const sortTaxonList = (itemValue: string) => {
    if (props.picked.length < 1 && props.unpicked.length < 1) return

    if (itemValue === 'commonness') {
      if (props.observedUnedited) {
        props.setObserved(props.observedUnedited)
      }

    } else if (itemValue === 'systematic') {
      const sortBySystematicOrder = (list: Record<string, any>[]) => {
        return list.sort((a, b) => a.taxonomicOrder - b.taxonomicOrder)
      }
      const pickedSorted = sortBySystematicOrder(props.picked)
      const unpickedSorted = sortBySystematicOrder(props.unpicked)
      props.setObserved(pickedSorted.concat(unpickedSorted))

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

    } else if (itemValue === 'scientific-systematic') {
      const sortBySystematicOrder = (list: Record<string, any>[]) => {
        return list.sort((a, b) => a.taxonomicOrder - b.taxonomicOrder)
      }
      const pickedSorted = sortBySystematicOrder(props.picked)
      const unpickedSorted = sortBySystematicOrder(props.unpicked)
      props.setObserved(pickedSorted.concat(unpickedSorted))
    }
  }

  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: Object.values(dictionary),
        userInterfaceStyle: 'dark'
      },
      buttonIndex => dispatch(setListOrder({ class: Object.keys(dictionary)[buttonIndex] }))
    )

  return (
    <View style={Cs.listSorterContainer}>
      <TouchableOpacity onPress={() => onPress()} style={Cs.iOSPickerContainer}>
        <TextInput
          style={Os.iOSListSorter}
          value={dictionary[listOrder.class]}
          editable={false}
          onPressOut={() => onPress()}
          multiline
        />
        <Icon
          name='arrow-drop-down'
          type='material-icons'
          color={Colors.neutral7}
          size={22}
        />
      </TouchableOpacity>
    </View>
  )
}

export default ListSorterComponent