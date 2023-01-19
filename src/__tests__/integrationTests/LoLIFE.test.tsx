import { fireEvent, waitFor } from '@testing-library/react-native'
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

  await store.dispatch(switchSchema('MHL.117', i18n.language))
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
    const { getByText, getByTestId, getAllByText, store } = renderWithProviders(<Navigator initialRoute='home'/>)

    await waitFor(async () => {await initializeComponent(store)})

    // Open the LoLIFE modal
    await waitFor(() => expect(getByText(fi['lolife'])).toBeDefined())
    fireEvent.press(getByText(fi['lolife']))

    // Press the zone dropdown to get into zone selection
    await waitFor(() => expect(getByText(fi['zone picker description'])).toBeDefined())
    expect(getByText(fi['no zone'])).toBeDefined()
    fireEvent.press(getByText(fi['no zone']))

    // Select a zone
    await waitFor(() => expect(getByText('Mölylän metsä')).toBeDefined())
    fireEvent.press(getByText('Mölylän metsä'))

    // Start the event
    await waitFor(() => expect(getByText(fi['start'])).toBeDefined())
    fireEvent.press(getByText(fi['start']))

    // MapComponent
    await waitFor(() => expect(getByTestId('map-view')).toBeDefined())

    // ExtendedNavBarComponent
    expect(getAllByText(fi['stop'])).toHaveLength(2)

    // Long press on the map, create a new observation
    fireEvent(getByTestId('map-view'), 'onLongPress', testPressLocation)

    // Expect buttons to show up for all LoLIFE observation categories
    expect(getByText('Lisää havainto')).toBeDefined()
    expect(getByText('Lisää jälkihavainto')).toBeDefined()
    expect(getByText('Lisää pesä')).toBeDefined()
    expect(getByText('Lisää papanahavainto')).toBeDefined()

    // Open and check the observation form
    fireEvent.press(getByText('Lisää havainto'))
    const prop = lolifeSchema.data.form.schema.properties.gatherings.items.properties.units.items.properties
    expect(getByTestId('saveButton')).toBeDefined()
    expect(getAllByText(fi['cancel'])).toHaveLength(2)
    expect(getByText(prop.alive.title)).toBeDefined() // Alive
    expect(getByText(prop.count.title)).toBeDefined() // Count
    expect(getByText(prop.taxonConfidence.title)).toBeDefined() // Taxon confidence
    expect(getByText(prop.recordBasis.title)).toBeDefined() // Record type
    expect(getByText(prop.notes.title)).toBeDefined() // Notes
    expect(getByText(fi['images'])).toBeDefined() // Images
    expect(getByText(fi['no image'])).toBeDefined() // No photos
    expect(getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(getByText(fi['use camera'])).toBeDefined() // Take photo

    // Fill the observation form and save
    fireEvent.changeText(getByText(prop.count.title), '1')
    // fireEvent.press(getByText(prop.taxonConfidence.title))
    // expect(getByText(prop.taxonConfidence.oneOf[0].title)).toBeDefined()
    // expect(getByText(prop.taxonConfidence.oneOf[1].title)).toBeDefined()
    fireEvent.press(getByTestId('saveButton'))

    // Check that we are back on the map view and do another long press
    await waitFor(() => expect(getByTestId('map-view')).toBeDefined())
    fireEvent(getByTestId('map-view'), 'onLongPress', testPressLocation)

    // Open and check the traces form
    fireEvent.press(getByText('Lisää jälkihavainto'))
    expect(getByTestId('saveButton')).toBeDefined()
    expect(getAllByText(fi['cancel'])).toHaveLength(2)
    expect(getByText(prop.indirectObservationType.title)).toBeDefined() // Tracks
    expect(getByText(prop.unitFact.properties.lolifeNestTree.title)).toBeDefined() // Tree species
    expect(getByText(prop.notes.title)).toBeDefined() // Notes
    expect(getByText(fi['images'])).toBeDefined() // Images
    expect(getByText(fi['no image'])).toBeDefined() // No photos
    expect(getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(getByText(fi['use camera'])).toBeDefined() // Take photo

    // Fill the traces form and save
    fireEvent.changeText(getByText(prop.notes.title), 'Tracks on a tree.')
    fireEvent.press(getByTestId('saveButton'))

    // Check that we are back on the map view and do another long press
    await waitFor(() => expect(getByTestId('map-view')).toBeDefined())
    fireEvent(getByTestId('map-view'), 'onLongPress', testPressLocation)

    // Open and check the nest site form
    fireEvent.press(getByText('Lisää pesä'))
    expect(getByTestId('saveButton')).toBeDefined()
    expect(getAllByText(fi['cancel'])).toHaveLength(2)
    expect(getByText(prop.nestType.title)).toBeDefined() // Nest type
    expect(getByText(prop.nestNotes.title)).toBeDefined() // Nest notes
    expect(getByText(prop.nestCount.title)).toBeDefined() // Nest / cavity count
    expect(getByText(prop.taxonConfidence.title)).toBeDefined() // Taxon confidence
    expect(getByText(prop.unitFact.properties.lolifeNestTree.title)).toBeDefined() // Tree species
    expect(getByText(prop.notes.title)).toBeDefined() // Notes
    expect(getByText(fi['images'])).toBeDefined() // Images
    expect(getByText(fi['no image'])).toBeDefined() // No photos
    expect(getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(getByText(fi['use camera'])).toBeDefined() // Take photo

    // Fill the nest site form and save
    fireEvent.changeText(getByText(prop.nestNotes.title), 'Small nest.')
    fireEvent.press(getByTestId('saveButton'))

    // Check that we are back on the map view and do another long press
    await waitFor(() => expect(getByTestId('map-view')).toBeDefined())
    fireEvent(getByTestId('map-view'), 'onLongPress', testPressLocation)

    // Open and check the droppings form
    fireEvent.press(getByText('Lisää papanahavainto'))
    expect(getByTestId('saveButton')).toBeDefined()
    expect(getAllByText(fi['cancel'])).toHaveLength(2)
    expect(getByText(prop.unitFact.properties.lolifeDroppingsType.title)).toBeDefined() // Droppings type
    expect(getByText(prop.unitFact.properties.lolifeDroppingsCount.title)).toBeDefined() // Droppings count
    expect(getByText(prop.unitFact.properties.lolifeDroppingsQuality.title)).toBeDefined() // Droppings quality
    expect(getByText(prop.unitFact.properties.lolifeNestTree.title)).toBeDefined() // Tree species
    expect(getByText(prop.notes.title)).toBeDefined() // Notes
    expect(getByText(fi['images'])).toBeDefined() // Images
    expect(getByText(fi['no image'])).toBeDefined() // No photos
    expect(getByText(fi['choose image'])).toBeDefined() // Choose photo
    expect(getByText(fi['use camera'])).toBeDefined() // Take photo

    // Fill the droppings form and save
    fireEvent.changeText(getByText(prop.notes.title), 'On a tree.')
    fireEvent.press(getByTestId('saveButton'))

    // Check that we are back at the map view again, and press the stop button again
    await waitFor(() => expect(getByTestId('map-view')).toBeDefined())
    expect(getAllByText(fi['stop'])).toHaveLength(2)
    fireEvent.press(getAllByText(fi['stop'])[0])

    // Check that the 'Do you really want to quit' modal pops up, this time press the 'Yes, stop' button
    expect(getAllByText(fi['do not stop'])).toHaveLength(2)
    expect(getAllByText(fi['stop'])).toHaveLength(4)
    fireEvent.press(getAllByText(fi['stop'])[3])

    // Check that the submit form is displayed, press save to submit
    const prop2 = lolifeSchema.data.form.schema.properties
    await waitFor(() => expect(getByTestId('saveButton')).toBeDefined())
    expect(getByText(fi['cancel'])).toBeDefined()
    expect(getByText(fi['delete path'])).toBeDefined()
    expect(getByText(prop2.gatheringEvent.properties.legPublic.title)).toBeDefined()
    expect(getByText(prop2.secureLevel.title)).toBeDefined()
    expect(getByText(prop2.gatheringEvent.properties.dateBegin.title)).toBeDefined() // Alku
    expect(getByText(prop2.gatheringEvent.properties.dateEnd.title)).toBeDefined() //Loppu
    expect(getByText(prop.notes.title)).toBeDefined() // Notes
    expect(getByText(prop2.keywords.title)).toBeDefined()
    fireEvent.press(getByTestId('saveButton'))

    // Check that the SendEventModal pops up
    await waitFor(() => expect(getByText(fi['send public'])).toBeDefined())
    expect(getByText(fi['do not submit'])).toBeDefined()
    fireEvent.press(getByText(fi['do not submit']))

    // Check that we are back at the home screen
    await waitFor(() => expect(getByText(fi['trip form'])).toBeDefined())
    expect(getByText(fi['bird atlas'])).toBeDefined()
    expect(getByText(fi['fungi atlas'])).toBeDefined()
    expect(getAllByText(fi['lolife'])).toHaveLength(2)
  })
})