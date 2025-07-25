import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import i18n from '../../languages/i18n'
import { ErrorMessage } from '@hookform/error-message'
import SelectedButtonComponent from '../general/SelectedButtonComponent'
import AtlasCodeStampComponent from '../general/AtlasCodeStampComponent'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'

interface Props {
  title: string,
  objectTitle: string,
  defaultValue: string,
  params: any,
  dictionary: { [key: string]: any }
}

const FormAtlasCodeComponent = (props: Props) => {
  const { register, setValue, formState } = useFormContext()
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined)
  const [elementList, setElementList] = useState<React.JSX.Element[] | undefined>([])

  const { t } = useTranslation()

  useEffect(() => {
    register(props.objectTitle)
    setSelectedKey(props.defaultValue)
    setValue(props.objectTitle, props.defaultValue)
    renderListElements()
  }, [])

  useEffect(() => {
    renderListElements()
  }, [selectedKey, i18n.language])

  const getAtlasCode = (value: string) => {
    if (value === '') {
      return t('empty')
    } else {
      return value.split(' ')[0]
    }
  }

  const onPress = (key: string) => {
    setSelectedKey(key)
    setValue(props.objectTitle, key)
  }

  const renderListElements = () => {
    const elements = []
    for (const key of Object.keys(props.dictionary)) {

      const atlasCode = getAtlasCode(props.dictionary[key])

      elements.push(
        <View key={key} style={{ paddingTop: 10, paddingRight: 10 }}>
          {
            selectedKey === key ?
              <SelectedButtonComponent
                onPress={() => null}
                title={atlasCode} height={40} width={80}
                color={Colors.unavailableButton}
                textStyle={Ts.selectionButtonText}
                textColor={Colors.darkText} noMargin
              />
              :
              <AtlasCodeStampComponent
                onPress={() => onPress(key)}
                atlasKey={key}
              />
          }
        </View>
      )
    }

    setElementList(elements)
  }

  const errorMessageTranslation = (errorMessage: string): React.JSX.Element => {
    const errorTranslation = t(errorMessage + ' atlas code')
    return <Text style={Ts.redText}>{errorTranslation}</Text>
  }

  return (
    <View style={Cs.padding10Container}>
      <Text>{props.title}</Text>
      <ErrorMessage
        errors={formState.errors}
        name={props.objectTitle}
        render={({ message }) => <Text style={Ts.redText}><>{errorMessageTranslation(message)}</></Text>}
      />
      <View style={Cs.atlasCodeChosenContainer}>
        <Text>
          {!selectedKey || selectedKey === ''
            ? t('no atlas code')
            : props.dictionary[selectedKey]}
        </Text>
      </View>
      <View style={Cs.atlasCodeSelectionContainer}>
        {elementList}
      </View>
    </View>
  )
}

export default FormAtlasCodeComponent