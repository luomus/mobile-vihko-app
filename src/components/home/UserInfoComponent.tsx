import React from 'react'
import { Text, View } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import {
  rootState,
  DispatchType,
  resetReducer,
  logoutUser,
  setMessageState
} from '../../stores'
import MessageComponent from '../general/MessageComponent'

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
    <View>
      <View style={Cs.userInfoContainer}>
        <View>
          <Text>
            {credentials.user !== null ? t('loggedin') + ' ' + credentials.user.fullName : null}
          </Text>
        </View>
        <View style={Cs.logoutButtonContainer}>
          <Button
            buttonStyle={Bs.logoutButton}
            icon={<Icon name='logout' type='material-community' color='white' size={22} />}
            onPress={() => showLogoutDialoue()}
          />
        </View>
      </View>
      <MessageComponent/>
    </View>
  )
}

export default UserInfoComponent