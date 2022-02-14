import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import i18n from '../../languages/i18n'
import { ErrorMessage } from '@hookform/error-message'
import SelectedButtonComponent from '../general/SelectedButtonComponent'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
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
  const [elementList, setElementList] = useState<JSX.Element[] | undefined>([])

  const { validation } = props.params

  const { t } = useTranslation()

  useEffect(() => {
    if (validation) {
      register(props.objectTitle, validation)
    } else {
      register(props.objectTitle)
    }

    if (props.defaultValue !== '') { setSelectedKey(props.defaultValue) }
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

  const renderListElements = () => {
    let elements = []
    for (let key of Object.keys(props.dictionary)) {

      const atlasCode = getAtlasCode(props.dictionary[key])

      let colorUnselected = Colors.atlasCodeWhiteButton

      if (atlasCode[0] === '2' || atlasCode[0] === '3') {
        colorUnselected = Colors.atlasCodeYellowButton
      } else if (atlasCode[0] === '4' || atlasCode[0] === '5' || atlasCode[0] === '6') {
        colorUnselected = Colors.atlasCodeGreenButton
      } else if (atlasCode[0] === '7' || atlasCode[0] === '8') {
        colorUnselected = Colors.atlasCodeBlueButton
      } else if (atlasCode[0] === 'T' || atlasCode[0] === 'E') {
        continue
      }

      elements.push(
        <View key={key} style={{ paddingTop: 10, paddingRight: 10 }}>
          {
            selectedKey === key ?
              <SelectedButtonComponent
                onPress={() => null}
                title={atlasCode} height={40} width={80}
                color={Colors.unavailableButton}
                textStyle={Ts.languageAndAtlasCodeButtonText}
                textColor={Colors.darkText}
              />
              :
              <ButtonComponent
                onPressFunction={() => {
                  setSelectedKey(key)
                  setValue(props.objectTitle, key)
                }}
                title={getAtlasCode(props.dictionary[key])} height={40} width={80} buttonStyle={Bs.logoutButton}
                gradientColorStart={colorUnselected}
                gradientColorEnd={colorUnselected}
                shadowColor={Colors.neutralShadow}
                textStyle={Ts.languageButtonText} iconName={undefined} iconType={undefined} iconSize={undefined}
                contentColor={colorUnselected === Colors.atlasCodeBlueButton ? Colors.whiteText : Colors.darkText}
              />
          }
        </View>
      )
    }

    setElementList(elements)
  }

  const errorMessageTranslation = (errorMessage: string): Element => {
    const errorTranslation = t(errorMessage  + ' atlas code')
    return <Text style={{ color: Colors.dangerButton2 }}>{errorTranslation}</Text>
  }

  return (
    <View style={Cs.padding10Container}>
      <Text>{props.title}</Text>
      <ErrorMessage
        errors={formState.errors}
        name={props.objectTitle}
        render={({ message }) => <Text style={{ color: Colors.dangerButton2 }}>{errorMessageTranslation(message)}</Text>}
      />
      <View style={Cs.atlasCodeChosenContainer}>
        <Text>{!selectedKey || selectedKey === '' ? t('no atlas code') : props.dictionary[selectedKey]}</Text>
      </View>
      <View style={Cs.atlasCodeSelectionContainer}>
        {elementList}
      </View>
    </View>
  )
}

export default FormAtlasCodeComponent