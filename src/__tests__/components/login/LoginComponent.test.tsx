import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { renderWithProviders } from '../../../helpers/testHelper'
import Navigator from '../../../navigation/Navigator'
import * as en from '../../../languages/translations/en.json'
import * as fi from '../../../languages/translations/fi.json'
import * as sv from '../../../languages/translations/sv.json'
jest.mock('@react-native-community/netinfo')
describe('LoginComponent', () => {

  let container: any

  beforeEach(() => {
    container = renderWithProviders(<Navigator initialRoute='login'/>)
  })

  it('should display the login component correctly', async () => {
    // Check everything is displayed in Finnish
    await waitFor(() => expect(container.getAllByText(fi['mobile vihko'])).toBeDefined())
    expect(container.getByText(fi['login text'])).toBeDefined()
    expect(container.getByText('FI')).toBeDefined()
    expect(container.getByText('SV')).toBeDefined()
    expect(container.getByText('EN')).toBeDefined()
    fireEvent.press(container.getByText('SV')) // Test switching language to Swedish

    // Check everything is displayed in Swedish
    expect(container.getAllByText(sv['mobile vihko'])).toBeDefined()
    expect(container.getByText(sv['login text'])).toBeDefined()
    expect(container.getByText('FI')).toBeDefined()
    expect(container.getByText('SV')).toBeDefined()
    expect(container.getByText('EN')).toBeDefined()
    fireEvent.press(container.getByText('EN'))

    // Check everything is displayed in English
    expect(container.getAllByText(en['mobile vihko'])).toBeDefined()
    expect(container.getByText(en['login text'])).toBeDefined()
    expect(container.getByText('FI')).toBeDefined()
    expect(container.getByText('SV')).toBeDefined()
    expect(container.getByText('EN')).toBeDefined()
    fireEvent.press(container.getByText('FI'))

    expect(container.getAllByText(fi['mobile vihko'])).toBeDefined()
  })

  it('should login correctly and show the trip form', async () => {
    await waitFor(() => expect(container.getAllByText(fi['mobile vihko'])).toBeDefined())
    expect(container.getByText(fi['login text'])).toBeDefined()
    fireEvent.press(container.getByText(fi['login']))

    await waitFor(() => expect(container.getAllByText(fi['trip form'])).toHaveLength(4))
    fireEvent.press(container.getByText(fi['trip form']))
  })

  it('should display no network error message', async () => {
    it('offline', async () => {
      NetInfo.isConnected.fetch.mockResolvedValueOnce(false)
      expect(await checkNetwork()).toBe(NO_NETWORK_CONNECTION)
    })

  })
})
