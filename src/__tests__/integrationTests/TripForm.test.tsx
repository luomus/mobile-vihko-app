import { screen, fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { additionalJX519Fields, overrideJX519ObservationEventFields } from '../../config/fields'
import { renderWithProviders } from '../../helpers/testHelper'
import * as fi from '../../languages/translations/fi.json'
import * as fi2 from '../../schemas/tripFormFi.json'
import Navigator from '../../navigation/Navigator'
import { beginObservationEvent, CredentialsType, switchSchema, setCredentials } from '../../stores'
import i18n from '../../languages/i18n'

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

  await store.dispatch(switchSchema({ formID: 'JX.519', lang: i18n.language }))
  await store.dispatch(beginObservationEvent({ onPressMap, title: fi['gps notification title'], body: fi['gps notification body'] }))
}

const testPressLocation = {
  nativeEvent: {
    coordinate: {
      latitude: 60.17102521395383,
      longitude: 24.931066744029522
    }
  }
}

describe('TripForm', () => {
  test('is able to add trip form observations and save the event', async () => {
    // jest.setTimeout(10000)

    const { store } = renderWithProviders(<></>)
    await initializeComponent(store)
    renderWithProviders(<Navigator initialRoute='map'/>)

    await waitFor(async () => {await initializeComponent(store)})

    const mapViews = await screen.findAllByTestId('map-view')
    const mapView1 = mapViews[0]
    expect(mapView1).toBeDefined()

    // ExtendedNavBarComponent
    expect(screen.getByText(fi['stop'])).toBeDefined()
    //expect(getByText(fi['to map'])).toBeDefined()

    // Buttons on MapComponent
    expect(screen.getByTestId('toggle-map-type-btn')).toBeDefined()
    expect(screen.getByTestId('center-map-btn')).toBeDefined()

    // Long press on the map, create a new observation
    fireEvent(mapView1, 'onLongPress', testPressLocation)

    // Buttons from ObservationButtonsComponent
    expect(screen.getByText('+ ' + fi['observation'])).toBeDefined()
    expect(screen.getByText(fi['cancel'])).toBeDefined()

    // Press the +Observation button to open the observation form
    fireEvent.press(screen.getByText('+ ' + fi['observation']))

    const prop = fi2.data.form.schema.properties.gatherings.items.properties.units.items.properties
    expect(screen.getByTestId('saveButton')).toBeDefined()
    expect(screen.getByText(fi['species'])).toBeDefined()
    expect(screen.getByTestId('autocomplete')).toBeDefined()
    expect(screen.getByText(prop.count.title)).toBeDefined() // Count
    expect(screen.getByText(additionalJX519Fields.unitGathering_geometry_radius.title[0])).toBeDefined() // Accuracy (m)
    expect(screen.getByText(fi['time'])).toBeDefined()
    expect(screen.getByText(fi['timestamp'])).toBeDefined() // Now
    expect(screen.getByText(fi['choose time'])).toBeDefined() // Choose time
    expect(screen.getByText(prop.taxonConfidence.title)).toBeDefined() // Confidence of determination
    expect(screen.getByText(prop.wild.title)).toBeDefined() // Native status
    expect(screen.getByText(prop.atlasCode.title)).toBeDefined() // Breeding code
    expect(screen.getByText(prop.notes.title)).toBeDefined() // Notes
    expect(screen.getByText(fi['images'])).toBeDefined() // Images
    expect(screen.getByText(fi['no image'])).toBeDefined() // No photos
    expect(screen.getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(screen.getByText(fi['use camera'])).toBeDefined() // Take photo

    // Type 'test' into the autocomplete field (species)
    fireEvent.changeText(screen.getByTestId('autocomplete'), 'test')

    // Check that all the mock fields of the autocomplete is there
    const varis = await screen.findByText('varis')
    expect(varis).toBeDefined()
    for (const e of ['vihervarpunen', 'kirjosieppo', 'varpunen', 'kuusitiainen']) {
      expect(screen.getByText(e)).toBeDefined()
    }

    // Select vihervarpunen
    fireEvent.press(screen.getByText('vihervarpunen'))

    // Check that the display text of the autocomplete is what we selected
    expect(screen.getByTestId('autocomplete').props.defaultValue).toBe('vihervarpunen')

    // Type that we saw 1 and press the green save button
    fireEvent.changeText(screen.getByText(prop.count.title), '1')
    expect(screen.getByTestId('saveButton')).toBeDefined()

    fireEvent.press(screen.getByTestId('saveButton'))

    // Check that we are back on the map view and do another long press on the old observation
    const mapViews2 = await screen.findAllByTestId('map-view')
    const mapView2 = mapViews2[0]
    expect(mapView2).toBeDefined()
    fireEvent(mapView2, 'onLongPress', testPressLocation)

    // Check that the 'edit obserrvation' modal pops up, and press the button to edit our observation
    //expect(getByText(fi['edit observations'])).toBeDefined() //TODO: why doesn't this show?
    expect(screen.getByText('vihervarpunen')).toBeDefined()
    fireEvent.press(screen.getByText('vihervarpunen'))

    // Check that all the fields are there, and press the green save button
    expect(screen.getByTestId('saveButton')).toBeDefined()
    expect(screen.getByText(fi['edit location'])).toBeDefined()
    expect(screen.getByText(fi['delete'])).toBeDefined()
    expect(screen.getByText(fi['species'])).toBeDefined()
    expect(screen.getByTestId('autocomplete')).toBeDefined()
    expect(screen.getByText(prop.count.title)).toBeDefined() // Count
    expect(screen.getByText(additionalJX519Fields.unitGathering_geometry_radius.title[0])).toBeDefined() // Accuracy (m)
    expect(screen.getByText(fi['time'])).toBeDefined()
    expect(screen.getByText(fi['timestamp'])).toBeDefined() // Now
    expect(screen.getByText(fi['choose time'])).toBeDefined() // Choose time
    expect(screen.getByText(prop.taxonConfidence.title)).toBeDefined() // Confidence of determination
    expect(screen.getByText(prop.wild.title)).toBeDefined() // Native status
    expect(screen.getByText(prop.atlasCode.title)).toBeDefined() // Breeding code
    expect(screen.getByText(prop.notes.title)).toBeDefined() // Notes
    expect(screen.getByText(fi['images'])).toBeDefined() // Images
    expect(screen.getByText(fi['no image'])).toBeDefined() // No photos
    expect(screen.getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(screen.getByText(fi['use camera'])).toBeDefined() // Take photo
    // TODO: test changing the location? removing it?
    fireEvent.press(screen.getByTestId('saveButton'))

    // Check that we are back at the map view again, and press the stop button
    const mapViews3 = await screen.findAllByTestId('map-view')
    const mapView3 = mapViews3[0]
    expect(mapView3).toBeDefined()
    expect(screen.getByText(fi['stop'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['stop']))

    // Check that the 'Do you really want to quit' modal pops up, try the 'do not stop' button
    expect(screen.getByText(fi['stop event'])).toBeDefined()
    expect(screen.getByText(fi['cancel'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['cancel']))

    // Check that we are back at the map view again, and press the stop button again
    const mapViews4 = await screen.findAllByTestId('map-view')
    const mapView4 = mapViews4[0]
    expect(mapView4).toBeDefined()
    expect(screen.getByText(fi['stop'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['stop']))

    // Check that the 'Do you really want to quit' modal pops up, this time press the 'Yes, stop' button
    expect(screen.getByText(fi['stop event'])).toBeDefined()
    expect(screen.getByText(fi['cancel'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['stop event']))

    // Check that the submit form is displayed, press save to submit
    const saveButton = await screen.findByTestId('saveButton')
    expect(saveButton).toBeDefined()
    expect(screen.getByText(fi2.data.form.schema.properties.gatheringEvent.properties.legPublic.title)).toBeDefined()
    expect(screen.getByText(overrideJX519ObservationEventFields.secureLevel.title[0])).toBeDefined()
    expect(screen.getByText(fi['date begin'])).toBeDefined()
    expect(screen.getByText(fi['date end'])).toBeDefined()
    expect(screen.getByText(overrideJX519ObservationEventFields.gatherings_0_locality.title[0])).toBeDefined()
    expect(screen.getByText(fi2.data.form.schema.properties.gatherings.items.properties.localityDescription.title)).toBeDefined()
    expect(screen.getByText(fi2.data.form.schema.properties.gatherings.items.properties.weather.title)).toBeDefined()
    expect(screen.getByText(prop.notes.title)).toBeDefined() // Notes
    expect(screen.getByText(fi2.data.form.schema.properties.keywords.title)).toBeDefined()

    fireEvent.press(saveButton)

    const success = await screen.findByText(fi['post success'])
    expect(success).toBeDefined()
  }, 10000)
})