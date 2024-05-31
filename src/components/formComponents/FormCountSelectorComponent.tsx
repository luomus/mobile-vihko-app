import React, { useEffect, useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import i18n from '../../languages/i18n'
import SelectedButtonComponent from '../general/SelectedButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Os from '../../styles/OtherStyles'
import Colors from '../../styles/Colors'
import ButtonComponent from '../general/ButtonComponent'

interface Props {
  title: string,
  objectTitle: string,
  defaultValue: string
}

const FormCountSelectorComponent = (props: Props) => {
  const { register, setValue } = useFormContext()
  const [currentValue, setCurrentValue] = useState<string>(props.defaultValue ? props.defaultValue.toString() : '')
  const [elementList, setElementList] = useState<React.JSX.Element[] | undefined>([])

  const { t } = useTranslation()

  useEffect(() => {
    register(props.objectTitle)
    setValue(props.objectTitle, props.defaultValue)
    renderListElements()
  }, [])

  useEffect(() => {
    renderListElements()
  }, [currentValue, i18n.language])

  const onPress = (key: string) => {
    setValue(props.objectTitle, key)
    setCurrentValue(key)
  }

  const renderListElements = () => {
    const elements: React.JSX.Element[] = []

    const dictionary = [
      {
        title: t('observed'),
        color: Colors.atlasCodeWhiteButton
      },
      {
        title: '1',
        color: Colors.atlasCodeWhiteButton
      },
      {
        title: '2-10',
        color: Colors.atlasCodeYellowButton
      },
      {
        title: '11-100',
        color: Colors.atlasCodeYellowButton
      },
      {
        title: '101-1000',
        color: Colors.atlasCodeGreenButton
      },
      {
        title: '> 1000',
        color: Colors.atlasCodeGreenButton
      }
    ]

    dictionary.forEach((element) => {

      elements.push(
        <View key={element.title} style={{ paddingTop: 10, paddingRight: 10 }}>
          {
            currentValue === element.title || (currentValue === 'X' && element.title === t('observed')) ?
              <SelectedButtonComponent
                onPress={() => null}
                title={element.title} height={40} width={90}
                color={Colors.unavailableButton}
                textStyle={Ts.selectionButtonText}
                textColor={Colors.darkText}
              />
              :
              <ButtonComponent
                onPressFunction={() => onPress(element.title === t('observed') ? 'X' : element.title)}
                title={element.title} height={40} width={90} buttonStyle={Bs.logoutButton}
                gradientColorStart={element.color}
                gradientColorEnd={element.color}
                shadowColor={Colors.neutralShadow}
                textStyle={Ts.selectionButtonText} iconName={undefined} iconType={undefined} iconSize={undefined}
                contentColor={Colors.blackText}
              />
          }
        </View>
      )
    })

    setElementList(elements)
  }

  return (
    <View style={Cs.padding10Container}>
      <Text>{props.title}</Text>
      <TextInput
        style={Os.textInput}
        keyboardType={'default'}
        onChangeText={text => {
          setValue(props.objectTitle, text)
          setCurrentValue(text)
        }}
        defaultValue={currentValue}
        autoCorrect={false}
        multiline
        testID={props.title}
      />
      <View style={Cs.atlasCodeSelectionContainer}>
        {elementList}
      </View>
    </View>
  )
}

export default FormCountSelectorComponent