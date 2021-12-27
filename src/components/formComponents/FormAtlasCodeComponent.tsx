import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import i18n from '../../languages/i18n'
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
  dictionary: { [key: string]: any }
}

const FormAtlasCodeComponent = (props: Props) => {
  const { register, setValue } = useFormContext()
  const [selected, setSelected] = useState<string>('')
  const [elementList, setElementList] = useState<JSX.Element[] | undefined>([])

  const { t } = useTranslation()

  useEffect(() => {
    register(props.objectTitle)
    setSelected(props.defaultValue)
    setValue(props.objectTitle, props.defaultValue)
    renderListElements()
  }, [])

  useEffect(() => {
    renderListElements()
  }, [selected, i18n.language])

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
      elements.push(
        <View key={key} style={{ paddingVertical: 5, paddingRight: 5 }}>
          {
            selected === key ?
              <SelectedButtonComponent
                onPress={() => null}
                title={getAtlasCode(props.dictionary[key])}
              />
              :
              <ButtonComponent
                onPressFunction={() => {
                  setSelected(key)
                  setValue(props.objectTitle, key)
                }}
                title={getAtlasCode(props.dictionary[key])} height={40} width={80} buttonStyle={Bs.logoutButton}
                gradientColorStart={Colors.neutralButton}
                gradientColorEnd={Colors.neutralButton}
                shadowColor={Colors.neutralShadow}
                textStyle={Ts.languageButtonText} iconName={undefined} iconType={undefined} iconSize={undefined}
                contentColor={Colors.darkText}
              />
          }
        </View>
      )
    }

    setElementList(elements)
  }

  return (
    <View style={Cs.padding10Container}>
      <Text>{props.title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {elementList}
      </View>
    </View>
  )
}

export default FormAtlasCodeComponent