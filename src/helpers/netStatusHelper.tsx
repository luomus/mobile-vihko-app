import i18n from '../languages/i18n'
import NetInfo from '@react-native-community/netinfo'

export const netStatusChecker = async () => {
  NetInfo.configure({
    reachabilityRequestTimeout: 30 * 1000 // 30 sec
  })

  const netState = await NetInfo.fetch()

  if (netState.isInternetReachable === false) {
    throw new Error(i18n.t('no connection'))
  }
}