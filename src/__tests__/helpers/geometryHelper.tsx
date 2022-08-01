import { LineString } from 'geojson'
import { createUnitBoundingBox, setEventGeometry } from '../../helpers/geometryHelper'

describe('geometryHelper', () => {
  it('returns path if event has a path', () => {
    const event = {
      'editors': [
        'MA.1'
      ],
      'formID': 'JX.519',
      'gatheringEvent': {
        'dateBegin': '2022-08-01T10:14',
        'dateEnd': '2022-08-01T10:15',
        'leg': [
          'MA.1',
        ],
        'legPublic': true,
      },
      'gatherings': [
        {
          'geometry': {
            'coordinates': [
              [
                24.9656933,
                60.203925,
                1659338043676
              ],
              [
                24.9654382,
                60.2036354,
                1659338059380
              ],
              [
                24.965161,
                60.2033446,
                1659338062420
              ],
              [
                24.9648439,
                60.203053,
                1659338066319
              ],
              [
                24.9645175,
                60.202797,
                1659338070890
              ],
              [
                24.9641681,
                60.2025329,
                1659338073921
              ],
              [
                24.9638499,
                60.2023002,
                1659338076921
              ],
              [
                24.9634436,
                60.2021195,
                1659338080570
              ],
              [
                24.9629194,
                60.2020111,
                1659338084018
              ],
              [
                24.9624173,
                60.2018713,
                1659338087458
              ],
              [
                24.9621553,
                60.2016294,
                1659338090820
              ],
              [
                24.9621773,
                60.2013591,
                1659338094095
              ],
              [
                24.96251,
                60.2011382,
                1659338097443
              ],
              [
                24.9630855,
                60.2010219,
                1659338101101
              ],
              [
                24.9636382,
                60.2009308,
                1659338105333
              ],
              [
                24.9642272,
                60.2008214,
                1659338108433
              ],
              [
                24.9648453,
                60.200656,
                1659338112581
              ],
              [
                24.9653319,
                60.2004953,
                1659338115920
              ],
            ],
            'type': 'LineString',
          },
          'locality': 'Kumpula',
          'localityDescription': '',
          'notes': '',
          'units': [
            {
              'count': '1',
              'id': 'observation_9bfcaa3c-d063-49b7-856e-3471617410fa',
              'identifications': [
                {
                  'taxon': 'varis',
                },
              ],
              'images': [],
              'informalTaxonGroups': [
                'MVL.1',
              ],
              'recordBasis': 'MY.recordBasisHumanObservation',
              'taxonConfidence': 'MY.taxonConfidenceSure',
              'unitFact': {
                'autocompleteSelectedTaxonID': 'MX.73566',
              },
              'unitGathering': {
                'dateBegin': '2022-08-01T10:14',
                'geometry': {
                  'coordinates': [
                    24.96748309582472,
                    60.20398871971676
                  ],
                  'radius': 10,
                  'type': 'Point',
                }
              }
            }
          ],
          'weather': 'Pouta',
        }
      ],
      'grid': undefined,
      'id': 'observationEvent_2dc79b2c-e40a-44fe-85b6-28f9370023b5',
      'keywords': [],
      'secureLevel': 'MX.secureLevelNone',
    }

    const lineStringPath: LineString = {
      'coordinates': [
        [
          24.9656933,
          60.203925,
          1659338043676
        ],
        [
          24.9654382,
          60.2036354,
          1659338059380
        ],
        [
          24.965161,
          60.2033446,
          1659338062420
        ],
        [
          24.9648439,
          60.203053,
          1659338066319
        ],
        [
          24.9645175,
          60.202797,
          1659338070890
        ],
        [
          24.9641681,
          60.2025329,
          1659338073921
        ],
        [
          24.9638499,
          60.2023002,
          1659338076921
        ],
        [
          24.9634436,
          60.2021195,
          1659338080570
        ],
        [
          24.9629194,
          60.2020111,
          1659338084018
        ],
        [
          24.9624173,
          60.2018713,
          1659338087458
        ],
        [
          24.9621553,
          60.2016294,
          1659338090820
        ],
        [
          24.9621773,
          60.2013591,
          1659338094095
        ],
        [
          24.96251,
          60.2011382,
          1659338097443
        ],
        [
          24.9630855,
          60.2010219,
          1659338101101
        ],
        [
          24.9636382,
          60.2009308,
          1659338105333
        ],
        [
          24.9642272,
          60.2008214,
          1659338108433
        ],
        [
          24.9648453,
          60.200656,
          1659338112581
        ],
        [
          24.9653319,
          60.2004953,
          1659338115920
        ],
      ],
      'type': 'LineString',
    }

    const firstLocation = [
      60.20047,
      24.96541
    ]

    const grid = null

    const eventWithGeometry = setEventGeometry(event, lineStringPath, firstLocation, grid)

    expect(eventWithGeometry.gatherings[0].geometry).toEqual(lineStringPath)
  })

  it('returns grid if event has a grid', () => {
    const event = {
      'editors': [
        'MA.1'
      ],
      'formID': 'MHL.117',
      'gatheringEvent': {
        'completeList': {
          'completeListTaxonID': 'MX.37580',
          'completeListType': 'MY.completeListTypeIncomplete'
        },
        'dateBegin': '2022-08-01',
        'dateEnd': '2022-08-01',
        'leg': [
          'MA.1'
        ],
        'legPublic': true,
        'timeEnd': '10:53',
        'timeStart': '10:52'
      },
      'gatherings': [
        {
          'geometry': undefined,
          'locality': '',
          'localityDescription': '',
          'notes': '',
          'units': [
            {
              'atlasCode': 'MY.atlasCodeEnum1',
              'count': '1',
              'id': 'observation_b13fee48-308b-47e3-b019-7aec21be5347',
              'identifications': [
                {
                  'taxon': 'varis'
                }
              ],
              'images': [],
              'informalTaxonGroups': [
                'MVL.1'
              ],
              'recordBasis': 'MY.recordBasisHumanObservation',
              'taxonConfidence': 'MY.taxonConfidenceSure',
              'unitFact': {
                'autocompleteSelectedTaxonID': 'MX.73566'
              },
              'unitGathering': {
                'geometry': {
                  'coordinates': [
                    24.96762927621603,
                    60.20410584159258
                  ],
                  'type': 'Point'
                }
              }
            }
          ],
          'weather': ''
        },
      ],
      'grid': {
        'e': 338,
        'geometry': {
          'coordinates': [
            [
              [
                24.834026501877492,
                60.212944744575616
              ],
              [
                25.010681787596987,
                60.215712739890016
              ],
              [
                25.0159920557044,
                60.12780655422827
              ],
              [
                24.839807396748093,
                60.12504832987475
              ],
              [
                24.834026501877492,
                60.212944744575616
              ]
            ]
          ],
          'type': 'Polygon'
        },
        'n': 667,
        'name': 'Helsinki, Helsingin keskusta',
        'pauseGridCheck': false,
      },
      'id': 'observationEvent_896c5f2a-ad2c-47e6-8f59-fb6a78311b0c',
      'keywords': [],
      'secureLevel': 'MX.secureLevelNone',
    }

    const lineStringPath = undefined

    const firstLocation = [
      60.20047,
      24.96541
    ]

    const grid = {
      'e': 338,
      'geometry': {
        'coordinates': [
          [
            [
              24.834026501877492,
              60.212944744575616
            ],
            [
              25.010681787596987,
              60.215712739890016
            ],
            [
              25.0159920557044,
              60.12780655422827
            ],
            [
              24.839807396748093,
              60.12504832987475
            ],
            [
              24.834026501877492,
              60.212944744575616
            ]
          ]
        ],
        'type': 'Polygon'
      },
      'n': 667,
      'name': 'Helsinki, Helsingin keskusta',
      'pauseGridCheck': false,
    }

    const eventWithGeometry = setEventGeometry(event, lineStringPath, firstLocation, grid)

    expect(eventWithGeometry.gatherings[0].geometry).toEqual(grid.geometry)
  })

  it('returns bounding box of units if event has units', () => {
    const event = {
      'editors': [
        'MA.1'
      ],
      'formID': 'JX.519',
      'gatheringEvent': {
        'dateBegin': '2022-08-01T11:20',
        'dateEnd': '2022-08-01T11:21',
        'leg': [
          'MA.1'
        ],
        'legPublic': true
      },
      'gatherings': [
        {
          'geometry': undefined,
          'locality': 'Kumpula',
          'localityDescription': '',
          'notes': '',
          'units': [
            {
              'count': '1',
              'id': 'observation_4644dc17-1f34-4d07-b309-e955bedba646',
              'identifications': [
                {
                  'taxon': 'varis'
                },
              ],
              'images': [],
              'informalTaxonGroups': [
                'MVL.1',
              ],
              'recordBasis': 'MY.recordBasisHumanObservation',
              'taxonConfidence': 'MY.taxonConfidenceSure',
              'unitFact': {
                'autocompleteSelectedTaxonID': 'MX.73566',
              },
              'unitGathering': {
                'dateBegin': '2022-08-01T11:20',
                'geometry': {
                  'coordinates': [
                    24.96740866452456,
                    60.20428960380684
                  ],
                  'radius': 10,
                  'type': 'Point',
                }
              }
            },
            {
              'count': '1',
              'id': 'observation_5ed941c3-5912-482a-845b-5ef9eab38bf7',
              'identifications': [
                {
                  'taxon': 'varpunen'
                },
              ],
              'images': [],
              'informalTaxonGroups': [
                'MVL.1'
              ],
              'recordBasis': 'MY.recordBasisHumanObservation',
              'taxonConfidence': 'MY.taxonConfidenceSure',
              'unitFact': {
                'autocompleteSelectedTaxonID': 'MX.36573'
              },
              'unitGathering': {
                'dateBegin': '2022-08-01T11:21',
                'geometry': {
                  'coordinates': [
                    24.963249899446964,
                    60.20255056894177
                  ],
                  'radius': 10,
                  'type': 'Point'
                }
              }
            }
          ],
          'weather': 'Pouta'
        }
      ],
      'grid': undefined,
      'id': 'observationEvent_e357855a-274c-41b7-9127-f9a7f9d51dbc',
      'keywords': [],
      'secureLevel': 'MX.secureLevelNone',
    }

    const lineStringPath = undefined

    const firstLocation = [
      60.203925,
      24.9656933,
    ]

    const grid = null

    const eventWithGeometry = setEventGeometry(event, lineStringPath, firstLocation, grid)

    const unitBoundingBox = createUnitBoundingBox(event)

    expect(eventWithGeometry.gatherings[0].geometry).toEqual(unitBoundingBox)
  })

  it('returns first location if there is no other options', () => {
    const event = {
      "editors": [
        "MA.1"
      ],
      "formID": "JX.519",
      "gatheringEvent": {
        "dateBegin": "2022-08-01T12:18",
        "dateEnd": "2022-08-01T12:18",
        "leg": [
          "MA.1",
        ],
        "legPublic": true,
      },
      "gatherings": [
        {
          "geometry": undefined,
          "locality": "Kumpula",
          "localityDescription": "",
          "notes": "",
          "units": [],
          "weather": "Pouta",
        },
      ],
      "grid": undefined,
      "id": "observationEvent_3839277a-6455-4e05-81e5-0348de839b2c",
      "keywords": [],
      "secureLevel": "MX.secureLevelNone",
    }

    const lineStringPath = undefined

    const firstLocation = [
      60.203925,
      24.9656933,
    ]

    const grid = null

    const eventWithGeometry = setEventGeometry(event, lineStringPath, firstLocation, grid)

    const firstLocationCoordinates = {
      coordinates: [
        firstLocation[1],
        firstLocation[0]
      ],
      type: 'Point'
    }
    expect(eventWithGeometry.gatherings[0].geometry).toEqual(firstLocationCoordinates)
  })
})