import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Picker } from '@react-native-picker/picker'
import { ErrorMessage } from '@hookform/error-message'
import { atlasCodeAbbreviations } from '../../config/fields'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'

interface Props {
  title: string,
  objectTitle: string,
  pickerItems: Array<React.JSX.Element>,
  selectedValue: string | null,
  validation?: Record<string, any>,
  dictionary: { [key: string]: any }
}

const FormPickerComponent = (props: Props) => {
  const { register, setValue, formState } = useFormContext()
  const [selected, setSelected] = useState(props.selectedValue)
  const [pickerValues, setPickerValues] = useState<Array<string>>([])
  const [abbreviations, setAbbreviations] = useState<Array<string>>([])

  const { t } = useTranslation()

  useEffect(() => {
    if (props.validation) {
      register(props.objectTitle, props.validation)
    } else {
      register(props.objectTitle)
    }
    setValue(props.objectTitle, props.selectedValue)

    const valueSet = []
    for (const key in props.dictionary) {
      valueSet.push(props.dictionary[key])
    }
    setPickerValues(valueSet)

    if (props.objectTitle === 'atlasCode') {
      const abbreviationSet = []
      for (const key in props.dictionary) {
        abbreviationSet.push(atlasCodeAbbreviations[key])
      }
      setAbbreviations(abbreviationSet)
    }
  }, [])

  return (
    <View style={Cs.padding10Container}>
      <View style={Cs.rowContainer}>
        <Text>{props.title}</Text>
        {
          props.validation ?
            <Text style={Ts.redText}> *</Text>
            : null
        }
      </View>
      <ErrorMessage
        errors={formState.errors}
        name={props.objectTitle}
        render={({ message }) => <Text style={Ts.redText}>{t(message)}</Text>}
      />
      <View style={Cs.formPickerContainer}>
        <Picker
          selectedValue={selected}
          numberOfLines={10}
          onValueChange={itemValue => {
            setSelected(itemValue)
            setValue(props.objectTitle, itemValue)
          }}
        >
          {props.objectTitle === 'atlasCode' && abbreviations.length > 0
            ? abbreviations.map((abbreviation, index) => (
              <Picker.Item key={index} label={abbreviation} value={Object.keys(props.dictionary)[index]} />
            ))
            : pickerValues.map((value, index) => (
              <Picker.Item key={index} label={value} value={Object.keys(props.dictionary)[index]} />
            ))}
        </Picker>
      </View>
    </View>
  )
}

export default FormPickerComponent