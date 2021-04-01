import i18n from '../languages/i18n'
import NetInfo from '@react-native-community/netinfo'

export const netStatusChecker = async () => {
  const netState = await NetInfo.fetch()

  if (!netState.isInternetReachable) {
    throw {
      message: i18n.t('no connection')
    }
  }
}