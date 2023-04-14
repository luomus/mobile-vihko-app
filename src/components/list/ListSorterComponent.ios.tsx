import React, { useEffect, useState } from 'react'
import { ActionSheetIOS, TextInput, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Os from '../../styles/OtherStyles'
import Colors from '../../styles/Colors'
import { Icon } from 'react-native-elements'

type Props = {
  setObserved: React.Dispatch<React.SetStateAction<any[] | undefined>>,
  updateList: () => void,
  observedUnedited: any[] | undefined,
  picked: Record<string, any>[],
  unpicked: Record<string, any>[],
  order: string,
  setOrder: React.Dispatch<React.SetStateAction<string>>
}

const ListSorterComponent = (props: Props) => {

  const [pickerValues, setPickerValues] = useState<Array<string>>([])
  const [dictionary, setDictionary] = useState<{ [key: string]: any }>({})

  const { t } = useTranslation()

  useEffect(() => {
    props.setOrder(t('filter.default'))
    setPickerValues([t('filter.default'), t('filter.name'), t('filter.scientific')])
    setDictionary({
      default: t('filter.default'),
      name: t('filter.name'),
      scientific: t('filter.scientific')
    })
  }, [])

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
          const textA = a.identifications[0].taxon
          const textB = b.identifications[0].taxon
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
          const textA = a.scientificName
          const textB = b.scientificName
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
      }
      const pickedSorted = sortByScientificName(props.picked)
      const unpickedSorted = sortByScientificName(props.unpicked)
      props.setObserved(pickedSorted.concat(unpickedSorted))
      props.updateList()
    }
  }

  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: pickerValues,
        userInterfaceStyle: 'dark'
      },
      buttonIndex => {
        props.setOrder(pickerValues[buttonIndex])
        const pickerValue = Object.keys(dictionary).find(key => dictionary[key] === pickerValues[buttonIndex])
        if (pickerValue === undefined) return
        sortTaxonList(pickerValue)
      }
    )

  return (
    <View style={Cs.listSorterContainer}>
      <TouchableOpacity onPress={() => onPress()} style={Cs.iOSPickerContainer}>
        <TextInput
          style={Os.iOSListSorter}
          value={props.order}
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