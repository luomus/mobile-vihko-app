import React, { useEffect, useState } from 'react'
import { ActionSheetIOS, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Os from '../../styles/OtherStyles'
import Colors from '../../styles/Colors'
import ButtonComponent from '../general/ButtonComponent'

interface Props {
  title: string,
  objectTitle: string,
  defaultValue: string[],
  uiSchemaContext: Record<string, any> | null,
  habitatDictionary: Record<string, string>,
  lang: string,
  index: number,
}

const FormHabitatClassificationComponent = (props: Props) => {
  const [optionsTier1, setOptionsTier1] = useState<{ key: string, value: string }[]>([])
  const [optionsTier2, setOptionsTier2] = useState<{ key: string, value: string }[]>([])
  const [optionsTier3, setOptionsTier3] = useState<{ key: string, value: string }[]>([])
  const [selectedTier1, setSelectedTier1] = useState<{ key: string, value: string } | null>(null)
  const [selectedTier2, setSelectedTier2] = useState<{ key: string, value: string } | null>(null)
  const [selectedTier3, setSelectedTier3] = useState<{ key: string, value: string } | null>(null)
  const [selectedHabitats, setSelectedHabitats] = useState<{ key: string, value: string }[]>([])
  const [currentSelection, setCurrentSelection] = useState<{ key: string, value: string } | null>(null)

  const { register, setValue } = useFormContext()
  const { t } = useTranslation()

  useEffect(() => {
    register(props.objectTitle)
    initOptions()
    initDefaults()
  }, [])

  const initOptions = () => {
    const habitatTree = props.uiSchemaContext?.habitat?.tree
    if (!habitatTree || !habitatTree.children || !habitatTree.order) return

    const tier1Keys = habitatTree.order.filter((key: string) => key in habitatTree.children)
    const tier1Values = tier1Keys.map((key: string) => ({
      key,
      value: props.habitatDictionary[key]
    }))

    setOptionsTier1([{ key: '', value: '' }, ...tier1Values])
  }

  const initDefaults = () => {
    if (props.defaultValue && props.defaultValue.length > 0) {
      const initialHabitats = props.defaultValue.map(key => ({
        key,
        value: props.habitatDictionary[key] || key
      }))
      setSelectedHabitats(initialHabitats)
    }
  }

  const selectTier1Item = (item: { key: string, value: string } | null) => {
    if (!item) {
      setOptionsTier2([])
      setOptionsTier3([])
      return
    }
    const habitatTree = props.uiSchemaContext?.habitat?.tree
    if (!habitatTree || !habitatTree.children) {
      setOptionsTier2([])
      setOptionsTier3([])
      return
    }
    const tier1Child = habitatTree.children[item.key]
    if (!tier1Child || !tier1Child.children || !tier1Child.order) {
      setOptionsTier2([])
      setOptionsTier3([])
      setCurrentSelection(item)
      setValue(props.objectTitle, [...selectedHabitats.map(habitat => habitat.key), item.key])

      const value = item.key === '' && selectedHabitats.length === 0
        ? undefined
        : [...selectedHabitats.map(habitat => habitat.key), ...(item.key === '' ? [] : [item.key])]
      setValue(props.objectTitle, value)
      return
    }
    const tier2Keys = tier1Child.order.filter((key: string) => key in tier1Child.children)
    const tier2Values = tier2Keys.map((key: string) => ({
      key,
      value: props.habitatDictionary[key]
    }))
    setCurrentSelection(item)
    setValue(props.objectTitle, [...selectedHabitats.map(habitat => habitat.key), item.key])

    setOptionsTier2([{ key: '', value: '' }, ...tier2Values])
    setOptionsTier3([])
    setSelectedTier2(null)
    setSelectedTier3(null)
  }

  const selectTier2Item = (item: { key: string, value: string } | null) => {
    if (!item) {
      setOptionsTier3([])
      return
    }
    const habitatTree = props.uiSchemaContext?.habitat?.tree
    if (!habitatTree || !habitatTree.children) {
      setOptionsTier3([])
      return
    }
    const tier1Key = selectedTier1?.key
    if (!tier1Key) {
      setOptionsTier3([])
      return
    }
    const tier1Child = habitatTree.children[tier1Key]
    if (!tier1Child || !tier1Child.children) {
      setOptionsTier3([])
      return
    }
    const tier2Child = tier1Child.children[item.key]
    if (!tier2Child || !tier2Child.children || !tier2Child.order) {
      setOptionsTier3([])
      setCurrentSelection(item)
      setValue(props.objectTitle, [...selectedHabitats.map(habitat => habitat.key), item.key])
      return
    }
    const tier3Keys = tier2Child.order.filter((key: string) => key in tier2Child.children)
    const tier3Values = tier3Keys.map((key: string) => ({
      key,
      value: props.habitatDictionary[key]
    }))
    setCurrentSelection(item)
    setValue(props.objectTitle, [...selectedHabitats.map(habitat => habitat.key), item.key])

    setOptionsTier3([{ key: '', value: '' }, ...tier3Values])
    setSelectedTier3(null)
  }

  const addHabitat = () => {
    if (!selectedTier1) return

    let selectedHabitat = null
    if (selectedTier3) {
      selectedHabitat = selectedTier3
    } else if (selectedTier2) {
      selectedHabitat = selectedTier2
    } else {
      selectedHabitat = selectedTier1
    }

    const newHabitats = [...selectedHabitats, selectedHabitat]
    const newHabitatsKeys = newHabitats.map(habitat => habitat.key)

    setCurrentSelection(null)
    setSelectedHabitats(newHabitats)
    setValue(props.objectTitle, newHabitatsKeys)

    setSelectedTier1(null)
    setSelectedTier2(null)
    setSelectedTier3(null)
    setOptionsTier2([])
    setOptionsTier3([])
  }

  const deleteHabitat = (index: number) => {
    const newHabitats = selectedHabitats.filter((_, i) => i !== index)
    setSelectedHabitats(newHabitats)
    setValue(props.objectTitle, [...newHabitats.map(habitat => habitat.key), currentSelection ? currentSelection.key : []])
  }

  const onPressTier1 = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: optionsTier1.map(option => option.value)
      },
      buttonIndex => {
        setSelectedTier1(optionsTier1[buttonIndex])
        selectTier1Item(optionsTier1[buttonIndex])
      }
    )

  const onPressTier2 = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: optionsTier2.map(option => option.value)
      },
      buttonIndex => {
        setSelectedTier2(optionsTier2[buttonIndex])
        selectTier2Item(optionsTier2[buttonIndex])
      }
    )

  const onPressTier3 = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: optionsTier3.map(option => option.value)
      },
      buttonIndex => {
        setSelectedTier3(optionsTier3[buttonIndex])
        setCurrentSelection(optionsTier3[buttonIndex])
      }
    )

  return (
    <View style={[Cs.padding10Container, { zIndex: Platform.OS === 'ios' ? props.index : undefined }]}>
      <View style={Cs.rowContainer}>
        <Text>{props.title}</Text>
      </View>
      <TouchableOpacity onPress={() => onPressTier1()} style={Cs.iOSPickerContainer}>
        <TextInput
          style={Os.iOSPickerInput}
          value={selectedTier1?.value || ''}
          editable={false}
          onPressOut={() => onPressTier1()}
          multiline
        />
        <Icon
          name='arrow-drop-down'
          type='material-icons'
          color={Colors.neutral7}
          size={22}
        />
      </TouchableOpacity>
      {
        optionsTier2.length > 0 &&
        <TouchableOpacity onPress={() => onPressTier2()} style={Cs.iOSPickerContainer}>
          <TextInput
            style={Os.iOSPickerInput}
            value={selectedTier2?.value || ''}
            editable={false}
            onPressOut={() => onPressTier2()}
            multiline
          />
          <Icon
            name='arrow-drop-down'
            type='material-icons'
            color={Colors.neutral7}
            size={22}
          />
        </TouchableOpacity>
      }
      {
        optionsTier3.length > 0 &&
        <TouchableOpacity onPress={() => onPressTier3()} style={Cs.iOSPickerContainer}>
          <TextInput
            style={Os.iOSPickerInput}
            value={selectedTier3?.value || ''}
            editable={false}
            onPressOut={() => onPressTier3()}
            multiline
          />
          <Icon
            name='arrow-drop-down'
            type='material-icons'
            color={Colors.neutral7}
            size={22}
          />
        </TouchableOpacity>
      }
      <View style={{
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center'
      }}>
        <ButtonComponent onPressFunction={() => addHabitat()} title={t('add')}
          height={40} width={100} buttonStyle={Bs.textAndIconButton}
          gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
          textStyle={Ts.buttonText} iconName={'add'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
        />
      </View>
      <View style={{ padding: 10, borderRadius: 5 }}>
        <Text>{t('selected')}:</Text>
        {selectedHabitats.map((habitat, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text key={habitat.key}>- {habitat.value}</Text>
            <Icon
              name='delete'
              type='material-icons'
              color={'red'}
              size={22}
              onPress={() => deleteHabitat(idx)}
            />
          </View>
        ))}
        {currentSelection &&
          <Text key={currentSelection.key}>- {currentSelection.value}</Text>
        }
      </View>
    </View>
  )
}

export default FormHabitatClassificationComponent