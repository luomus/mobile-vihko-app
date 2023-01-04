import type NetInfo from '@react-native-community/netinfo';
import {
  configure,
  NetInfoState,
  NetInfoStateType,
  useNetInfo,
} from '@react-native-community/netinfo';
export { NetInfoStateType };
const connectedState: NetInfoState = {
  type: NetInfoStateType.wifi,
  isConnected: true,
  isInternetReachable: true,
  details: {
    ssid: null,
    bssid: null,
    strength: null,
    ipAddress: null,
    subnet: null,
    frequency: null,
    isConnectionExpensive: false,
    linkSpeed: null,
    rxLinkSpeed: null,
    txLinkSpeed: null,
  },
};

export default <typeof NetInfo>{
  fetch: () => Promise.resolve(connectedState),
  refresh: () => Promise.resolve(connectedState),
  configure: jest.fn() as unknown as typeof configure,
  addEventListener: () => jest.fn(),
  useNetInfo: jest.fn() as unknown as typeof useNetInfo,
};