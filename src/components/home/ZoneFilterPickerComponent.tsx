import React, { useRef, useState } from 'react'
import { FlatList, ListRenderItem, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { createFilter } from 'react-native-search-filter'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import ButtonComponent from '../general/ButtonComponent'

type Props = {
  visible: boolean,
  onSelect: (key: string) => void,
  onCancel: () => void,
  options: {
    key: string,
    label: string
  }[],
  selectedOption: string,
  placeholderText: string
}

const ZoneFilterPickerComponent = (props: Props) => {
  const [search, setSearch] = useState<string>('')

  const textInput = useRef<TextInput | null>(null)

  const { t } = useTranslation()

  const FilterInput = (
    <View style={Cs.listFilterContainer}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder={props.placeholderText}
        placeholderTextColor={Colors.neutral5}
        style={Cs.zoneListFilterInput}
        ref={textInput}
        autoCorrect={false}
      />
      <Icon
        name='cancel'
        type='material-icons'
        color={Colors.dangerButton2}
        size={26}
        onPress={() => {
          textInput.current?.blur()
          setSearch('')
          textInput.current?.focus()
        }}
        iconStyle={Cs.listFilterIcon}
      />
    </View>
  )

  const renderZone: ListRenderItem<{
    key: string
    label: string
  }> = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.onSelect(item.key)} key={item.key}
        style={Cs.listElementContainer}>
        <Text style={Ts.zoneListText}>
          {item.label}
        </Text>
      </TouchableOpacity>
    )
  }

  const filteredZones = props.options.filter(createFilter(search, ['label']))

  return (
    <Modal visible={props.visible} onRequestClose={() => { props.onCancel() }}>
      <TouchableWithoutFeedback onPress={() => { props.onCancel() }}>
        <View style={Cs.newModalContainer}>
          <TouchableWithoutFeedback>
            <View style={Cs.filterPickerOverlayContainer}>
              <ButtonComponent onPressFunction={() => props.onCancel()} title={t('cancel')}
                height={40} width={120} buttonStyle={Bs.textAndIconButton}
                gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.darkText}
              />
              <FlatList
                data={filteredZones}
                renderItem={renderZone}
                ListHeaderComponent={FilterInput}
                style={Cs.filterPickerContainer}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default ZoneFilterPickerComponent