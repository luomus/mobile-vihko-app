import { LineString, MultiLineString, Point, Polygon } from 'geojson'
import { omit } from 'lodash'
import { centerOfBoundingBox, centerOfGeometry, createUnitBoundingBox, overlapsFinland, removeDuplicatesFromPath, setEventGeometry } from '../../helpers/geometryHelper'

describe('setEventGeometry', () => {
  it('sets named place as geometry if event has a named place', () => {
    const event = {
      'editors': [
        'MA.1',
      ],
      'formID': 'MHL.45',
      'gatheringEvent': {
        'dateBegin': '2022-08-05T09:10',
        'dateEnd': '2022-08-05T09:11',
        'leg': [
          'MA.1',
        ],
        'legPublic': false,
      },
      'gatherings': [
        {
          'geometry': undefined,
          'notes': 'Test',
          'units': [
            {
              'count': '1',
              'id': 'observation_1ccdf2af-2a60-43f8-aadb-91cfcb05b5d0',
              'identifications': [
                {
                  'taxonID': 'MX.48243',
                },
              ],
              'images': [],
              'lifeStage': 'MY.lifeStageAlive',
              'recordBasis': 'MY.recordBasisHumanObservationSeen',
              'rules': {
                'field': 'lifeStage',
                'regexp': '^.+$',
              },
              'taxonConfidence': 'MY.taxonConfidenceSure',
              'unitGathering': {
                'geometry': {
                  'coordinates': [
                    24.956151098012924,
                    60.20238595730231,
                  ],
                  'type': 'Point',
                },
              },
            },
          ],
        },
        {
          'geometry': {
            'geometries': [
              {
                'coordinates': [
                  [
                    [
                      24.960039,
                      60.201498,
                    ],
                    [
                      24.955933,
                      60.20383,
                    ],
                    [
                      24.952538,
                      60.201787,
                    ],
                    [
                      24.952176,
                      60.201073,
                    ],
                    [
                      24.953807,
                      60.20098,
                    ],
                    [
                      24.956487,
                      60.201443,
                    ],
                    [
                      24.960039,
                      60.201498,
                    ],
                  ],
                ],
                'type': 'Polygon',
              },
            ],
            'type': 'GeometryCollection',
          },
          'locality': 'Kumpulan puutarha',
        },
      ],
      'grid': undefined,
      'id': 'observationEvent_21f459df-5e22-4687-b45b-debcfdba7e60',
      'keywords': [],
      'namedPlaceID': 'MNP.29511',
      'secureLevel': 'MX.secureLevelNone',
    }

    const lineStringPath = undefined

    const grid = undefined

    const firstLocation = [
      60.201443,
      24.956487
    ]

    const eventWithGeometry = setEventGeometry(event, lineStringPath, firstLocation, grid)

    expect(eventWithGeometry?.gatherings[0].geometry).toEqual(event.gatherings[1].geometry)
  })

  it('sets path as geometry if there is no named place', () => {
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
        ]
      ],
      'type': 'LineString',
    }

    const firstLocation = [
      60.20047,
      24.96541
    ]

    const grid = null

    const eventWithGeometry = setEventGeometry(event, lineStringPath, firstLocation, grid)

    expect(eventWithGeometry?.gatherings[0].geometry).toEqual(lineStringPath)
  })

  it('sets grid as geometry if there is no path', () => {
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

    expect(eventWithGeometry?.gatherings[0].geometry).toEqual(grid.geometry)
  })

  it('sets bounding box of units as geometry if there is no grid', () => {
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

    const unitBoundingBox = createUnitBoundingBox(event.gatherings[0].units)

    expect(eventWithGeometry?.gatherings[0].geometry).toEqual(unitBoundingBox)
  })

  it('sets first location as geometry if there are no units', () => {
    const event = {
      'editors': [
        'MA.1'
      ],
      'formID': 'JX.519',
      'gatheringEvent': {
        'dateBegin': '2022-08-01T12:18',
        'dateEnd': '2022-08-01T12:18',
        'leg': [
          'MA.1',
        ],
        'legPublic': true,
      },
      'gatherings': [
        {
          'geometry': undefined,
          'locality': 'Kumpula',
          'localityDescription': '',
          'notes': '',
          'units': [],
          'weather': 'Pouta',
        },
      ],
      'grid': undefined,
      'id': 'observationEvent_3839277a-6455-4e05-81e5-0348de839b2c',
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

    const firstLocationCoordinates = {
      coordinates: [
        firstLocation[1],
        firstLocation[0]
      ],
      type: 'Point'
    }
    expect(eventWithGeometry?.gatherings[0].geometry).toEqual(firstLocationCoordinates)
  })

  it('sets default location as geometry if there is no first location', () => {
    const event = {
      'editors': [
        'MA.1'
      ],
      'formID': 'JX.519',
      'gatheringEvent': {
        'dateBegin': '2022-08-01T12:18',
        'dateEnd': '2022-08-01T12:18',
        'leg': [
          'MA.1',
        ],
        'legPublic': true,
      },
      'gatherings': [
        {
          'geometry': undefined,
          'locality': 'Kumpula',
          'localityDescription': '',
          'notes': '',
          'units': [],
          'weather': 'Pouta',
        },
      ],
      'grid': undefined,
      'id': 'observationEvent_3839277a-6455-4e05-81e5-0348de839b2c',
      'keywords': [],
      'secureLevel': 'MX.secureLevelNone',
    }

    const lineStringPath = undefined

    const firstLocation = undefined

    const grid = null

    const eventWithGeometry = setEventGeometry(event, lineStringPath, firstLocation, grid)

    const defaultLocation = {
      coordinates: [
        24.931409060955048,
        60.17128187292611
      ],
      type: 'Point'
    }

    expect(eventWithGeometry?.gatherings[0].geometry).toEqual(defaultLocation)
  })
})

