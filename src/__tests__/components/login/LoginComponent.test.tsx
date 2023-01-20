import { fireEvent, waitFor, cleanup, TextMatch, TextMatchOptions } from '@testing-library/react-native'
import React from 'react'
import { renderWithProviders } from '../../../helpers/testHelper'
import Navigator from '../../../navigation/Navigator'
import * as en from '../../../languages/translations/en.json'
import * as fi from '../../../languages/translations/fi.json'
import * as sv from '../../../languages/translations/sv.json'
import { ReactTestInstance } from 'react-test-renderer'
import storageService from '../../../services/storageService'

describe('LoginComponent', () => {
  let getByText: (text: TextMatch, options?: TextMatchOptions) => ReactTestInstance
  let getByTestId: (text: TextMatch, options?: TextMatchOptions) => ReactTestInstance
  let getAllByText: (text: TextMatch, options?: TextMatchOptions) => ReactTestInstance[]

  beforeEach(() => {
    ({ getByText, getByTestId, getAllByText } = renderWithProviders(<Navigator initialRoute='login'/>))
  })

  afterEach(cleanup)

  it('should display the login component correctly', async () => {
    // Check everything is displayed in Finnish
    await waitFor(() => expect(getByText(fi['mobile vihko'])).toBeDefined())
    expect(getByText(fi['login text'])).toBeDefined()
    expect(getByText('FI')).toBeDefined()
    expect(getByText('SV')).toBeDefined()
    expect(getByText('EN')).toBeDefined()
    fireEvent.press(getByText('SV')) // Test switching language to Swedish

    // Check everything is displayed in Swedish
    expect(getAllByText(sv['mobile vihko'])).toBeDefined()
    expect(getByText(sv['login text'])).toBeDefined()
    expect(getByText('FI')).toBeDefined()
    expect(getByText('SV')).toBeDefined()
    expect(getByText('EN')).toBeDefined()
    fireEvent.press(getByText('EN'))

    // Check everything is displayed in English
    expect(getAllByText(en['mobile vihko'])).toBeDefined()
    expect(getByText(en['login text'])).toBeDefined()
    expect(getByText('FI')).toBeDefined()
    expect(getByText('SV')).toBeDefined()
    expect(getByText('EN')).toBeDefined()
    fireEvent.press(getByText('FI'))

    expect(getAllByText(fi['mobile vihko'])).toBeDefined()
  })

  it('should login correctly and show the trip form', async () => {
    await waitFor(() => expect(getByText(fi['mobile vihko'])).toBeDefined())
    expect(getByText(fi['login text'])).toBeDefined()
    fireEvent.press(getByText(fi['login']))

    await waitFor(() => expect(getByText(fi['loading'])).toBeDefined())

    await waitFor(() => expect(getByText(fi['trip form'])).toBeDefined())
    fireEvent.press(getByText(fi['trip form']))
    fireEvent.press(getByText(fi['cancel']))
    await waitFor(() => expect(getByText(fi['trip form'])).toBeDefined())
  })

  it('should logout successfully', async () => {
    await waitFor(() => expect(getByText(fi['loading'])).toBeDefined())

    await waitFor(() => expect(getByText(fi['new observation event'])).toBeDefined())
    expect(getByText(fi['new observation event'])).toBeDefined()
    fireEvent.press(getByTestId('usermodal-visibility-button'))
    fireEvent.press(getByTestId('logout-button'))

    await waitFor(() => expect(getAllByText(fi['logout'])).toBeDefined())
    fireEvent.press(getAllByText(fi['exit'])[0])

    await waitFor(() => expect(getByText(fi['loading'])).toBeDefined())

    await waitFor(() => expect(getByText(fi['login text'])).toBeDefined())
  })
})

const turnInternetOff = () => storageService.save('testingInternetStatus', 404)
const turnInternetOn = () => storageService.save('testingInternetStatus', 200)

describe('LoginComponent with network issues', () => {
  let getByText: (text: TextMatch, options?: TextMatchOptions) => ReactTestInstance
  beforeEach(() => {
    turnInternetOff();
    ({ getByText } = renderWithProviders(<Navigator initialRoute='login'/>))
  })

  it('should display no network error message', async () => {
    await waitFor(() => expect(getByText(fi['mobile vihko'])).toBeDefined())

    expect(getByText(fi['login text'])).toBeDefined()
    expect(getByText(fi['login'])).toBeDefined()

    await fireEvent.press(getByText(fi['login']))

    await waitFor(() => expect(getByText(fi['getting temp token failed with'], { exact: false })).toBeDefined())

    await turnInternetOn()

    fireEvent.press(getByText(fi['login']))

    await waitFor(() => expect(getByText(fi['loading'])).toBeDefined())

    expect(getByText(fi['trip form'])).toBeDefined()
  })
})