import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react-native'
import Navigator from '../navigation/Navigator'
import { renderWithProviders } from '../helpers/testHelper'

describe('Navigator', () => {
  it('renders LoginComponent', async () => {
    const { getByText, debug } = renderWithProviders(<Navigator />)
    await waitFor(() => {
      expect(getByText('Käyttääksesi sovellusta, sinun tulee kirjautua sisään.')).toBeDefined()
    })
    await waitFor(() => {
      fireEvent.press(getByText('Kirjaudu sisään'))
    })
    await waitFor(() => {
      expect(getByText('Retkilomake'))
    })
    console.log(debug)
  })
})