import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { additionalJX519Fields, overrideJX519ObservationEventFields } from '../../../config/fields'
import { renderWithProviders } from '../../../helpers/testHelper'
import * as fi from '../../../languages/translations/fi.json'
import * as fi2 from '../../../schemas/tripFormFi.json'
import Navigator from '../../../navigation/Navigator'
import { beginObservationEvent, CredentialsType, initSchemas, setCredentials } from '../../../stores'

const onPressMap = jest.fn()

const initializeComponent = async (store:any) => {
  const credentials: CredentialsType = {
    user: {
      id: 'MA.1',
      fullName: 'Test Testman',
      emailAddress: 'test.testman@testmail.com',
      defaultLanguage: 'fi',
    },
    token: 'abc1def2ghi3jkl4',
    permissions: ['HR.2951'],
    metadata: {
      capturerVerbatim: 'test',
      intellectualOwner: 'test',
      intellectualRights: 'test'
    }
  }
  await store.dispatch(setCredentials(credentials))

  await store.dispatch(initSchemas(['JX.519']))

  await store.dispatch(beginObservationEvent(onPressMap, fi['gps notification title'], fi['gps notification body']))
}

let testPressLocation = {
  nativeEvent: {
    coordinate: {
      latitude: 60.17102521395383,
      longitude: 24.931066744029522
    }
  }
}

