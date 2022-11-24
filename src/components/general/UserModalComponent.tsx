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
import i18n from '../../languages/i18n'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import MessageComponent from '../general/MessageComponent'
import ButtonComponent from '../general/ButtonComponent'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import SelectedButtonComponent from './SelectedButtonComponent'
import { saveLanguage } from '../../helpers/languageHelper'

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
  const tracking = useSelector((state: rootState) => state.tracking)

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
      await stopLocationAsync(observationEventInterrupted, tracking)
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
        <View style={Cs.userDetailsContainer}>
          <View>
            <Text style={{ color: Colors.neutral9 }}>
              {credentials.user !== null ? t('logged in') + ' ' + credentials.user.fullName : null}
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
        <Text
          style={Ts.languageText}
          onPress={async () => {
            await saveLanguage('fi')
            props.onClose()
          }}
        >
          {t('select language')}:
        </Text>
        <View style={Cs.languageContainer}>
          {i18n.language === 'fi' ?
            <SelectedButtonComponent
              onPress={async () => {
                await saveLanguage('fi')
                props.onClose()
              }}
              title={'FI'} height={40} width={80}
              color={Colors.neutral3}
              textStyle={Ts.languageAndAtlasCodeButtonText}
              textColor={Colors.darkText}
            />
            :
            <ButtonComponent
              onPressFunction={async () => {
                await saveLanguage('fi')
                props.onClose()
              }}
              title={'FI'} height={40} width={80} buttonStyle={Bs.logoutButton}
              gradientColorStart={i18n.language === 'fi' ? Colors.primaryButton1 : Colors.neutralButton}
              gradientColorEnd={i18n.language === 'fi' ? Colors.primaryButton2 : Colors.neutralButton}
              shadowColor={i18n.language === 'fi' ? Colors.primaryShadow : Colors.neutralShadow}
              textStyle={Ts.languageButtonText} iconName={undefined} iconType={undefined} iconSize={undefined}
              contentColor={i18n.language === 'fi' ? Colors.whiteText : Colors.darkText}
            />
          }
          {i18n.language === 'sv' ?
            <SelectedButtonComponent
              onPress={async () => {
                await saveLanguage('sv')
                props.onClose()
              }}
              title={'SV'} height={40} width={80}
              color={Colors.neutral3}
              textStyle={Ts.languageAndAtlasCodeButtonText}
              textColor={Colors.darkText}
            />
            :
            <ButtonComponent
              onPressFunction={async () => {
                await saveLanguage('sv')
                props.onClose()
              }}
              title={'SV'} height={40} width={80} buttonStyle={Bs.logoutButton}
              gradientColorStart={i18n.language === 'sv' ? Colors.primaryButton1 : Colors.neutralButton}
              gradientColorEnd={i18n.language === 'sv' ? Colors.primaryButton2 : Colors.neutralButton}
              shadowColor={i18n.language === 'sv' ? Colors.primaryShadow : Colors.neutralShadow}
              textStyle={Ts.languageButtonText} iconName={undefined} iconType={undefined} iconSize={undefined}
              contentColor={i18n.language === 'sv' ? Colors.whiteText : Colors.darkText}
            />
          }
          {i18n.language === 'en' ?
            <SelectedButtonComponent
              onPress={async () => {
                await saveLanguage('en')
                props.onClose()
              }}
              title={'EN'} height={40} width={80}
              color={Colors.neutral3}
              textStyle={Ts.languageAndAtlasCodeButtonText}
              textColor={Colors.darkText}
            />
            :
            <ButtonComponent
              onPressFunction={async() => {
                await saveLanguage('en')
                props.onClose()
              }}
              title={'EN'} height={40} width={80} buttonStyle={Bs.logoutButton}
              gradientColorStart={i18n.language === 'en' ? Colors.primaryButton1 : Colors.neutralButton}
              gradientColorEnd={i18n.language === 'en' ? Colors.primaryButton2 : Colors.neutralButton}
              shadowColor={i18n.language === 'en' ? Colors.primaryShadow : Colors.neutralShadow}
              textStyle={Ts.languageButtonText} iconName={undefined} iconType={undefined} iconSize={undefined}
              contentColor={i18n.language === 'en' ? Colors.whiteText : Colors.darkText}
            />
          }
        </View>
      </View>
    </Modal>
  )
}

export default UserModalComponent