import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react-native'
import { renderWithProviders } from '../../../helpers/testHelper'
import Navigator from '../../../navigation/Navigator'
import * as en from '../../../languages/translations/en.json'
import * as fi from '../../../languages/translations/fi.json'
import * as sv from '../../../languages/translations/sv.json'

describe('LoginComponent', () => {
  it('should display the login component correctly', async () => {
    renderWithProviders(<Navigator initialRoute='login'/>)

    // Check everything is displayed in Finnish
    await waitFor(() => expect(screen.getAllByText(fi['mobile vihko'])).toHaveLength(2))
    expect(screen.getByText(fi['login text'])).toBeDefined()
    expect(screen.getByText('FI')).toBeDefined()
    expect(screen.getByText('SV')).toBeDefined()
    expect(screen.getByText('EN')).toBeDefined()
    fireEvent.press(screen.getByText('SV')) // Test switching language to Swedish

    // Check everything is displayed in Swedish
    expect(screen.getAllByText(sv['mobile vihko'])).toBeDefined()
    expect(screen.getByText(sv['login text'])).toBeDefined()
    expect(screen.getByText('FI')).toBeDefined()
    expect(screen.getByText('SV')).toBeDefined()
    expect(screen.getByText('EN')).toBeDefined()
    fireEvent.press(screen.getByText('EN'))

    // Check everything is displayed in English
    expect(screen.getAllByText(en['mobile vihko'])).toBeDefined()
    expect(screen.getByText(en['login text'])).toBeDefined()
    expect(screen.getByText('FI')).toBeDefined()
    expect(screen.getByText('SV')).toBeDefined()
    expect(screen.getByText('EN')).toBeDefined()
    fireEvent.press(screen.getByText('FI'))

    await waitFor(() => expect(screen.getAllByText(fi['mobile vihko'])).toHaveLength(2))
  })

  it('should login correctly and show the trip form', async () => {
    renderWithProviders(<Navigator initialRoute='login' />)

    const mobileVihko = await screen.findByText(fi['loading'])
    expect(mobileVihko).toBeDefined()
    expect(screen.getByText(fi['login text'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['login']))

    const loading = await screen.findByText(fi['loading'])
    expect(loading).toBeDefined()

    const tripFormA = await screen.findByText(fi['trip form'])
    expect(tripFormA).toBeDefined()
    fireEvent.press(screen.getByText(fi['trip form']))
    const cancel = await screen.findByText(fi['cancel'])
    expect(cancel).toBeDefined()
    fireEvent.press(screen.getByText(fi['cancel']))
    const tripFormB = await screen.findByText(fi['trip form'])
    expect(tripFormB).toBeDefined()
  })

  it('should logout successfully', async () => {
    renderWithProviders(<Navigator initialRoute='login' />)

    const tripForm = await screen.findByText(fi['trip form'])
    expect(tripForm).toBeDefined()
    fireEvent.press(screen.getByTestId('usermodal-visibility-button'))
    fireEvent.press(screen.getByTestId('logout-button'))

    await screen.findAllByText(fi['logout'])
    fireEvent.press(screen.getAllByText(fi['exit'])[0])

    const loginText = await screen.findByText(fi['login text'])
    expect(loginText).toBeDefined()
  })
})