describe('MapComponent', () => {
  test('testing the map component', async () => {
    const { getByText, getByTestId, getAllByText, store } = renderWithProviders(<Navigator initialRoute='map'/>)

    await waitFor(async () => {await initializeComponent(store)})

    expect(getByTestId('map-view')).toBeDefined()

    // ExtendedNavBarComponent
    expect(getByText(fi['stop'])).toBeDefined()
    //expect(getByText(fi['to map'])).toBeDefined()

    // Buttons on MapComponent
    expect(getByTestId('toggle-map-type-btn')).toBeDefined()
    expect(getByTestId('center-map-btn')).toBeDefined()

    // Long press on the map, create a new observation
    fireEvent(getByTestId('map-view'), 'onLongPress', testPressLocation)

    // Buttons from ObservationButtonsComponent
    expect(getByText('+ ' + fi['observation'])).toBeDefined()
    expect(getByText(fi['cancel'])).toBeDefined()

    // Press the +Observation button to open the observation form
    fireEvent.press(getByText('+ ' + fi['observation']))

    let prop = fi2.data.form.schema.properties.gatherings.items.properties.units.items.properties
    expect(getByTestId('saveButton')).toBeDefined()
    expect(getByText(fi['species'])).toBeDefined()
    expect(getByTestId('autocomplete')).toBeDefined()
    expect(getByText(prop.count.title)).toBeDefined() // Count
    expect(getByText(additionalJX519Fields.unitGathering_geometry_radius.title[0])).toBeDefined() // Accuracy (m)
    expect(getByText(fi['time'])).toBeDefined()
    expect(getByText(fi['timestamp'])).toBeDefined() // Now
    expect(getByText(fi['choose time'])).toBeDefined() // Choose time
    expect(getByText(prop.taxonConfidence.title)).toBeDefined() // Confidence of determination
    expect(getByText(prop.wild.title)).toBeDefined() // Native status
    expect(getByText(prop.atlasCode.title)).toBeDefined() // Breeding code
    expect(getByText(prop.notes.title)).toBeDefined() // Notes
    expect(getByText(fi['images'])).toBeDefined() // Images
    expect(getByText(fi['no image'])).toBeDefined() // No photos
    expect(getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(getByText(fi['use camera'])).toBeDefined() // Take photo

    // Type 'test' into the autocomplete field (species)
    fireEvent.changeText(getByTestId('autocomplete'), 'test')

    // Check that all the mock fields of the autocomplete is there
    await waitFor(() => expect(getByText('varis')).toBeDefined())
    for (const e of ['vihervarpunen', 'kirjosieppo', 'varpunen', 'kuusitiainen']) {
      expect(getByText(e)).toBeDefined()
    }

    // Select vihervarpunen
    fireEvent.press(getByText('vihervarpunen'))

    // Check that the display text of the autocomplete is what we selected
    expect(getByTestId('autocomplete').props.defaultValue).toBe('vihervarpunen')

    // Type that we saw 1 and press the green save button
    fireEvent.changeText(getByText(prop.count.title), '1')
    expect(getByTestId('saveButton')).toBeDefined()

    fireEvent.press(getByTestId('saveButton'))

    // Check that we are back on the map view and do another long press on the old observation
    await waitFor(() => expect(getByTestId('map-view')).toBeDefined())
    fireEvent(getByTestId('map-view'), 'onLongPress', testPressLocation)

    // Check that the 'edit obserrvation' modal pops up, and press the button to edit our observation
    //expect(getByText(fi['edit observations'])).toBeDefined() //TODO: why doesn't this show?
    expect(getByText('vihervarpunen')).toBeDefined()
    fireEvent.press(getByText('vihervarpunen'))

    // Check that all the fields are there, and press the green save button
    expect(getByTestId('saveButton')).toBeDefined()
    expect(getByText(fi['edit location'])).toBeDefined()
    expect(getByText(fi['delete'])).toBeDefined()
    expect(getByText(fi['species'])).toBeDefined()
    expect(getByTestId('autocomplete')).toBeDefined()
    expect(getByText(prop.count.title)).toBeDefined() // Count
    expect(getByText(additionalJX519Fields.unitGathering_geometry_radius.title[0])).toBeDefined() // Accuracy (m)
    expect(getByText(fi['time'])).toBeDefined()
    expect(getByText(fi['timestamp'])).toBeDefined() // Now
    expect(getByText(fi['choose time'])).toBeDefined() // Choose time
    expect(getByText(prop.taxonConfidence.title)).toBeDefined() // Confidence of determination
    expect(getByText(prop.wild.title)).toBeDefined() // Native status
    expect(getByText(prop.atlasCode.title)).toBeDefined() // Breeding code
    expect(getByText(prop.notes.title)).toBeDefined() // Notes
    expect(getByText(fi['images'])).toBeDefined() // Images
    expect(getByText(fi['no image'])).toBeDefined() // No photos
    expect(getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(getByText(fi['use camera'])).toBeDefined() // Take photo
    // TODO: test changing the location? removing it?
    fireEvent.press(getByTestId('saveButton'))

    // Check that we are back at the map view again, and press the stop button
    expect(getByTestId('map-view')).toBeDefined()
    expect(getByText(fi['stop'])).toBeDefined()
    fireEvent.press(getByText(fi['stop']))

    // Check that the 'Do you really want to quit' modal pops up, try the 'do not stop' button
    await waitFor(() => expect(getAllByText(fi['stop'])).toHaveLength(2))
    expect(getByText(fi['do not stop'])).toBeDefined()
    fireEvent.press(getByText(fi['do not stop']))

    // Check that we are back at the map view again, and press the stop button again
    expect(getByTestId('map-view')).toBeDefined()
    expect(getByText(fi['stop'])).toBeDefined()
    fireEvent.press(getByText(fi['stop']))

    // Check that the 'Do you really want to quit' modal pops up, this time press the 'Yes, stop' button
    expect(getByText(fi['do not stop'])).toBeDefined()
    expect(getAllByText(fi['stop'])).toHaveLength(2)
    fireEvent.press(getAllByText(fi['stop'])[1])

    // Check that the submit form is displayed, press save to submit
    await waitFor(() => expect(getByTestId('saveButton')).toBeDefined())
    expect(getByText(fi2.data.form.schema.properties.gatheringEvent.properties.legPublic.title)).toBeDefined()
    expect(getByText(overrideJX519ObservationEventFields.secureLevel.title[0])).toBeDefined()
    expect(getByText(fi['date begin'])).toBeDefined()
    expect(getByText(fi['date end'])).toBeDefined()
    expect(getByText(overrideJX519ObservationEventFields.gatherings_0_locality.title[0])).toBeDefined()
    expect(getByText(fi2.data.form.schema.properties.gatherings.items.properties.localityDescription.title)).toBeDefined()
    expect(getByText(fi2.data.form.schema.properties.gatherings.items.properties.weather.title)).toBeDefined()
    expect(getByText(prop.notes.title)).toBeDefined() // Notes
    expect(getByText(fi2.data.form.schema.properties.keywords.title)).toBeDefined()
    fireEvent.press(getByTestId('saveButton'))

    // Check that the SendEventModal pops up
    await waitFor(() => expect(getByText(fi['send public'])).toBeDefined())
    expect(getByText(fi['send private'])).toBeDefined()
    expect(getByText(fi['do not submit'])).toBeDefined()
    fireEvent.press(getByText(fi['do not submit']))

    // Check that we are back at the home screen
    await waitFor(() => expect(getAllByText(fi['trip form'])).toHaveLength(2))
    expect(getByText(fi['bird atlas'])).toBeDefined()
    expect(getByText(fi['fungi atlas'])).toBeDefined()
    expect(getByText(fi['lolife'])).toBeDefined()
  })
})