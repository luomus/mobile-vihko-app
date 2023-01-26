import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'
import { rootState } from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import i18n from '../../languages/i18n'

interface Props {
  onPress: (key: string) => void,
  atlasKey: string
}

const AtlasCodeStampComponent = (props: Props) => {

  const [color, setColor] = useState<string>('#FFFFFF')
  const [atlasCode, setAtlasCode] = useState<string>('0')

  const schema = useSelector((state: rootState) => state.schema)

  const { t } = useTranslation()

  useEffect(() => {
    const codeEnums = get(schema, i18n.language + '.schema.properties.gatherings.items.properties.units.items.properties.atlasCode.oneOf')
    const codeDictionary: { [key: string]: any } = {}
    codeEnums.forEach((entry: { const: string, title: string }) => codeDictionary[entry.const] = entry.title)
    const code = getAtlasCode(codeDictionary[props.atlasKey])
    setAtlasCode(code)
    setColor(getColor(code))
  }, [props.atlasKey])

  const getAtlasCode = (value: string) => {
    if (value === '') {
      return t('empty')
    } else {
      return value.split(' ')[0]
    }
  }

  const getColor = (atlasCode: string) => {
    let colorUnselected = Colors.atlasCodeWhiteButton

    if (atlasCode[0] === '2' || atlasCode[0] === '3') {
      colorUnselected = Colors.atlasCodeYellowButton
    } else if (atlasCode[0] === '4' || atlasCode[0] === '5' || atlasCode[0] === '6') {
      colorUnselected = Colors.atlasCodeGreenButton
    } else if (atlasCode[0] === '7' || atlasCode[0] === '8') {
      colorUnselected = Colors.atlasCodeBlueButton
    }

    return colorUnselected
  }

  return (
    <ButtonComponent
      onPressFunction={() => props.onPress(props.atlasKey)}
      title={atlasCode} height={40} width={80} buttonStyle={Bs.logoutButton}
      gradientColorStart={color}
      gradientColorEnd={color}
      shadowColor={Colors.neutralShadow}
      textStyle={Ts.languageButtonText} iconName={undefined} iconType={undefined} iconSize={undefined}
      contentColor={color === Colors.atlasCodeBlueButton ? Colors.whiteText : Colors.blackText}
    />
  )
}

export default AtlasCodeStampComponent