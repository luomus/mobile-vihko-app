import React from 'react'
import { TextInput, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

type Props = {
  search: string,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  textInput: React.MutableRefObject<TextInput | null>
}

const ListFilterComponent = (props: Props) => {

  const { t } = useTranslation()

  return (
    <View style={Cs.listFilterContainer}>
      <TextInput
        value={props.search}
        onChangeText={props.setSearch}
        placeholder={t('filter species')}
        placeholderTextColor={Colors.neutral6}
        style={Cs.listFilterInput}
        ref={props.textInput}
      />
      <Icon
        name='cancel'
        type='material-icons'
        color={Colors.dangerButton2}
        size={26}
        onPress={() => {
          props.textInput.current?.blur()
          props.setSearch('')
          props.textInput.current?.focus()
        }}
        iconStyle={Cs.listFilterIcon}
      />
    </View>
  )
}

export default ListFilterComponent