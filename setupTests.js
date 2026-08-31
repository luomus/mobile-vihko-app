import '@testing-library/jest-native/extend-expect'
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js'
import mockKeyboardController from 'react-native-keyboard-controller/jest'

//react-hook-form
global.window = {}
global.window = global

jest.mock('react-native-maps', () => {
  const mock = require('./src/mocks/reactNativeMaps')
  return {
    __esModule: true,
    default: mock.default,
    Marker: mock.Marker,
    UrlTile: mock.UrlTile,
    Geojson: mock.Geojson,
    WMSTile: mock.WMSTile,
  }
})
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo)
jest.mock('react-native-keyboard-controller', () => mockKeyboardController)
jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn()
}))
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

jest.mock('./src/api/services/lajiApiService')
jest.mock('./src/helpers/axiosHelper')
jest.mock('./src/helpers/geolocationHelper')
jest.mock('./src/helpers/sentry')
jest.mock('./src/services/atlasService')
jest.mock('./src/services/autocompleteService')
jest.mock('./src/services/loggerService')
jest.mock('./src/services/versionService')
