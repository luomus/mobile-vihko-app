import { fireEvent, waitFor, cleanup, TextMatch, TextMatchOptions } from '@testing-library/react-native'
import React from 'react'
import { renderWithProviders } from '../../../helpers/testHelper'
import Navigator from '../../../navigation/Navigator'
import * as en from '../../../languages/translations/en.json'
import * as fi from '../../../languages/translations/fi.json'
import * as sv from '../../../languages/translations/sv.json'
import { ReactTestInstance } from 'react-test-renderer'

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
    await waitFor(() => expect(getAllByText(fi['mobile vihko'])).toHaveLength(2))
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

    await waitFor(() => expect(getAllByText(fi['mobile vihko'])).toHaveLength(2))
  })

  it('should login correctly and show the trip form', async () => {
    await waitFor(() => expect(getAllByText(fi['mobile vihko'])).toHaveLength(2))
    expect(getByText(fi['login text'])).toBeDefined()
    fireEvent.press(getByText(fi['login']))

    await waitFor(() => expect(getByText(fi['loading'])).toBeDefined())

    await waitFor(() => expect(getByText(fi['trip form'])).toBeDefined())
    fireEvent.press(getByText(fi['trip form']))
    await waitFor(() => expect(getByText(fi['cancel'])).toBeDefined())
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