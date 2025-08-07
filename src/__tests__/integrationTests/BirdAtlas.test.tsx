import { screen, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { additionalJX519Fields, overrideJX519ObservationEventFields } from '../../config/fields'
import { renderWithProviders } from '../../helpers/testHelper'
import * as fi from '../../languages/translations/fi.json'
import * as fi2 from '../../schemas/birdAtlasFi.json'
import Navigator from '../../navigation/Navigator'
import { CredentialsType, switchSchema, setCredentials } from '../../stores'
import { ActionSheetIOS } from 'react-native'
import i18n from '../../languages/i18n'

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

  await store.dispatch(switchSchema({ formID: 'MHL.117', lang: i18n.language }))
}

const testPressLocation = {
  nativeEvent: {
    coordinate: {
      latitude: 60.17102521395383,
      longitude: 24.931066744029522
    }
  }
}

ActionSheetIOS.showActionSheetWithOptions = (obj, callback) => callback(2)

describe('BirdAtlas', () => {
  test('is able to add bird atlas observations and save the event', async () => {
    // jest.setTimeout(10000)

    const { store } = renderWithProviders(<></>)
    await initializeComponent(store)
    renderWithProviders(<Navigator initialRoute='home'/>)

    expect(screen.getAllByText(fi['bird atlas'])).toBeDefined()
    fireEvent.press(screen.getAllByText(fi['bird atlas'])[0])

    // This opens the AtlasInstruction modal
    expect(screen.getByText(fi['continue'])).toBeDefined()
    expect(screen.getByText(fi['cancel'])).toBeDefined()
    expect(screen.getByText(fi['grid description intro'], { exact: false })).toBeDefined()
    fireEvent.press(screen.getByText(fi['continue']))

    // This opens the GridModalComponent
    expect(await screen.findByText(fi['your current location is'], { exact: false })).toBeDefined()
    expect(screen.getByText(fi['link to result service'])).toBeDefined()
    expect(screen.getByText(fi['start'])).toBeDefined()
    expect(screen.getByText(fi['cancel'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['start']))

    // MapComponent
    expect(await screen.findByTestId('map-view')).toBeDefined()

    // ExtendedNavBarComponent
    expect(screen.getAllByText(fi['stop'])).toBeDefined()
    //expect(getByText(fi['to map'])).toBeDefined()

    // Buttons on MapComponent
    expect(screen.getByTestId('toggle-map-type-btn')).toBeDefined()
    expect(screen.getByTestId('center-map-btn')).toBeDefined()

    // Long press on the map, create a new observation
    fireEvent(screen.getByTestId('map-view'), 'onLongPress', testPressLocation)

    // Buttons from ObservationButtonsComponent
    expect(screen.getByText('+ ' + fi['observation'])).toBeDefined()
    expect(screen.getByText(fi['cancel'])).toBeDefined()

    // Press the +Observation button to open the observation form
    fireEvent.press(screen.getByText('+ ' + fi['observation']))

    const prop = fi2.data.form.schema.properties.gatherings.items.properties.units.items.properties
    expect(screen.getByTestId('saveButton')).toBeDefined()
    expect(screen.getAllByText(fi['cancel'])).toBeDefined()
    expect(screen.getByText(fi['species'])).toBeDefined()
    expect(screen.getByTestId('autocomplete')).toBeDefined()
    expect(screen.getByText(prop.atlasCode.title)).toBeDefined()
    expect(screen.getByText(prop.count.title)).toBeDefined() // Count
    expect(screen.getByText(additionalJX519Fields.unitGathering_geometry_radius.title[0])).toBeDefined() // Accuracy (m)
    expect(screen.getByText(prop.notes.title)).toBeDefined() // Notes
    expect(screen.getByText(fi['images'])).toBeDefined() // Images
    expect(screen.getByText(fi['no image'])).toBeDefined() // No photos
    expect(screen.getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(screen.getByText(fi['use camera'])).toBeDefined() // Take photo

    // Type 'test' into the autocomplete field (species)
    fireEvent.changeText(screen.getByTestId('autocomplete'), 'test')

    // Check that all the mock fields of the autocomplete is there
    expect(await screen.findByText('varis')).toBeDefined()
    for (const e of ['vihervarpunen', 'kirjosieppo', 'varpunen', 'kuusitiainen']) {
      expect(screen.getByText(e)).toBeDefined()
    }
    /*for (let i of ['Empty', '1', '2', '3', '4', '5', '6', '61', '62', '63', '64', '65', '66', '7', '71', '72', '73', '74', '75', '8', '81', '82']) {
      expect(getByText(i)).toBeDefined()
    }*/

    // Select vihervarpunen
    fireEvent.press(screen.getByText('vihervarpunen'))

    // Check that the display text of the autocomplete is what we selected
    expect(screen.getByTestId('autocomplete').props.defaultValue).toBe('vihervarpunen')

    // Type that we saw 1 and press the green save button
    fireEvent.changeText(screen.getByText(prop.count.title), '1')
    expect(screen.getByTestId('saveButton')).toBeDefined()

    fireEvent.press(screen.getByTestId('saveButton'))

    // Check that we are back on the map view and do another long press on the old observation
    expect(await screen.findByTestId('map-view')).toBeDefined()
    fireEvent(screen.getByTestId('map-view'), 'onLongPress', testPressLocation)

    // Check that the 'edit observation' modal pops up, and press the button to edit our observation
    //expect(getByText(fi['edit observations'])).toBeDefined() //TODO: why doesn't this show?
    expect(screen.getByText('vihervarpunen')).toBeDefined()
    fireEvent.press(screen.getByText('vihervarpunen'))

    // Check that all the fields are there, and press the green save button
    expect(screen.getByTestId('saveButton')).toBeDefined()
    expect(screen.getByText(fi['cancel'])).toBeDefined()
    expect(screen.getByText(fi['edit location'])).toBeDefined()
    expect(screen.getByText(fi['species'])).toBeDefined()
    expect(screen.getByTestId('autocomplete')).toBeDefined()
    expect(screen.getByText(prop.atlasCode.title)).toBeDefined()
    expect(screen.getByText(prop.count.title)).toBeDefined() // Count
    expect(screen.getByText(additionalJX519Fields.unitGathering_geometry_radius.title[0])).toBeDefined() // Accuracy (m)
    expect(screen.getByText(prop.notes.title)).toBeDefined() // Notes
    expect(screen.getByText(fi['images'])).toBeDefined() // Images
    expect(screen.getByText(fi['no image'])).toBeDefined() // No photos
    expect(screen.getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(screen.getByText(fi['use camera'])).toBeDefined() // Take photo
    // TODO: test changing the location? removing it?
    fireEvent.press(screen.getByTestId('saveButton'))

    // Check that we are back at the map view again, and press the stop button
    expect(await screen.findByTestId('map-view')).toBeDefined()
    expect(screen.getByText(fi['stop'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['stop']))

    // Check that the 'Do you really want to quit' modal pops up, try the 'do not stop' button
    expect(screen.getByText(fi['stop event'])).toBeDefined()
    expect(screen.getByText(fi['cancel'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['cancel']))

    // Check that we are back at the map view again, and press the stop button again
    expect(screen.getByTestId('map-view')).toBeDefined()
    expect(screen.getByText(fi['stop'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['stop']))

    // Check that the 'Do you really want to quit' modal pops up, this time press the 'Yes, stop' button
    expect(screen.getAllByText(fi['cancel'])).toBeDefined()
    expect(screen.getAllByText(fi['stop event'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['stop event']))

    // Check that the submit form is displayed, press save to submit
    expect(await screen.findByTestId('saveButton')).toBeDefined()
    expect(screen.getByText(fi['cancel'])).toBeDefined()
    expect(screen.getByText(fi2.data.form.schema.properties.gatheringEvent.properties.legPublic.title)).toBeDefined()
    expect(screen.getByText(fi2.data.form.schema.properties.gatheringEvent.properties.completeList.properties.completeListType.title)).toBeDefined()
    expect(screen.getByText(fi2.data.form.schema.properties.gatheringEvent.properties.dateBegin.title)).toBeDefined() // Alkupäivä
    expect(screen.getByText(fi2.data.form.schema.properties.gatheringEvent.properties.timeStart.title)).toBeDefined() // Alkuaika
    expect(screen.getByText(fi2.data.form.schema.properties.gatheringEvent.properties.dateEnd.title)).toBeDefined() //Loppupäivä
    expect(screen.getByText(fi2.data.form.schema.properties.gatheringEvent.properties.timeEnd.title)).toBeDefined() //Loppuaika
    expect(screen.getByText(overrideJX519ObservationEventFields.gatherings_0_locality.title[0])).toBeDefined()
    expect(screen.getByText(fi2.data.form.schema.properties.gatherings.items.properties.localityDescription.title)).toBeDefined()
    expect(screen.getByText(fi2.data.form.schema.properties.gatherings.items.properties.weather.title)).toBeDefined()
    expect(screen.getByText(prop.notes.title)).toBeDefined() // Notes
    expect(screen.getByText(fi2.data.form.schema.properties.keywords.title)).toBeDefined()
    fireEvent.press(screen.getByTestId('saveButton'))

    expect(await screen.findByText(fi['must choose list type'])).toBeDefined()

    // Select something
    expect(screen.getByTestId('formPicker')).toBeDefined()
    fireEvent.press(screen.getByTestId('formPicker'))
    //await waitFor(() => expect(getByText(fi2.data.form.schema.properties.gatheringEvent.properties.completeList.properties.completeListType.enumNames[1])).toBeDefined())
    //expect(getByText(fi2.data.form.schema.properties.gatheringEvent.properties.completeList.properties.completeListType.enumNames[2])).toBeDefined()
    //fireEvent.press(getByText(fi2.data.form.schema.properties.gatheringEvent.properties.completeList.properties.completeListType.enumNames[2]))
    fireEvent.press(screen.getByTestId('saveButton'))

    const success = await screen.findByText(fi['post success'])
    expect(success).toBeDefined()
  }, 10000)
})