import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { getTaxonAutocomplete } from '../../controllers/autocompleteController'
import Autocomplete from 'react-native-autocomplete-input'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'
import { TextInput } from 'react-native-gesture-handler'
import { get, debounce } from 'lodash'
import { Canceler } from 'axios'
import uuid from 'react-native-uuid'

export interface AutocompleteParams {
  target: string,
  filters: Record<string, any> | null,
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
  lang: string,
  index: number,
}

const FormAutocompleteComponent = (props: Props) => {
  const [query, setQuery] = useState<string>(props.defaultValue)
  const [oldQuery, setOldQuery] = useState<string>(props.defaultValue)
  const [options, setOptions] = useState<Record<string, any>[]>([])
  const [hideResult, setHideResult] = useState<boolean>(true)
  const [selected, setSelected] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const { target, filters, valueField, transform } = props.autocompleteParams
  let cancel: Canceler | undefined
  let timeout: NodeJS.Timeout | undefined

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

    if (RegExp(/MX.*/).test(props.defaultValue)) {
      initAutocompleteOnMCode(props.defaultValue)
    }
  }, [])

  const setErrorMessage = (message: string) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    setError(message)

    timeout = setTimeout(() => setError(''), 10000)
  }

  const initAutocompleteOnMCode = async (query: string) => {
    try {
      setLoading(true)

      let res = await getTaxonAutocomplete(target, query.toLowerCase(), null, props.lang, setCancelToken)

      if (res.result[0]?.payload?.matchType === 'exactMatches') {
        const payload = res.result[0].payload
        setSelected(true)

        if (payload?.vernacularName) {
          setQuery(payload.vernacularName)
        } else {
          setQuery(payload.scientificName)
        }
      }

    } catch (err) {
      if (!err.isCanceled) {
        setErrorMessage('Autocomplete network error!')
      }
    } finally {
      setLoading(false)
    }
  }

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

  const setCancelToken = (c: Canceler) => {
    cancel = c
  }

  const queryAutocomplete = async (query: string) => {
    try {
      //fire request cancel if last is still unning to avoid getting responses in wrong order
      if (cancel) {
        cancel()
      }

      let res = await getTaxonAutocomplete(target, query.toLowerCase(), filters, props.lang, setCancelToken)

      setOptions(removeDuplicates(res.result))
      setOldQuery(res.query)

      if (res.result[0]?.payload?.matchType === 'exactMatches') {
        setSelected(true)
        addSelectionToForm(res.result[0])
      }

      cancel = undefined
    } catch (err) {
      if (!err.isCanceled) {
        setErrorMessage('Autocomplete network error!')
      }
    } finally {
      setLoading(false)
    }
  }

  //use debounce to avoid calling autocomplete-api to lower the update frequency on fast typing
  const debouncedQuery = useCallback(debounce(queryAutocomplete, 500), [])

  const onQueryChange = async (text: string) => {
    setLoading(true)

    if (selected) {
      wipeOldSelection()
      props.register({ name: valueField })
      setSelected(false)
    }

    setQuery(text)
    setHideResult(false)

    props.setValue(valueField, text)

    debouncedQuery(text)
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

        text.push(<Text key={uuid.v1()} style={{ fontWeight: 'bold', fontSize: 15 }}>{cappedQuery}</Text>)
      } else if (startIndex === 0) {
        text.push(<Text key={uuid.v1()} style={{ fontWeight: 'bold', fontSize: 15 }}>{query}</Text>)
      } else {
        text.push(<Text key={uuid.v1()} style={{ fontSize: 15 }}>{name.slice(0, startIndex)}</Text>)
        text.push(<Text key={uuid.v1()} style={{ fontWeight: 'bold', fontSize: 15 }}>{query}</Text>)
      }

      if (endIndex !== name.length) {
        text.push(<Text key={uuid.v1()} style={{ fontSize: 15 }}>{name.slice(endIndex)}</Text>)
      }

      return text
    }

    if (item?.payload?.nameType === 'MX.scientificName') {
      return (
        <View style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Text style={{ fontStyle: 'italic', fontSize: 15 }}>{addBolding(item?.value, oldQuery, true)}</Text>
        </View>
      )
    } else {
      return (
        <View style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Text>{addBolding(item?.value, oldQuery, false)}{' - '}<Text style={{ fontStyle: 'italic', fontSize: 15 }}>{item?.payload?.scientificName}</Text></Text>
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
      {
        error !== '' ?
          <Text style={{ color: Colors.negativeColor }}>{error}</Text> :
          null
      }
      <View style={{ paddingBottom: 35 }}>
        <Autocomplete
          containerStyle={{ flex: 1, position: 'absolute', left: 0, right: 0, top: 0, zIndex: props.index }}
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