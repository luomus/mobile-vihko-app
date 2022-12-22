import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { renderWithProviders } from '../../../helpers/testHelper'
import Navigator from '../../../navigation/Navigator'
import * as en from '../../../languages/translations/en.json'
import * as fi from '../../../languages/translations/fi.json'
import * as sv from '../../../languages/translations/sv.json'

describe('LoginComponent', () => {
  it('santa claus', async () => {
    const { getByText, getAllByText } = renderWithProviders(<Navigator initialRoute='login'/>)

    // Check everything is displayed in Finnish
    await waitFor(() => expect(getAllByText(fi['mobile vihko'])).toBeDefined())
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
    expect(getByText(fi['login text'])).toBeDefined()
    fireEvent.press(getByText(fi['login']))

    await waitFor(() => expect(getAllByText(fi['trip form'])).toHaveLength(4))
    fireEvent.press(getByText(fi['trip form']))
  })
})