describe('createUnitBoundingBox', () => {
  it('returns a point when there is only one unit', () => {
    const units = [
      {
        'count': '1',
        'id': 'observation_4644dc17-1f34-4d07-b309-e955bedba646',
        'identifications': [{ 'taxon': 'varis' }],
        'images': [],
        'informalTaxonGroups': ['MVL.1'],
        'recordBasis': 'MY.recordBasisHumanObservation',
        'taxonConfidence': 'MY.taxonConfidenceSure',
        'unitFact': {
          'autocompleteSelectedTaxonID': 'MX.73566'
        },
        'unitGathering': {
          'dateBegin': '2022-08-01T11:20',
          'geometry': {
            'coordinates': [24.96740866452456, 60.20428960380684],
            'radius': 10,
            'type': 'Point'
          }
        }
      },
    ]

    const unitGeometry = omit(units[0].unitGathering.geometry, 'radius')

    expect(createUnitBoundingBox(units)).toEqual(unitGeometry)
  })

  it('returns the correct bounding box when there are multiple units', () => {
    const units = [
      {
        'count': '1',
        'id': 'observation_4644dc17-1f34-4d07-b309-e955bedba646',
        'identifications': [{ 'taxon': 'varis' }],
        'images': [],
        'informalTaxonGroups': ['MVL.1'],
        'recordBasis': 'MY.recordBasisHumanObservation',
        'taxonConfidence': 'MY.taxonConfidenceSure',
        'unitFact': {
          'autocompleteSelectedTaxonID': 'MX.73566'
        },
        'unitGathering': {
          'dateBegin': '2022-08-01T11:20',
          'geometry': {
            'coordinates': [24.96740866452456, 60.20428960380684],
            'radius': 10,
            'type': 'Point'
          }
        }
      },
      {
        'count': '1',
        'id': 'observation_5ed941c3-5912-482a-845b-5ef9eab38bf7',
        'identifications': [{ 'taxon': 'varpunen' }],
        'images': [],
        'informalTaxonGroups': ['MVL.1'],
        'recordBasis': 'MY.recordBasisHumanObservation',
        'taxonConfidence': 'MY.taxonConfidenceSure',
        'unitFact': {
          'autocompleteSelectedTaxonID': 'MX.36573'
        },
        'unitGathering': {
          'dateBegin': '2022-08-01T11:21',
          'geometry': {
            'coordinates': [24.963249899446964, 60.20255056894177],
            'radius': 10,
            'type': 'Point'
          }
        }
      },
      {
        'count': '1',
        'id': 'observation_6gd343v3-3912-486w-843a-5eeeeab39bw0',
        'identifications': [{ 'taxon': 'teeri' }],
        'images': [],
        'informalTaxonGroups': ['MVL.1'],
        'recordBasis': 'MY.recordBasisHumanObservation',
        'taxonConfidence': 'MY.taxonConfidenceSure',
        'unitFact': {
          'autocompleteSelectedTaxonID': 'MX.26926'
        },
        'unitGathering': {
          'dateBegin': '2022-08-01T11:21',
          'geometry': {
            'coordinates': [24.961445999126998, 60.20011033532197],
            'radius': 10,
            'type': 'Point'
          }
        }
      }
    ]

    const correctBoundingBox = {
      'coordinates': [[
        [24.96740866452456, 60.20428960380684],
        [24.961445999126997, 60.20428960380684],
        [24.961445999126997, 60.20011033532197],
        [24.96740866452456, 60.20011033532197],
        [24.96740866452456, 60.20428960380684]
      ]],
      'type': 'Polygon'
    }

    expect(createUnitBoundingBox(units)).toEqual(correctBoundingBox)
  })
})

