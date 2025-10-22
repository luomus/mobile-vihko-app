import React, { useEffect, useState } from 'react'
import { Platform, Text, View } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { Picker } from '@react-native-picker/picker'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
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

    setOptionsTier1(tier1Values)
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
    if (!item || item.key === '') {
      setOptionsTier2([])
      setOptionsTier3([])
      setCurrentSelection(null)
      setValue(props.objectTitle, selectedHabitats.map(hab => hab.key))
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

    setOptionsTier2(tier2Values)
    setOptionsTier3([])
    setSelectedTier2(null)
    setSelectedTier3(null)
  }

  const selectTier2Item = (item: { key: string, value: string } | null) => {
    if (!item || item.key === '') {
      setOptionsTier3([])
      setCurrentSelection(null)
      setValue(props.objectTitle, selectedHabitats.map(hab => hab.key))
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

    setOptionsTier3(tier3Values)
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

    setSelectedHabitats(newHabitats)
    setValue(props.objectTitle, newHabitatsKeys)
    clearSelection()
  }

  const clearSelection = () => {
    setCurrentSelection(null)
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

  return (
    <View style={[Cs.padding10Container, { zIndex: Platform.OS === 'ios' ? props.index : undefined }]}>
      <View style={Cs.rowContainer}>
        <Text>{props.title}</Text>
      </View>
      <View>
        <View style={Cs.formPickerContainer}>
          <Picker
            selectedValue={selectedTier1}
            numberOfLines={10}
            onValueChange={item => {
              setSelectedTier1(item)
              selectTier1Item(item)
            }}
          >
            <Picker.Item key="emptyTier1" label={''} value={null} />
            {
              optionsTier1.map((item) => (
                <Picker.Item key={item.key} label={item.value} value={item} />
              ))
            }
          </Picker>
        </View>
        {
          optionsTier2.length > 0 &&
          <View style={Cs.formPickerContainer}>
            <Picker
              selectedValue={selectedTier2}
              numberOfLines={10}
              onValueChange={item => {
                setSelectedTier2(item)
                selectTier2Item(item)
              }}
            >
              <Picker.Item key="emptyTier2" label={''} value={null} />
              {
                optionsTier2.map((item) => (
                  <Picker.Item key={item.key} label={item.value} value={item} />
                ))
              }
            </Picker>
          </View>
        }
        {
          optionsTier3.length > 0 &&
          <View style={Cs.formPickerContainer}>
            <Picker
              selectedValue={selectedTier3}
              numberOfLines={10}
              onValueChange={item => {
                setSelectedTier3(item)
                setCurrentSelection(item)
                if (item?.key) { setValue(props.objectTitle, [...selectedHabitats.map(habitat => habitat.key), item.key]) }
              }}
            >
              <Picker.Item key="emptyTier3" label={''} value={null} />
              {
                optionsTier3.map((item) => (
                  <Picker.Item key={item.key} label={item.value} value={item} />
                ))
              }
            </Picker>
          </View>
        }
        <View style={{
          paddingVertical: 5,
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center'
        }}>
          {currentSelection &&
            <ButtonComponent onPressFunction={() => addHabitat()} title={t('add')}
              height={40} width={100} buttonStyle={Bs.textAndIconButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'add'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
          }
        </View>
        <View style={{ padding: 10, borderRadius: 5 }}>
          {(currentSelection || selectedHabitats.length > 0) &&
            <Text>{t('selected habitat')}:</Text>
          }
          {(currentSelection || selectedHabitats.length > 0) &&
            (currentSelection ? [currentSelection, ...selectedHabitats] : selectedHabitats).map((habitat, idx) => (
              <View key={habitat.key} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <Text>- {habitat.value}</Text>
                <Icon
                  name='delete'
                  type='material-icons'
                  color={'red'}
                  size={22}
                  onPress={() => {
                    if (currentSelection && idx === 0) {
                      clearSelection()
                    } else {
                      const deleteIdx = currentSelection ? idx - 1 : idx
                      deleteHabitat(deleteIdx)
                    }
                  }}
                />
              </View>
            ))
          }
        </View>
      </View>
    </View>
  )
}

export default FormHabitatClassificationComponent