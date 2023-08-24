import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { CredentialsType, ObservationZonesType, store } from '../../../stores'
import i18n from 'i18next'
import { HomeComponentContainer } from '../../../components/home/HomeComponent'
import { renderWithProviders } from '../../../helpers/testHelper'

describe('HomeComponent', () => {
  it('displays FormLaunchers', async () => {
    const isFocused = jest.fn()
    const onLogout = jest.fn()
    const onPressMap = jest.fn()
    const onPressObservationEvent = jest.fn()
    const onPressFinishObservationEvent = jest.fn()

    const pressCounter = 0
    const setPressCounter = jest.fn()
    const observationEvents: Element[] = []
    const setObservationEvents = jest.fn()
    const sentEvents: Element[] = []
    const setSentEvents = jest.fn()
    const tripModalVisibility = false
    const setTripModalVisibility = jest.fn()
    const gridModalVisibility = false
    const setGridModalVisibility = jest.fn()
    const fungiModalVisibility = false
    const setFungiModalVisibility = jest.fn()
    const dragonflyModalVisibility = false
    const setDragonflyModalVisibility = jest.fn()
    const butterflyModalVisibility = false
    const setButterflyModalVisibility = jest.fn()
    const largeFlowersModalVisibility = false
    const setLargeFlowersModalVisibility = jest.fn()
    const mothModalVisibility = false
    const setMothModalVisibility = jest.fn()
    const bumblebeeModalVisibility = false
    const setBumblebeeModalVisibility = jest.fn()
    const herpModalVisibility = false
    const setHerpModalVisibility = jest.fn()
    const subarcticModalVisibility = false
    const setSubarcticModalVisibility = jest.fn()
    const macrolichenModalVisibility = false
    const setMacrolichenModalVisibility = jest.fn()
    const bracketFungiModalVisibility = false
    const setBracketFungiModalVisibility = jest.fn()
    const practicalFungiModalVisibility = false
    const setPracticalFungiModalVisibility = jest.fn()
    const zoneModalVisibility = false
    const setZoneModalVisibility = jest.fn()
    const atlasInstructionModalVisibility = false
    const setAtlasInstructionModalVisibility = jest.fn()
    const loading = false
    const setLoading = jest.fn()

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
    const observationEvent = {
      events: [
        {
          'editors': [
            'MA.1',
          ],
          'formID': 'MHL.117',
          'gatheringEvent': {
            'completeList': {
              'completeListTaxonID': 'MX.37580',
              'completeListType': 'MY.completeListTypeComplete',
            },
            'dateBegin': '2022-06-14',
            'dateEnd': '2022-06-14',
            'leg': [
              'MA.1',
            ],
            'legPublic': true,
            'timeEnd': '14:13',
            'timeStart': '14:12',
          },
          'gatherings': [
            {
              'geometry': {
                'coordinates': [
                  [
                    [
                      25.008844370894142,
                      60.30546566473638,
                    ],
                    [
                      25.186017045885585,
                      60.30800283320715,
                    ],
                    [
                      25.19087758726229,
                      60.22008896825837,
                    ],
                    [
                      25.014178832356464,
                      60.21756077361578,
                    ],
                    [
                      25.008844370894142,
                      60.30546566473638,
                    ],
                  ],
                ],
                'type': 'Polygon',
              },
              'locality': '',
              'localityDescription': '',
              'notes': '',
              'units': [],
              'weather': '',
            },
          ],
          'grid': {
            'e': 339,
            'n': 668,
          },
          'id': 'observationEvent_f50a3a13-14d3-40db-871f-71aefc7314c5',
          'keywords': [],
          'secureLevel': 'MX.secureLevelNone',
        },
        {
          'editors': [
            'MA.2718',
          ],
          'formID': 'MHL.117',
          'gatheringEvent': {
            'completeList': {
              'completeListTaxonID': 'MX.37580',
              'completeListType': 'MY.completeListTypeComplete',
            },
            'dateBegin': '2022-06-15',
            'dateEnd': '2022-06-15',
            'leg': [
              'MA.2718',
            ],
            'legPublic': true,
            'timeEnd': '12:35',
            'timeStart': '12:35',
          },
          'gatherings': [
            {
              'geometry': {
                'coordinates': [
                  [
                    25.0915132,
                    60.240932,
                    1655285723739,
                  ],
                  [
                    25.0917748,
                    60.240521,
                    1655285729000,
                  ],
                  [
                    25.0915404,
                    60.2408948,
                    1655285730000,
                  ],
                ],
                'type': 'LineString',
              },
              'locality': '',
              'localityDescription': '',
              'notes': '',
              'units': [
                {
                  'atlasCode': 'MY.atlasCodeEnum4',
                  'id': 'observation_fd729197-b4a2-4cee-9815-0012be7e2e87',
                  'identifications': [
                    {
                      'taxon': 'teeri',
                    },
                  ],
                  'images': [],
                  'informalTaxonGroups': [
                    'MVL.1',
                  ],
                  'recordBasis': 'MY.recordBasisHumanObservation',
                  'taxonConfidence': 'MY.taxonConfidenceSure',
                  'unitFact': {
                    'autocompleteSelectedTaxonID': 'MX.26926',
                  },
                  'unitGathering': {
                    'geometry': {
                      'coordinates': [
                        25.08925974369049,
                        60.24130593208832,
                      ],
                      'type': 'Point',
                    },
                  },
                },
              ],
              'weather': '',
            },
          ],
          'grid': {
            'e': 339,
            'n': 668,
          },
          'id': 'observationEvent_7bbceefb-b6dc-4567-98ab-da9402864558',
          'keywords': [],
          'secureLevel': 'MX.secureLevelNone',
        },
      ]
    }
    const observationZone: ObservationZonesType = {
      currentZoneId: 'empty',
      zones: [{
        'geometry': null,
        'id': 'empty',
        'name': '',
      },
      {
        'geometry': {
          'geometries': [
            {
              'coordinates': [
                23.811532,
                63.693702,
              ],
              'type': 'Point',
            },
          ],
          'type': 'GeometryCollection',
        },
        'id': 'MNP.49248',
        'name': 'E2E tests (DO NOT DELETE!)',
      }
      ]
    }
    const observing = false
    const path = [[]]
    const schema = {
      formID: 'JX.519',
      fi: null,
      sv: null,
      en: null
    }

    const t = i18n.t
    const dispatch = store.dispatch

    const fetch = jest.fn()
    fetch.mockReturnValue({
      formID: 'JX.519',
      tracking: 'false',
      logs: [{}]
    })
    const save = jest.fn()

    const { getByText } = renderWithProviders(<HomeComponentContainer
      isFocused={isFocused}
      onLogout={onLogout}
      onPressMap={onPressMap}
      onPressObservationEvent={onPressObservationEvent}
      onPressFinishObservationEvent={onPressFinishObservationEvent}

      pressCounter={pressCounter}
      setPressCounter={setPressCounter}
      observationEvents={observationEvents}
      setObservationEvents={setObservationEvents}
      sentEvents={sentEvents}
      setSentEvents={setSentEvents}
      tripModalVisibility={tripModalVisibility}
      setTripModalVisibility={setTripModalVisibility}
      gridModalVisibility={gridModalVisibility}
      setGridModalVisibility={setGridModalVisibility}
      fungiModalVisibility={fungiModalVisibility}
      setFungiModalVisibility={setFungiModalVisibility}
      dragonflyModalVisibility={dragonflyModalVisibility}
      setDragonflyModalVisibility={setDragonflyModalVisibility}
      butterflyModalVisibility={butterflyModalVisibility}
      setButterflyModalVisibility={setButterflyModalVisibility}
      largeFlowersModalVisibility={largeFlowersModalVisibility}
      setLargeFlowersModalVisibility={setLargeFlowersModalVisibility}
      mothModalVisibility={mothModalVisibility}
      setMothModalVisibility={setMothModalVisibility}
      bumblebeeModalVisibility={bumblebeeModalVisibility}
      setBumblebeeModalVisibility={setBumblebeeModalVisibility}
      herpModalVisibility={herpModalVisibility}
      setHerpModalVisibility={setHerpModalVisibility}
      subarcticModalVisibility={subarcticModalVisibility}
      setSubarcticModalVisibility={setSubarcticModalVisibility}
      macrolichenModalVisibility={macrolichenModalVisibility}
      setMacrolichenModalVisibility={setMacrolichenModalVisibility}
      bracketFungiModalVisibility={bracketFungiModalVisibility}
      setBracketFungiModalVisibility={setBracketFungiModalVisibility}
      practicalFungiModalVisibility={practicalFungiModalVisibility}
      setPracticalFungiModalVisibility={setPracticalFungiModalVisibility}
      zoneModalVisibility={zoneModalVisibility}
      setZoneModalVisibility={setZoneModalVisibility}
      loading={loading}
      setLoading={setLoading}

      credentials={credentials}
      observationEvent={observationEvent}
      observationZone={observationZone}
      observing={observing}
      path={path}
      schema={schema}

      t={t}
      dispatch={dispatch}

      fetch={fetch}
      save={save}
      atlasInstructionModalVisibility={atlasInstructionModalVisibility}
      setAtlasInstructionModalVisibility={setAtlasInstructionModalVisibility}
    />)

    expect(getByText('Retkilomake')).toBeDefined()
    expect(getByText('Lintuatlas')).toBeDefined()
    expect(getByText('Sieniatlas')).toBeDefined()
    expect(getByText('Liituri')).toBeDefined()

    fireEvent.press(getByText('Retkilomake'))
    expect(setTripModalVisibility).toHaveBeenCalledTimes(1)

    fireEvent.press(getByText('Lintuatlas'))
    expect(setAtlasInstructionModalVisibility).toHaveBeenCalledTimes(1)

    fireEvent.press(getByText('Sieniatlas'))
    expect(setFungiModalVisibility).toHaveBeenCalledTimes(1)

    fireEvent.press(getByText('Liituri'))
    expect(setZoneModalVisibility).toHaveBeenCalledTimes(1)
  })
})