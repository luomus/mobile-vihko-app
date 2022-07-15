import '@testing-library/jest-native/extend-expect'
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js'

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo)

jest.mock('./src/services/atlasService')
jest.mock('./src/services/autocompleteService')
jest.mock('./src/services/documentService')
jest.mock('./src/services/formPermissionService')
jest.mock('./src/services/imageService')
jest.mock('./src/services/localityService')
jest.mock('./src/services/loggerService')
jest.mock('./src/services/userService')
jest.mock('./src/services/versionService')
jest.mock('./src/services/zoneService')