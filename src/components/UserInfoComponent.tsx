import React from 'react'
import { Text, View } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import { connect, ConnectedProps } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Cs from '../styles/ContainerStyles'
import Bs from '../styles/ButtonStyles'
import { clearCredentials, logoutUser } from '../stores/user/actions'
import { resetReducer } from '../stores/combinedActions'
import { CredentialsType } from '../stores/user/types'
import { setMessageState, clearMessageState } from '../stores/message/actions'
import MessageComponent from './MessageComponent'

interface RootState {
  credentials: CredentialsType,
}

const mapStateToProps = (state: RootState) => {
  const { credentials } = state
  return { credentials }
}

const mapDispatchToProps = {
  clearCredentials,
  setMessageState,
  clearMessageState,
  logoutUser,
  resetReducer,
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  onLogout: () => void
}

const UserInfoComponent = (props: Props) => {
  const { t } = useTranslation()

  const showLogoutDialoue = () => {
    props.setMessageState({
      type: 'conf',
      messageContent: t('logout'),
      onOk: logout
    })
  }

  //on logout redirect to login screen, remove user from stores and asyncStore,
  //and remove observation events from reducer
  const logout = () => {
    props.onLogout()
    props.logoutUser()
    props.resetReducer()
  }

  return (
    <View>
      <View style={Cs.userInfoContainer}>
        <View>
          <Text>
            {props.credentials.user !== null ? t('loggedin') + ' ' + props.credentials.user.fullName : null}
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

export default connector(UserInfoComponent)