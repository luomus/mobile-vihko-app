import React from 'react'
import { View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import { CommonActions, ParamListBase } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import {
  rootState,
  DispatchType,
  resetReducer,
  logoutUser,
  setMessageState,
  eventPathUpdate
} from '../../stores'
import { stopLocationAsync } from '../../helpers/geolocationHelper'
import { pathToLineStringConstructor } from '../../helpers/geoJSONHelper'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import MessageComponent from '../general/MessageComponent'
import ButtonComponent from '../general/ButtonComponent'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type Props = {
  isVisible: boolean,
  onClose: () => void,
  navigation: NativeStackNavigationProp<ParamListBase, string>
}

const UserModalComponent = (props: Props) => {
  const credentials = useSelector((state: rootState) => state.credentials)
  const observationEventInterrupted = useSelector((state: rootState) => state.observationEventInterrupted)
  const observing = useSelector((state: rootState) => state.observing)
  const path = useSelector((state: rootState) => state.path)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  const showLogoutDialoue = () => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('logout'),
      cancelLabel: t('cancel'),
      okLabel: t('exit'),
      onOk: logout
    }))
  }

  const logout = async () => {
    if (observing) {
      const lineString = pathToLineStringConstructor(path)
      dispatch(eventPathUpdate(lineString))
      await stopLocationAsync(observationEventInterrupted)
    }

    dispatch(logoutUser())
    dispatch(resetReducer())

    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'login' }]
      })
    )
  }

  return (
    <Modal isVisible={props.isVisible} onBackButtonPress={props.onClose} onBackdropPress={props.onClose}>
      <View style={Cs.userModalContainer}>
        <View>
          <Text>
            {credentials.user !== null ? t('loggedin') + ' ' + credentials.user.fullName : null}
          </Text>
        </View>
        <View style={Cs.logoutButtonContainer}>
          <ButtonComponent onPressFunction={() => showLogoutDialoue()} title={undefined}
            height={40} width={40} buttonStyle={Bs.logoutButton}
            gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={'logout'} iconType={'material-community'} iconSize={22} contentColor={Colors.darkText}
          />
        </View>
        <MessageComponent />
      </View>
    </Modal>
  )
}

export default UserModalComponent