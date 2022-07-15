import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, NativeSyntheticEvent, Platform, Text, TextInput, TextInputFocusEventData, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import { rootState } from '../../stores'
import { getTaxonAutocomplete } from '../../services/autocompleteService'
import Autocomplete from 'react-native-autocomplete-input'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'
import { get, debounce } from 'lodash'
import { Canceler } from 'axios'
import { ErrorMessage } from '@hookform/error-message'
import { useFormContext } from 'react-hook-form'
import { convert } from '../../helpers/taxonAutocomplete'

export interface AutocompleteParams {
  target: string,
  filters: Record<string, any> | null,
  valueField: string,
  validation?: Record<string, any>,
  transform: Record<string, string>
}

interface Props {
  title: string,
  defaultValue: string,
  autocompleteParams: AutocompleteParams,
  lang: string,
  index: number,
}

const FormAutocompleteComponent = (props: Props) => {
  const [query, setQuery] = useState<string>(props.defaultValue)
  const [options, setOptions] = useState<Record<string, any>[]>([])
  const [hideResult, setHideResult] = useState<boolean>(true)
  const [selected, setSelected] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [unitID, setUnitID] = useState<string>('')

  const observationId = useSelector((state: rootState) => state.observationId)

  const { t } = useTranslation()
  const { register, unregister, setValue, formState, watch, clearErrors, setError, setFocus } = useFormContext()
  const { target, filters, valueField, validation, transform } = props.autocompleteParams
  let cancel: Canceler | undefined

  useEffect(() => {
    let allFound = true
    const transformKeys = Object.keys(transform)
    const registeredFields = Object.keys(watch())

    registerField(valueField)
    setValue(valueField, props.defaultValue, { shouldValidate: false })

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

  useEffect(() => {
    if (observationId) {
      setUnitID(observationId.unitId)
    }
  }, [observationId])

  //set focus into the autocomplete's input field so user can start typing immediately
  useEffect(() => {
    setFocus('autocompleteInput')
  }, [setFocus])

  //this timeout clears taxon name -field's errors (and the error notification) in 5 sec
  useEffect(() => {
    if (Object.keys(formState.errors).length > 0) {
      setTimeout(() => {
        clearErrors(valueField)
      }, 5000)
    }
  }, [formState.errors])

  const initAutocompleteOnMCode = async (query: string) => {
    try {
      setLoading(true)

      let res = await getTaxonAutocomplete(target, query.toLowerCase(), null, props.lang, 5, setCancelToken)

      if (res.result[0]?.payload?.matchType === 'exactMatches') {
        const payload = res.result[0].payload
        setSelected(true)

        setQuery(payload.matchingName)
      }

    } catch (err) {
      if (!err.isCanceled) {
        setError(valueField, { message: t('autocomplete network error'), type: 'manual' })
      }
    } finally {
      setLoading(false)
    }
  }

  const wipeOldSelection = () => {
    Object.keys(transform).forEach(key => {
      unregister(transform[key])
    })
  }

  const mapInformalTaxonGroups = (informalTaxonGroups: Record<string, any>) => {
    return informalTaxonGroups.map((group: any) => {
      return typeof group === 'string' ? group : group.id
    })
  }

  const registerField = (name: string) => {
    if (validation && name === valueField) {
      register(name, validation)
    } else {
      register(name)
    }
  }

  const addSelectionToForm = (item: Record<string, any>) => {
    Object.keys(transform).forEach(key => {
      registerField(transform[key])
      if (key.includes('informalTaxonGroup')) {
        setValue(transform[key], mapInformalTaxonGroups(get(item, key.split('_'))), { shouldValidate: false })
      } else {
        setValue(transform[key], get(item, key.split('_')), { shouldValidate: false })
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

      let res = await getTaxonAutocomplete(target, query.toLowerCase(), filters, props.lang, 5, setCancelToken)

      const autocompleteOptions = removeDuplicates(res.result).map(result => convert(result, res.query))

      setOptions(autocompleteOptions)

      if (autocompleteOptions[0]?.data.payload?.matchType === 'exactMatches') {
        setSelected(true)
        addSelectionToForm(autocompleteOptions[0].data)
      }

      cancel = undefined
    } catch (err) {
      if (!err.isCanceled) {
        setError(valueField, { message: t('autocomplete network error'), type: 'manual' })
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
      registerField(valueField)
      setSelected(false)
    }

    setQuery(text)
    setHideResult(false)

    setValue(valueField, text, { shouldValidate: false })

    debouncedQuery(text)
  }

  const removeDuplicates = (options: Record<string, any>[]) => {
    return options.filter((outer, index) => {
      return options.findIndex(inner => outer.key === inner.key) === index
    })
  }

  const onSelection = (item: Record<string, any>) => {
    setQuery(item.payload.matchingName)
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

  const errorMessageTranslation = (errorMessage: string): Element => {
    const errorTranslation = t(errorMessage)
    return <Text style={{ color: Colors.dangerButton2 }}>{errorTranslation}</Text>
  }

  const renderTextInput = (
    onFocus: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined,
    onBlur: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined,
    onChangeText: ((text: string) => void) | undefined,
    defaultValue: string | undefined
  ) => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch' }}>
        <TextInput
          {...register('autocompleteInput')}
          style={{ borderColor: Colors.neutral5, borderWidth: 1, height: 40, width: '90%', padding: 10 }}
          onFocus={onFocus}
          onBlur={onBlur}
          onChangeText={onChangeText}
          defaultValue={defaultValue}>
        </TextInput>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {loading ?
            <ActivityIndicator size={25} color={Colors.primary5} />
            : selected ?
              <Icon iconStyle={{ padding: 5, color: Colors.successButton1 }} name='done' type='material-icons' size={25} tvParallaxProperties={undefined} />
              : query !== '' ?
                <Icon iconStyle={{ padding: 5, color: Colors.primary5 }} name='warning' type='material-icons' size={25} tvParallaxProperties={undefined} />
                : null
          }
        </View>
      </View>
    )
  }
  if (!unitID.includes('complete_list')) {
    return (
      <View style={[Cs.padding10Container, { zIndex: Platform.OS === 'ios' ? props.index : undefined }]}>
        <Text>{props.title}</Text>
        <ErrorMessage
          errors={formState.errors}
          name={valueField}
          render={({ message }) => <Text style={{ color: Colors.dangerButton2 }}>{errorMessageTranslation(message)}</Text>}
        />
        <View style={{ paddingBottom: 35 }}>
          <Autocomplete
            containerStyle={{ flex: 1, position: 'absolute', left: 0, right: 0, top: 0, zIndex: props.index }}
            data={options}
            onFocus={onFocus}
            onBlur={onBlur}
            defaultValue={query}
            onChangeText={(text) => onQueryChange(text)}
            hideResults={hideResult}
            listStyle={{ paddingLeft: 15 }}
            renderTextInput={({ onFocus, onBlur, onChangeText, defaultValue }) => {
              return renderTextInput(onFocus, onBlur, onChangeText, defaultValue)
            }}
            flatListProps={{
              keyboardShouldPersistTaps: 'always',
              keyExtractor: (_, idx) => idx.toString(),
              renderItem: ({ item }) => {
                return (
                  <TouchableOpacity onPress={() => onSelection(item.data)}>
                    <Text style={{ paddingHorizontal: 10 }}>{item.element}</Text>
                  </TouchableOpacity>
                )
              }
            }}
          />
        </View>
      </View>
    )
  } else {
    return (
      <View style={Cs.padding10Container}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{t('species') + ': ' + query}</Text>
      </View>
    )
  }
}

export default FormAutocompleteComponent