describe('centerOfCombinedGeometry', () => {
  it('returns a point if the geometry a point and there is no path', () => {
    const point = {
      coordinates: [
        24.931409060955048,
        60.17128187292611
      ],
      type: 'Point'
    }

    expect(centerOfGeometry(point, [])).toEqual(point)
  })

  it('returns the center of the polygon if the geometry a polygon', () => {
    const polygon: Polygon = {
      'coordinates': [
        [
          [
            66.91549301147461,
            30.23103951334467
          ],
          [
            66.96287155151366,
            30.23103951334467
          ],
          [
            66.96287155151366,
            30.27270741823115
          ],
          [
            66.91549301147461,
            30.27270741823115
          ],
          [
            66.91549301147461,
            30.23103951334467
          ]
        ]
      ],
      'type': 'Polygon'
    }

    const center = centerOfBoundingBox(polygon)

    expect(centerOfGeometry(polygon, [])).toEqual(center)
  })

  it('returns the center of the combined geometry if the geometry is a path and there are units', () => {
    const geometry = {
      'type': 'LineString',
      'coordinates': [
        [
          66.95076942443848,
          30.25017038999861
        ],
        [
          66.9558334350586,
          30.252172243227083
        ],
        [
          66.96244239807129,
          30.259586159109325
        ],
        [
          66.96879386901854,
          30.25521201642245
        ],
        [
          66.97583198547363,
          30.250541106636952
        ]
      ]
    }

    const units = [
      {
        'count': '1',
        'id': 'observation_4644dc17-1f34-4d07-b309-e955bedba646',
        'identifications': [{ 'taxon': 'varis' }],
        'images': [],
        'informalTaxonGroups': ['MVL.1'],
        'recordBasis': 'MY.recordBasisHumanObservation',
        'taxonConfidence': 'MY.taxonConfidenceSure',
        'unitFact': {
          'autocompleteSelectedTaxonID': 'MX.73566'
        },
        'unitGathering': {
          'dateBegin': '2022-08-01T11:20',
          'geometry': {
            'coordinates': [66.91549301147461, 30.23103951334467],
            'radius': 10,
            'type': 'Point'
          }
        }
      },
      {
        'count': '1',
        'id': 'observation_5ed941c3-5912-482a-845b-5ef9eab38bf7',
        'identifications': [{ 'taxon': 'varpunen' }],
        'images': [],
        'informalTaxonGroups': ['MVL.1'],
        'recordBasis': 'MY.recordBasisHumanObservation',
        'taxonConfidence': 'MY.taxonConfidenceSure',
        'unitFact': {
          'autocompleteSelectedTaxonID': 'MX.36573'
        },
        'unitGathering': {
          'dateBegin': '2022-08-01T11:21',
          'geometry': {
            'coordinates': [66.96287155151366, 30.23103951334467],
            'radius': 10,
            'type': 'Point'
          }
        }
      },
    ]

    const center: Point = {
      'coordinates': [
        66.94566249847412,
        30.245312836226997
      ],
      'type': 'Point'
    }

    expect(centerOfGeometry(geometry, units)).toEqual(center)
  })
})

