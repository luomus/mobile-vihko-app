import React from 'react'
import { Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import {
  rootState,
  DispatchType,
  resetReducer,
  logoutUser,
  setMessageState
} from '../../stores'
import MessageComponent from '../general/MessageComponent'
import ButtonComponent from '../general/ButtonComponent'

type Props = {
  onLogout: () => void
}

const UserInfoComponent = (props: Props) => {

  const credentials = useSelector((state: rootState) => state.credentials)

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

  //on logout redirect to login screen, remove user from stores and asyncStore,
  //and remove observation events from reducer
  const logout = () => {
    props.onLogout()
    dispatch(logoutUser())
    dispatch(resetReducer())
  }

  return (
    <View style={Cs.homeUserContainer}>
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
  )
}

export default UserInfoComponent