import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { getTaxonAutocomplete } from '../controllers/autocompleteController'
import Autocomplete from 'react-native-autocomplete-input'
import Cs from '../styles/ContainerStyles'
import Colors from '../styles/Colors'
import { TextInput } from 'react-native-gesture-handler'
import { get } from 'lodash'
import { Canceler } from 'axios'

export interface AutocompleteParams {
  target: string,
  valueField: string,
  transform: Record<string, string>
}

interface Props {
  title: string,
  defaultValue: string,
  register: Function,
  setValue: Function,
  watch: Function,
  unregister: Function,
  autocompleteParams: AutocompleteParams,
  lang: string
}

const FormAutocompleteComponent = (props: Props) => {
  const [query, setQuery] = useState<string>(props.defaultValue)
  const [oldQuery, setOldQuery] = useState<string>(props.defaultValue)
  const [options, setOptions] = useState<Record<string, any>[]>([])
  const [hideResult, setHideResult] = useState<boolean>(true)
  const [selected, setSelected] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { target, valueField, transform } = props.autocompleteParams
  let cancel: Canceler | undefined

  useEffect(() => {
    let allFound = true
    const transformKeys = Object.keys(transform)
    const registeredFields = Object.keys(props.watch())

    transformKeys.forEach(key => {
      if (transform[key] === valueField && props.defaultValue === '') {
        allFound = false
      } else if (transform[key] !== valueField && !registeredFields.includes(transform[key])) {
        allFound = false
      }
    })

    if (allFound) {
      setSelected(true)
    }
  }, [])

  const wipeOldSelection = () => {
    Object.keys(transform).forEach(key => {
      props.unregister(transform[key])
    })
  }

  const mapInformalTaxonGroups = (informalTaxonGroups: Record<string, any>) => {
    return informalTaxonGroups.map((group: any) => {
      return typeof group === 'string' ? group : group.id
    })
  }

  const addSelectionToForm = (item: Record<string, any>) => {

    Object.keys(transform).forEach(key => {
      props.register({ name: transform[key] })

      if (key.includes('informalTaxonGroup')) {
        props.setValue(transform[key], mapInformalTaxonGroups(get(item, key.split('_'))))
      } else {
        props.setValue(transform[key], get(item, key.split('_')))
      }
    })
  }

  const onQueryChange = async (text: string) => {
    if (cancel) {
      cancel()
    }

    if (selected) {
      wipeOldSelection()
      props.register({ name: valueField })
      setSelected(false)
    }

    setQuery(text)
    setHideResult(false)

    props.setValue(valueField, text)


    try {
      setLoading(true)

      let res = await getTaxonAutocomplete(target, text.toLowerCase(), props.lang, cancel)

      setOptions(removeDuplicates(res.result))
      setOldQuery(res.query)

      if (res.result[0]?.payload?.matchType === 'exactMatches') {
        setSelected(true)
        addSelectionToForm(res.result[0])
      }

      cancel = undefined
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const removeDuplicates = (options: Record<string, any>[]) => {
    return options.filter((outer, index) => {
      return options.findIndex(inner => outer.key === inner.key) === index
    })
  }

  const onSelection = (item: Record<string, any>) => {
    setQuery(item.value)
    setSelected(true)
    setHideResult(true)

    addSelectionToForm(item)
  }

  const onFocus = () => {
    setHideResult(false)
  }

  const onBlur = () => {
    setHideResult(true)
  }

  const renderedItem = (item: Record<string, any>) => {
    const addBolding = (name: string, query: string, isScientific: boolean) => {
      const startIndex = name.toLowerCase().indexOf(query)
      const endIndex = startIndex + query.length
      const text: Element[] = []

      if (startIndex === 0 && isScientific) {
        const cappedQuery = query.charAt(0).toUpperCase() + query.slice(1)

        text.push(<Text style={{ fontWeight: 'bold' }}>{cappedQuery}</Text>)
      } else if (startIndex === 0) {
        text.push(<Text style={{ fontWeight: 'bold' }}>{query}</Text>)
      } else {
        text.push(<Text>{name.slice(0, startIndex)}</Text>)
        text.push(<Text style={{ fontWeight: 'bold' }}>{query}</Text>)
      }

      if (endIndex !== name.length - 1) {
        text.push(<Text>{name.slice(endIndex)}</Text>)
      }

      return text
    }

    if (item?.payload?.nameType === 'MX.scientificName') {
      return (
        <View>
          <Text style={{ fontStyle: 'italic' }}>{addBolding(item?.value, oldQuery, true)}</Text>
          <Text>{`(${item?.payload?.taxonRankId})`}</Text>
        </View>
      )
    } else {
      return (
        <View>
          <Text>{addBolding(item?.value, oldQuery, false)}{' - '}<Text style={{ fontStyle: 'italic' }}>{item?.payload?.scientificName}</Text></Text>
          <Text>{`(${item?.payload?.taxonRankId})`}</Text>
        </View>
      )
    }
  }

  const renderTextInput = (
    onFocus: () => void,
    onBlur: () => void,
    onChangeText: () => void,
    defaultValue: string
  ) => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch' }}>
        <TextInput
          style={{ borderColor: Colors.inputBorder, borderWidth: 1, height: 40, width: '90%', padding: 10 }}
          onFocus={onFocus}
          onBlur={onBlur}
          onChangeText={onChangeText}
          defaultValue={defaultValue}>
        </TextInput>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {loading ?
            <ActivityIndicator size={25} color={Colors.neutralColor}/>
            : selected ?
              <Icon iconStyle={{ padding: 5, color: Colors.positiveColor }} name='done' type='material-icons' size={25} />
              : <Icon iconStyle={{ padding: 5, color: Colors.neutralColor }} name='warning' type='material-icons' size={25} />
          }
        </View>
      </View>
    )
  }

  return (
    <View style={Cs.containerWithJustPadding}>
      <Text>{props.title}</Text>
      <View style={{ paddingBottom: 35 }}>
        <Autocomplete
          containerStyle={{ flex: 1, position: 'absolute', left: 0, right: 0, top: 0, zIndex: 1 }}
          data={options}
          onFocus={onFocus}
          onBlur={onBlur}
          defaultValue={query}
          onChangeText={(text) => onQueryChange(text)}
          hideResults={hideResult}
          renderTextInput={({ onFocus, onBlur, onChangeText, defaultValue }) => {
            return renderTextInput(onFocus, onBlur, onChangeText, defaultValue)
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => onSelection(item)}>
                {renderedItem(item)}
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </View>
  )
}

export default FormAutocompleteComponent