describe('overlapsFinland', () => {
  it('returns true when a point is inside Finland', () => {
    const point: Point = {
      'coordinates': [
        24.96762927621603,
        60.20410584159258
      ],
      'type': 'Point'
    }

    expect(overlapsFinland(point)).toBeTruthy()
  })

  it('returns false when a point is outside Finland', () => {
    const point: Point = {
      'coordinates': [
        -4.96762927621603,
        10.20410584159258
      ],
      'type': 'Point'
    }

    expect(overlapsFinland(point)).toBeFalsy()
  })

  it('returns true when a polygon is inside Finland', () => {
    const polygon: Polygon = {
      'coordinates': [
        [
          [
            25.023613,
            60.212519
          ],
          [
            25.02216,
            60.2132
          ],
          [
            25.020464,
            60.212386
          ],
          [
            25.019139,
            60.211905
          ],
          [
            25.023613,
            60.212519
          ]
        ]
      ],
      'type': 'Polygon'
    }

    expect(overlapsFinland(polygon)).toBeTruthy()
  })

  it('returns false when a polygon is outside Finland', () => {
    const polygon: Polygon = {
      'coordinates': [
        [
          [
            5.023613,
            60.212519
          ],
          [
            5.02216,
            60.2132
          ],
          [
            5.020464,
            60.212386
          ],
          [
            5.019139,
            60.211905
          ],
          [
            5.023613,
            60.212519
          ]
        ]
      ],
      'type': 'Polygon'
    }

    expect(overlapsFinland(polygon)).toBeFalsy()
  })

  it('returns true when a lineString is inside Finland', () => {
    const lineString: LineString = {
      'coordinates': [
        [
          24.9656933,
          60.203925,
          1659355132953
        ],
        [
          24.9654514,
          60.203653,
          1659355152543
        ],
        [
          24.9651514,
          60.2033348,
          1659355156397
        ],
        [
          24.9648523,
          60.2030602,
          1659355160306
        ],
        [
          24.9644585,
          60.202756,
          1659355164880
        ],
      ],
      type: 'LineString'
    }

    expect(overlapsFinland(lineString)).toBeTruthy()
  })

  it('returns false when a lineString is outside Finland', () => {
    const lineString: LineString = {
      'coordinates': [
        [
          -80.30417919158936,
          25.28602870029636
        ],
        [
          -80.30417919158936,
          25.285019805494052
        ],
        [
          -80.3042221069336,
          25.284049706423954
        ],
        [
          -80.30413627624512,
          25.282885577298526
        ],
        [
          -80.30413627624512,
          25.28195426595429
        ]
      ],
      type: 'LineString'
    }

    expect(overlapsFinland(lineString)).toBeFalsy()
  })

  it('returns true when a multiLineString is inside Finland', () => {
    const multiLineString: MultiLineString = {
      'coordinates': [
        [
          [
            24.9654513,
            60.2036526,
            1659417489342
          ],
          [
            24.9651621,
            60.2033461,
            1659417493197
          ],
          [
            24.9648522,
            60.2030602,
            1659417497107
          ],
          [
            24.9644592,
            60.2027566,
            1659417501655
          ],
          [
            24.9644592,
            60.2027566,
            1659417501655
          ],
        ],
        [
          [
            24.9670572,
            60.1996354,
            1659417562154
          ],
          [
            24.9674566,
            60.199399,
            1659417565949
          ],
          [
            24.96783,
            60.1991814,
            1659417569580
          ],
          [
            24.9682951,
            60.1989166,
            1659417573655
          ],
          [
            24.9682951,
            60.1989166,
            1659417573655
          ],
        ]
      ],
      'type': 'MultiLineString',
    }
    expect(overlapsFinland(multiLineString)).toBeTruthy()
  })

  it('returns false when a multiLineString is outside Finland', () => {
    const multiLineString: MultiLineString = {
      'type': 'MultiLineString',
      'coordinates': [[
        [
          -440.3864049911499,
          25.183544280772935
        ],
        [
          -440.38455963134766,
          25.182262679076793
        ],
        [
          -440.3828001022339,
          25.180864552762866
        ],
        [
          -440.3816413879394,
          25.180048971672072
        ],
        [
          -440.3799247741699,
          25.17900035939248
        ]
      ],
      [
        [
          -440.37052631378174,
          25.175330145365184
        ],
        [
          -440.3693461418152,
          25.176611819964524
        ],
        [
          -440.36831617355347,
          25.17777696699648
        ],
        [
          -440.36717891693115,
          25.179039197045213
        ],
        [
          -440.36595582962036,
          25.180534437264576
        ]
      ]
      ]
    }

    expect(overlapsFinland(multiLineString)).toBeFalsy()
  })
})

