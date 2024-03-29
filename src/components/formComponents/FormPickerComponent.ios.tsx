import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ActionSheetIOS, View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '@hookform/error-message'
import { atlasCodeAbbreviations } from '../../config/fields'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Os from '../../styles/OtherStyles'
import Colors from '../../styles/Colors'

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
  const [selected, setSelected] = useState(props.selectedValue === null ? null : props.dictionary[props.selectedValue])
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

    const abbreviationSet = []
    if (props.objectTitle === 'atlasCode') {
      for (const key in props.dictionary) {
        abbreviationSet.push(atlasCodeAbbreviations[key])
      }
    }

    setAbbreviations(abbreviationSet)
  }, [])

  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: abbreviations.length === 0 ? pickerValues : abbreviations
      },
      buttonIndex => {
        setSelected(pickerValues[buttonIndex])
        const pickerValue = Object.keys(props.dictionary).find(key => props.dictionary[key] === pickerValues[buttonIndex])
        setValue(props.objectTitle, pickerValue)
      }
    )

  const errorMessageTranslation = (errorMessage: string): React.JSX.Element => {
    const errorTranslation = t(errorMessage)
    return <Text style={Ts.redText}>{errorTranslation}</Text>
  }

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
        render={({ message }) => <Text style={Ts.redText}><>{errorMessageTranslation(message)}</></Text>}
      />
      <TouchableOpacity testID='formPicker' onPress={() => onPress()} style={Cs.iOSPickerContainer}>
        <TextInput
          style={Os.iOSPickerInput}
          value={selected}
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

export default FormPickerComponent