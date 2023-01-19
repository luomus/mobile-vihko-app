import React, { useEffect } from 'react'
import { TextInput, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ParamListBase } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

type Props = {
  search: string,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  textInput: React.MutableRefObject<TextInput | null>,
  navigation: NativeStackNavigationProp<ParamListBase, string>
}

const ListFilterComponent = (props: Props) => {

  const { t } = useTranslation()

  //opens the keyboard when returning from ObservationComponent
  useEffect(() => {
    if (props.textInput.current) {
      const openKeyboard = props.navigation.addListener('focus', () => {
        setTimeout(() => { //does not work without the timeout
          props.textInput.current?.focus()
        }, 500)
      })

      return openKeyboard
    }
  }, [props.navigation, props.textInput.current])

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
        tvParallaxProperties={undefined}
      />
    </View>
  )
}

export default ListFilterComponent