describe('removeDuplicatesFromPath', () => {
  it('returns unedited lineString if there is no duplicates', () => {
    const lineString: LineString = {
      'coordinates': [
        [
          24.9656933,
          60.203925,
          1659355132953
        ],
        [
          24.9654514,
          60.203653,
          1659355152543
        ],
        [
          24.9651514,
          60.2033348,
          1659355156397
        ],
        [
          24.9648523,
          60.2030602,
          1659355160306
        ],
        [
          24.9644585,
          60.202756,
          1659355164880
        ],
      ],
      type: 'LineString'
    }

    const filteredLineString = removeDuplicatesFromPath(lineString)

    expect(filteredLineString).toEqual(lineString)
  })

  it('returns filtered lineString if there are duplicates', () => {
    const lineString: LineString = {
      'coordinates': [
        [
          24.9656933,
          60.203925,
          1659355132953
        ],
        [
          24.9654514,
          60.203653,
          1659355152543
        ],
        [
          24.9651514,
          60.2033348,
          1659355156397
        ],
        [
          24.9648523,
          60.2030602,
          1659355160306
        ],
        [
          24.9648523,
          60.2030602,
          1659355160306
        ],
      ],
      type: 'LineString'
    }

    const filteredLineString = removeDuplicatesFromPath(lineString)

    lineString.coordinates.pop()

    expect(filteredLineString).toEqual(lineString)
  })

  it('returns unedited multiLineString if there is no duplicates', () => {
    const multiLineString: MultiLineString = {
      'coordinates': [
        [
          [
            24.9654513,
            60.2036526,
            1659417489342
          ],
          [
            24.9651621,
            60.2033461,
            1659417493197
          ],
          [
            24.9648522,
            60.2030602,
            1659417497107
          ],
          [
            24.9644592,
            60.2027566,
            1659417501655
          ],
          [
            24.9640753,
            60.2024635,
            1659417505655
          ]
        ],
        [
          [
            24.9670572,
            60.1996354,
            1659417562154
          ],
          [
            24.9674566,
            60.199399,
            1659417565949
          ],
          [
            24.96783,
            60.1991814,
            1659417569580
          ],
          [
            24.9682951,
            60.1989166,
            1659417573655
          ],
          [
            24.9686542,
            60.1987098,
            1659417577100
          ]
        ]
      ],
      'type': 'MultiLineString',
    }

    const filteredMultiLineString = removeDuplicatesFromPath(multiLineString)

    expect(filteredMultiLineString).toEqual(multiLineString)
  })

  it('returns filtered multiLineString if there are duplicates', () => {
    const multiLineString: MultiLineString = {
      'coordinates': [
        [
          [
            24.9654513,
            60.2036526,
            1659417489342
          ],
          [
            24.9651621,
            60.2033461,
            1659417493197
          ],
          [
            24.9648522,
            60.2030602,
            1659417497107
          ],
          [
            24.9644592,
            60.2027566,
            1659417501655
          ],
          [
            24.9644592,
            60.2027566,
            1659417501655
          ],
        ],
        [
          [
            24.9670572,
            60.1996354,
            1659417562154
          ],
          [
            24.9674566,
            60.199399,
            1659417565949
          ],
          [
            24.96783,
            60.1991814,
            1659417569580
          ],
          [
            24.9682951,
            60.1989166,
            1659417573655
          ],
          [
            24.9682951,
            60.1989166,
            1659417573655
          ],
        ]
      ],
      'type': 'MultiLineString',
    }

    const filteredMultiLineString = removeDuplicatesFromPath(multiLineString)

    multiLineString.coordinates[0].pop()
    multiLineString.coordinates[1].pop()

    expect(filteredMultiLineString).toEqual(multiLineString)
  })
})