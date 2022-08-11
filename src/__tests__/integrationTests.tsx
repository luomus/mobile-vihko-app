import React from 'react'
import { fireEvent, waitFor, within } from '@testing-library/react-native'
import Navigator from '../navigation/Navigator'
import { renderWithProviders } from '../helpers/testHelper'

describe('Application', () => {
  it('creates and posts an event successfully', async () => {
    const { getByText, getByTestId, getAllByTestId } = renderWithProviders(<Navigator />)

    //LoginComponent
    await waitFor(() => {
      expect(getByText('Käyttääksesi sovellusta, sinun tulee kirjautua sisään.')).toBeDefined()
      fireEvent.press(getByText('Kirjaudu sisään'))
    })

    //HomeComponent
    await waitFor(() => {
      expect(getByText('Retkilomake')).toBeDefined()
      fireEvent.press(getByText('Retkilomake'))
    })

    //FormLauncherComponent
    await waitFor(() => {
      expect(getByText('Aloita')).toBeDefined()
      fireEvent.press(getByText('Aloita'))
    })

    //MapComponent
    await waitFor(() => {
      expect(getByText('Merkitse piste')).toBeDefined()
      fireEvent.press(getByText('Merkitse piste'))
    })

    //ObservationButtonsComponent
    await waitFor(() => {
      expect(getByText('+ Havainto')).toBeDefined()
      fireEvent.press(getByText('+ Havainto'))
    })

    //ObservationComponent
    await waitFor(() => {
      expect(getByTestId('autocomplete')).toBeDefined()
      fireEvent.changeText(getByTestId('autocomplete'), 'varis')
      expect(getByTestId('Määrä')).toBeDefined()
      fireEvent.changeText(getByTestId('Määrä'), '1')
      expect(getByTestId('saveButton')).toBeDefined()
      fireEvent.press(getByTestId('saveButton'))
    })

    //MapComponent
    await waitFor(() => {
      expect(getByText('Merkitse piste')).toBeDefined()
      expect(getByTestId('homeButton')).toBeDefined()
      fireEvent.press(getByTestId('homeButton'))
    })

    //HomeComponent
    await waitFor(() => {
      expect(getByText('Käynnissä oleva havaintotapahtuma')).toBeDefined()
      expect(getByText('Havaintoja: 1 kpl')).toBeDefined()
      expect(getByTestId('stopFromHomeComponent')).toBeDefined()
      fireEvent.press(getByTestId('stopFromHomeComponent'))
      //expect(within(getByTestId('stopFromHomeMessage')).getByText('Lopeta'))
      const topMessage = getAllByTestId('stopFromHomeMessage')[0]
      fireEvent.press(within(topMessage).getByText('Lopeta'))
    })

    //DocumentComponent
    await waitFor(() => {
      expect(getByTestId('Paikannimet (kunta tallentuu automaattisesti)')).toBeDefined()
      fireEvent.changeText(getByTestId('Paikannimet (kunta tallentuu automaattisesti)'), 'Etu-Töölö')
      expect(getByTestId('Sää')).toBeDefined()
      fireEvent.changeText(getByTestId('Sää'), 'Pouta')
      expect(getByTestId('saveButton')).toBeDefined()
      fireEvent.press(getByTestId('saveButton'))
    })

    //SendEventModalComponent
    await waitFor(() => {
      expect(getByText('Lähetä julkisena')).toBeDefined()
      fireEvent.press(getByText('Lähetä julkisena'))
    })

    //HomeComponent
    await waitFor(() => {
      expect(getByText('Retkilomake')).toBeDefined()
    })
  })
})