import { screen, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { renderWithProviders } from '../../helpers/testHelper'
import * as fi from '../../languages/translations/fi.json'
import * as lolifeSchema from '../../schemas/lolifeFi.json'
import Navigator from '../../navigation/Navigator'
import { CredentialsType, switchSchema, setCredentials } from '../../stores'
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

describe('LoLIFE', () => {
  test('is able to add flying squirrel observations and save the event', async () => {
    // jest.setTimeout(10000)

    const { store } = renderWithProviders(<></>)
    await initializeComponent(store)
    renderWithProviders(<Navigator initialRoute='home'/>)

    // Open the LoLIFE modal
    expect(screen.getByText(fi['lolife'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['lolife']))

    // Press the zone dropdown to get into zone selection
    expect(await screen.findByText(fi['zone picker description'])).toBeDefined()
    expect(screen.getByText(fi['no zone'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['no zone']))

    // Select a zone
    expect(screen.getByText('Mölylän metsä')).toBeDefined()
    fireEvent.press(screen.getByText('Mölylän metsä'))

    // Start the event
    expect(screen.getByText(fi['start'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['start']))

    // MapComponent
    expect(await screen.findByTestId('map-view')).toBeDefined()

    // ExtendedNavBarComponent
    expect(screen.getByText(fi['stop'])).toBeDefined()

    // Long press on the map, create a new observation
    fireEvent(screen.getByTestId('map-view'), 'onLongPress', testPressLocation)

    // Expect buttons to show up for all LoLIFE observation categories
    expect(screen.getByText('+ Havainto')).toBeDefined()
    expect(screen.getByText('+ Jälkihavainto')).toBeDefined()
    expect(screen.getByText('+ Pesä')).toBeDefined()
    expect(screen.getByText('+ Papanahavainto')).toBeDefined()

    // Open and check the observation form
    fireEvent.press(screen.getByText('+ Havainto'))
    const prop = lolifeSchema.data.form.schema.properties.gatherings.items.properties.units.items.properties
    expect(screen.getByTestId('saveButton')).toBeDefined()
    expect(screen.getAllByText(fi['cancel'])).toBeDefined()
    expect(screen.getByText(prop.alive.title)).toBeDefined() // Alive
    expect(screen.getByText(prop.count.title)).toBeDefined() // Count
    expect(screen.getByText(prop.taxonConfidence.title)).toBeDefined() // Taxon confidence
    expect(screen.getByText(prop.recordBasis.title)).toBeDefined() // Record type
    expect(screen.getByText(prop.notes.title)).toBeDefined() // Notes
    expect(screen.getByText(fi['images'])).toBeDefined() // Images
    expect(screen.getByText(fi['no image'])).toBeDefined() // No photos
    expect(screen.getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(screen.getByText(fi['use camera'])).toBeDefined() // Take photo

    // Fill the observation form and save
    fireEvent.changeText(screen.getByText(prop.count.title), '1')
    // fireEvent.press(getByText(prop.taxonConfidence.title))
    // expect(getByText(prop.taxonConfidence.oneOf[0].title)).toBeDefined()
    // expect(getByText(prop.taxonConfidence.oneOf[1].title)).toBeDefined()
    fireEvent.press(screen.getByTestId('saveButton'))

    // Check that we are back on the map view and do another long press
    expect(await screen.findByTestId('map-view')).toBeDefined()
    fireEvent(screen.getByTestId('map-view'), 'onLongPress', testPressLocation)

    // Open and check the traces form
    fireEvent.press(screen.getByText('+ Jälkihavainto'))
    expect(screen.getByTestId('saveButton')).toBeDefined()
    expect(screen.getAllByText(fi['cancel'])).toBeDefined()
    expect(screen.getByText(prop.indirectObservationType.title)).toBeDefined() // Tracks
    expect(screen.getByText(prop.unitFact.properties.lolifeNestTree.title)).toBeDefined() // Tree species
    expect(screen.getByText(prop.notes.title)).toBeDefined() // Notes
    expect(screen.getByText(fi['images'])).toBeDefined() // Images
    expect(screen.getByText(fi['no image'])).toBeDefined() // No photos
    expect(screen.getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(screen.getByText(fi['use camera'])).toBeDefined() // Take photo

    // Fill the traces form and save
    fireEvent.changeText(screen.getByText(prop.notes.title), 'Tracks on a tree.')
    fireEvent.press(screen.getByTestId('saveButton'))

    // Check that we are back on the map view and do another long press
    expect(await screen.findByTestId('map-view')).toBeDefined()
    fireEvent(screen.getByTestId('map-view'), 'onLongPress', testPressLocation)

    // Open and check the nest site form
    fireEvent.press(screen.getByText('+ Pesä'))
    expect(screen.getByTestId('saveButton')).toBeDefined()
    expect(screen.getAllByText(fi['cancel'])).toBeDefined()
    expect(screen.getByText(prop.nestType.title)).toBeDefined() // Nest type
    expect(screen.getByText(prop.nestNotes.title)).toBeDefined() // Nest notes
    expect(screen.getByText(prop.nestCount.title)).toBeDefined() // Nest / cavity count
    expect(screen.getByText(prop.taxonConfidence.title)).toBeDefined() // Taxon confidence
    expect(screen.getByText(prop.unitFact.properties.lolifeNestTree.title)).toBeDefined() // Tree species
    expect(screen.getByText(prop.notes.title)).toBeDefined() // Notes
    expect(screen.getByText(fi['images'])).toBeDefined() // Images
    expect(screen.getByText(fi['no image'])).toBeDefined() // No photos
    expect(screen.getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(screen.getByText(fi['use camera'])).toBeDefined() // Take photo

    // Fill the nest site form and save
    fireEvent.changeText(screen.getByText(prop.nestNotes.title), 'Small nest.')
    fireEvent.press(screen.getByTestId('saveButton'))

    // Check that we are back on the map view and do another long press
    expect(await screen.findByTestId('map-view')).toBeDefined()
    fireEvent(screen.getByTestId('map-view'), 'onLongPress', testPressLocation)

    // Open and check the droppings form
    fireEvent.press(screen.getByText('+ Papanahavainto'))
    expect(screen.getByTestId('saveButton')).toBeDefined()
    expect(screen.getAllByText(fi['cancel'])).toBeDefined()
    expect(screen.getByText(prop.unitFact.properties.lolifeDroppingsType.title)).toBeDefined() // Droppings type
    expect(screen.getByText(prop.unitFact.properties.lolifeDroppingsCount.title)).toBeDefined() // Droppings count
    expect(screen.getByText(prop.unitFact.properties.lolifeDroppingsQuality.title)).toBeDefined() // Droppings quality
    expect(screen.getByText(prop.unitFact.properties.lolifeNestTree.title)).toBeDefined() // Tree species
    expect(screen.getByText(prop.notes.title)).toBeDefined() // Notes
    expect(screen.getByText(fi['images'])).toBeDefined() // Images
    expect(screen.getByText(fi['no image'])).toBeDefined() // No photos
    expect(screen.getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(screen.getByText(fi['use camera'])).toBeDefined() // Take photo

    // Fill the droppings form and save
    fireEvent.changeText(screen.getByText(prop.notes.title), 'On a tree.')
    fireEvent.press(screen.getByTestId('saveButton'))

    // Check that we are back at the map view again, and press the stop button again
    expect(await screen.findByTestId('map-view')).toBeDefined()
    expect(screen.getAllByText(fi['stop'])).toBeDefined()
    fireEvent.press(screen.getAllByText(fi['stop'])[0])

    // Check that the 'Do you really want to quit' modal pops up, this time press the 'Yes, stop' button
    expect(screen.getByText(fi['cancel'])).toBeDefined()
    expect(screen.getByText(fi['stop event'])).toBeDefined()
    fireEvent.press(screen.getByText(fi['stop event']))

    // Check that the submit form is displayed, press save to submit
    const prop2 = lolifeSchema.data.form.schema.properties
    expect(screen.getByTestId('saveButton')).toBeDefined()
    expect(screen.getByText(fi['cancel'])).toBeDefined()
    // expect(screen.getByText(fi['delete path'])).toBeDefined()
    expect(screen.getByText(prop2.gatheringEvent.properties.legPublic.title)).toBeDefined() // Controller names
    expect(screen.getByText(prop2.secureLevel.title)).toBeDefined() // Secure level
    expect(screen.getByText(prop2.gatheringEvent.properties.dateBegin.title)).toBeDefined() // Start date
    expect(screen.getByText(prop2.gatheringEvent.properties.dateEnd.title)).toBeDefined() // End date
    expect(screen.getByText(prop2.keywords.title)).toBeDefined() // Keywords
    expect(screen.getByText(prop2.gatheringEvent.properties.gatheringFact.properties.lolifeSiteClassification.title)).toBeDefined() // Site classification
    expect(screen.getByText(prop2.gatheringEvent.properties.nextMonitoringYear.title)).toBeDefined() // Next monitoring year
    expect(screen.getByText(prop2.gatheringEvent.properties.namedPlaceNotes.title)).toBeDefined() // Route info
    fireEvent.press(screen.getByTestId('saveButton'))

    const success = await screen.findByText(fi['post success'])
    expect(success).toBeDefined()
  }, 10000)
})