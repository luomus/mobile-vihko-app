import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react-native'

import Navigator from '../navigation/Navigator'
import { renderWithProviders } from '../helpers/testHelper'
import * as fi from '../languages/translations/fi.json'

describe('Application', () => {
  it('is able to skip the login screen and start the test at the home screen', async () => {
    const { getByText } = renderWithProviders(<Navigator initialRoute='home'/>)

    await waitFor(() => expect(getByText(fi['trip form'])).toBeDefined())
    //expect(getByText('Käyttääksesi sovellusta, sinun tulee kirjautua sisään.')).toBeUndefined()
    fireEvent.press(getByText(fi['trip form']))

    await waitFor(() => expect(getByText(fi['start'])).toBeDefined())
  })
})