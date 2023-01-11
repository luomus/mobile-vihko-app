import React from 'react'
import { fireEvent, waitFor, within } from '@testing-library/react-native'
import Navigator from '../navigation/Navigator'
import { renderWithProviders } from '../helpers/testHelper'

let testPressLocation = {
  nativeEvent: {
    coordinate: {
      latitude: 60.17102521395383,
      longitude: 24.931066744029522
    }
  }
}

describe('Application', () => {
  it('creates and posts an event successfully', async () => {
    const { getByText, getAllByText, getByTestId, getAllByTestId } = renderWithProviders(<Navigator initialRoute='login'/>)

    //LoginComponent
    await waitFor(() => expect(getByText('Käyttääksesi sovellusta, sinun tulee kirjautua sisään.')).toBeDefined())
    fireEvent.press(getByText('Kirjaudu sisään'))

    //HomeComponent
    await waitFor(() => expect(getAllByText('Retkilomake')).toHaveLength(3))
    fireEvent.press(getByText('Retkilomake'))

    //FormLauncherComponent
    await waitFor(() => expect(getByText('Aloita')).toBeDefined())
    fireEvent.press(getByText('Aloita'))

    //MapComponent
    await waitFor(() => expect(getByTestId('map-view')).toBeDefined())
    fireEvent(getByTestId('map-view'), 'onLongPress', testPressLocation)

    //ObservationButtonsComponent
    await waitFor(() => expect(getByText('+ Havainto')).toBeDefined())
    fireEvent.press(getByText('+ Havainto'))

    //ObservationComponent
    await waitFor(() => expect(getByTestId('autocomplete')).toBeDefined())
    fireEvent.changeText(getByTestId('autocomplete'), 'varis')
    await waitFor(() => expect(getByTestId('Määrä')).toBeDefined())
    fireEvent.changeText(getByTestId('Määrä'), '1')
    await waitFor(() => expect(getByTestId('saveButton')).toBeDefined())
    fireEvent.press(getByTestId('saveButton'))

    //MapComponent
    await waitFor(() => expect(getByTestId('map-view')).toBeDefined())
    expect(getByTestId('homeButton')).toBeDefined()
    fireEvent.press(getByTestId('homeButton'))

    //HomeComponent
    await waitFor(() => expect(getByText('Käynnissä oleva havaintotapahtuma')).toBeDefined())
    expect(getByText('Havaintoja: 1 kpl')).toBeDefined()
    expect(getByTestId('stopFromHomeComponent')).toBeDefined()
    fireEvent.press(getByTestId('stopFromHomeComponent'))
    //expect(within(getByTestId('stopFromHomeMessage')).getByText('Lopeta'))
    const topMessage = getAllByTestId('stopFromHomeMessage')[0]
    fireEvent.press(within(topMessage).getByText('Lopeta'))

    //DocumentComponent
    await waitFor(() => expect(getByTestId('Paikannimet (kunta tallentuu automaattisesti)')).toBeDefined())
    fireEvent.changeText(getByTestId('Paikannimet (kunta tallentuu automaattisesti)'), 'Etu-Töölö')
    expect(getByTestId('Sää')).toBeDefined()
    fireEvent.changeText(getByTestId('Sää'), 'Pouta')
    expect(getByTestId('saveButton')).toBeDefined()
    fireEvent.press(getByTestId('saveButton'))

    //SendEventModalComponent
    await waitFor(() => expect(getByText('Lähetä julkisena')).toBeDefined())
    fireEvent.press(getByText('Lähetä julkisena'))

    //HomeComponent
    await waitFor(() => expect(getByText('Retkilomake')).toBeDefined())
  })
})