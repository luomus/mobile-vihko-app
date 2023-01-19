import { LocationObject } from 'expo-location'
import { Feature, FeatureCollection, GeometryCollection, LineString, MultiLineString, MultiPolygon, Point } from 'geojson'
import { LatLng } from 'react-native-maps'
import { convertFC2GC, convertGC2FC, convertLatLngToPoint, convertLocationDataArrayToLineString, convertMultiLineStringToGCWrappedLineString, convertPointToLatLng, featureCollectionConstructor, featureConstructor, geometryCollectionConstructor, latLngArrayConstructor, latLngConstructor, lineStringConstructor, lineStringsToPathDeconstructor, multiLineStringConstructor, pathToLineStringConstructor, pointConstructor, wrapGeometryInFC } from '../../helpers/geoJSONHelper'

describe('geometryCollectionConstructor', () => {
  it('merged geometries into a collection', () => {
    const geometries: LineString[] = [
      {
        'coordinates': [
          [
            24.9656933,
            60.203925
          ],
          [
            24.9654808,
            60.2036669
          ],
          [
            24.9651723,
            60.2033507
          ],
          [
            24.9648622,
            60.2030614
          ],
          [
            24.9644759,
            60.202764
          ]
        ],
        'type': 'LineString'
      },
      {
        'coordinates': [
          [
            24.9665596,
            60.1999047
          ],
          [
            24.9670436,
            60.1996417
          ]
        ],
        'type': 'LineString'
      }
    ]

    const geometryCollection = geometryCollectionConstructor(geometries)

    expect(geometryCollection).toEqual({
      geometries: geometries,
      type: 'GeometryCollection'
    })
  })
})

describe('featureConstructor', () => {
  it('converts the given geometry into a feature', () => {
    const geometry: MultiPolygon = {
      'coordinates': [
        [
          [
            [
              25.0914536,
              60.240951
            ],
            [
              25.0914536,
              60.240951
            ],
            [
              25.0914536,
              60.240951
            ],
            [
              25.0914536,
              60.240951
            ],
          ],
        ],
      ],
      'type': 'MultiPolygon',
    }

    const feature = featureConstructor(geometry)

    expect(feature).toEqual({
      geometry: geometry,
      properties: {},
      type: 'Feature'
    })
  })
})

describe('featureCollectionConstructor', () => {
  it('merges given features into a FeatureCollection', () => {
    const features: Feature[] = [
      {
        geometry: {
          coordinates: [
            [
              24.9656933,
              60.203925
            ],
            [
              24.9654808,
              60.2036669
            ],
            [
              24.9651723,
              60.2033507
            ],
            [
              24.9648622,
              60.2030614
            ],
            [
              24.9644759,
              60.202764
            ]
          ],
          type: 'LineString'
        },
        properties: {},
        type: 'Feature'
      },
      {
        geometry: {
          'coordinates': [
            [
              24.9665596,
              60.1999047
            ],
            [
              24.9670436,
              60.1996417
            ]
          ],
          type: 'LineString'
        },
        properties: {},
        type: 'Feature'
      }
    ]

    const featureCollection = featureCollectionConstructor(features)

    expect(featureCollection).toEqual({
      features: features,
      type: 'FeatureCollection'
    })
  })
})

describe('pointConstructor', () => {
  it('forms a Point from lat and lng coordinates', () => {
    const point = pointConstructor(24.9656933, 60.203925)

    expect(point).toEqual({
      coordinates: [24.9656933, 60.203925],
      type: 'Point'
    })
  })
})

describe('latLngConstructor', () => {
  it('forms a LatLng object from lat and lng coordinates', () => {
    const latLng = latLngConstructor(24.9656933, 60.203925)

    expect(latLng).toEqual({
      latitude: 60.203925,
      longitude: 24.9656933
    })
  })
})

describe('lineStringConstructor', () => {
  it('forms a LineString from coordinates', () => {
    const coordinates = [
      [
        24.9656933,
        60.203925,
        1662368728279
      ],
      [
        24.9654753,
        60.203663,
        1662368734037
      ],
      [
        24.9652415,
        60.2034186,
        1662368736971
      ],
      [
        24.9649214,
        60.2031093,
        1662368741034
      ],
      [
        24.9646123,
        60.202864,
        1662368745369
      ]
    ]

    expect(lineStringConstructor(coordinates)).toEqual({
      coordinates: coordinates,
      type: 'LineString'
    })
  })
})

describe('multiLineStringConstructor', () => {
  it('forms a MultiLineString from coordinates', () => {
    const coordinates = [
      [
        [
          24.9656933,
          60.203925,
          1662370853158
        ],
        [
          24.9654808,
          60.203664,
          1662370857943
        ],
        [
          24.9652371,
          60.2034097,
          1662370860944
        ],
        [
          24.9649365,
          60.2031236,
          1662370865025
        ],
        [
          24.9646131,
          60.2028642,
          1662370869358
        ]
      ],
      [
        [
          24.9659338,
          60.2002619,
          1662370919931
        ],
        [
          24.9663681,
          60.200036,
          1662370924355
        ],
        [
          24.9667622,
          60.1997938,
          1662370928334
        ],
        [
          24.9671829,
          60.199567,
          1662370931218
        ],
        [
          24.9675435,
          60.1993473,
          1662370935305
        ]
      ]
    ]

    expect(multiLineStringConstructor(coordinates)).toEqual({
      coordinates: coordinates,
      type: 'MultiLineString'
    })
  })
})

describe('pathToLineStringConstructor', () => {
  it('returns undefined when path has only one point', () => {
    const path = [
      [
        [
          24.9656933,
          60.203925,
          0,
          1662368728279,
          false
        ]
      ]
    ]

    expect(pathToLineStringConstructor(path)).toEqual(undefined)
  })

  it('returns undefined when all path parts have only one point', () => {
    const path = [
      [
        [
          24.9656933,
          60.203925,
          0,
          1662368728279,
          false
        ]
      ],
      [
        [
          24.9659338,
          60.2002619,
          0,
          1662370919931,
          false
        ]
      ]
    ]

    expect(pathToLineStringConstructor(path)).toEqual(undefined)
  })

  it('forms a LineString from a seamless path', () => {
    const path = [
      [
        [
          24.9656933,
          60.203925,
          0,
          1662368728279,
          false
        ],
        [
          24.9654753,
          60.203663,
          5.4811364144331804,
          1662368734037,
          false
        ],
        [
          24.9652415,
          60.2034186,
          10.267225186321118,
          1662368736971,
          false
        ],
        [
          24.9649214,
          60.2031093,
          9.529283391913582,
          1662368741034,
          false
        ],
        [
          24.9646123,
          60.202864,
          7.4321431906323605,
          1662368745369,
          false
        ]
      ]
    ]

    const coordinates = [
      [
        24.9656933,
        60.203925,
        1662368728279
      ],
      [
        24.9654753,
        60.203663,
        1662368734037
      ],
      [
        24.9652415,
        60.2034186,
        1662368736971
      ],
      [
        24.9649214,
        60.2031093,
        1662368741034
      ],
      [
        24.9646123,
        60.202864,
        1662368745369
      ]
    ]

    expect(pathToLineStringConstructor(path)).toEqual({
      coordinates: coordinates,
      type: 'LineString'
    })
  })

  it('forms a MultiLineString from a splitted path', () => {
    const path = [
      [
        [
          24.9656933,
          60.203925,
          0,
          1662370853158,
          false
        ],
        [
          24.9654808,
          60.203664,
          0,
          1662370857943,
          false
        ],
        [
          24.9652371,
          60.2034097,
          0,
          1662370860944,
          false
        ],
        [
          24.9649365,
          60.2031236,
          0,
          1662370865025,
          false
        ],
        [
          24.9646131,
          60.2028642,
          0,
          1662370869358,
          false
        ]
      ],
      [
        [
          24.9659338,
          60.2002619,
          0,
          1662370919931,
          false
        ],
        [
          24.9663681,
          60.200036,
          7.861681235616494,
          1662370924355,
          false
        ],
        [
          24.9667622,
          60.1997938,
          8.714260470607135,
          1662370928334,
          false
        ],
        [
          24.9671829,
          60.199567,
          11.906538219571525,
          1662370931218,
          false
        ],
        [
          24.9675435,
          60.1993473,
          7.722429411345162,
          1662370935305,
          false
        ]
      ]
    ]

    const coordinates = [
      [
        [
          24.9656933,
          60.203925,
          1662370853158
        ],
        [
          24.9654808,
          60.203664,
          1662370857943
        ],
        [
          24.9652371,
          60.2034097,
          1662370860944
        ],
        [
          24.9649365,
          60.2031236,
          1662370865025
        ],
        [
          24.9646131,
          60.2028642,
          1662370869358
        ]
      ],
      [
        [
          24.9659338,
          60.2002619,
          1662370919931
        ],
        [
          24.9663681,
          60.200036,
          1662370924355
        ],
        [
          24.9667622,
          60.1997938,
          1662370928334
        ],
        [
          24.9671829,
          60.199567,
          1662370931218
        ],
        [
          24.9675435,
          60.1993473,
          1662370935305
        ]
      ]
    ]

    expect(pathToLineStringConstructor(path)).toEqual({
      coordinates: coordinates,
      type: 'MultiLineString'
    })
  })
})

describe('lineStringsToPathDeconstructor', () => {
  it('LineString is converted a into a path', () => {
    const lineString: LineString = {
      coordinates: [
        [
          24.9656933,
          60.203925,
          1662368728279
        ],
        [
          24.9654753,
          60.203663,
          1662368734037
        ],
        [
          24.9652415,
          60.2034186,
          1662368736971
        ],
        [
          24.9649214,
          60.2031093,
          1662368741034
        ],
        [
          24.9646123,
          60.202864,
          1662368745369
        ]
      ],
      type: 'LineString'
    }

    const path = [
      [
        [
          24.9656933,
          60.203925,
          0.0,
          1662368728279,
          false
        ],
        [
          24.9654753,
          60.203663,
          0.0,
          1662368734037,
          false
        ],
        [
          24.9652415,
          60.2034186,
          0.0,
          1662368736971,
          false
        ],
        [
          24.9649214,
          60.2031093,
          0.0,
          1662368741034,
          false
        ],
        [
          24.9646123,
          60.202864,
          0.0,
          1662368745369,
          false
        ]
      ]
    ]

    expect(lineStringsToPathDeconstructor(lineString)).toEqual(path)
  })

  it('MultiLineString is converted into a path', () => {
    const multiLineString: MultiLineString = {
      coordinates: [
        [
          [
            24.9656933,
            60.203925,
            1662368728279
          ],
          [
            24.9654753,
            60.203663,
            1662368734037
          ],
          [
            24.9652415,
            60.2034186,
            1662368736971
          ]
        ],
        [
          [
            24.9649214,
            60.2031093,
            1662368741034
          ],
          [
            24.9646123,
            60.202864,
            1662368745369
          ]
        ]
      ],
      type: 'MultiLineString'
    }

    const path = [
      [
        [
          24.9656933,
          60.203925,
          0.0,
          1662368728279,
          false
        ],
        [
          24.9654753,
          60.203663,
          0.0,
          1662368734037,
          false
        ],
        [
          24.9652415,
          60.2034186,
          0.0,
          1662368736971,
          false
        ]
      ],
      [
        [
          24.9649214,
          60.2031093,
          0.0,
          1662368741034,
          false
        ],
        [
          24.9646123,
          60.202864,
          0.0,
          1662368745369,
          false
        ]
      ]
    ]

    expect(lineStringsToPathDeconstructor(multiLineString)).toEqual(path)
  })
})

describe('wrapGeometryInFC', () => {
  it('wraps given geometry inside FeatureCollection', () => {
    const multiPolygon: MultiPolygon = {
      'coordinates': [
        [
          [
            [
              25.0914536,
              60.240951
            ],
            [
              25.0914536,
              60.240951
            ],
            [
              25.0914536,
              60.240951
            ],
            [
              25.0914536,
              60.240951
            ],
          ],
        ],
      ],
      'type': 'MultiPolygon',
    }

    const featureCollection = {
      'features': [
        {
          'geometry': {
            'coordinates': [
              [
                [
                  [
                    25.0914536,
                    60.240951
                  ],
                  [
                    25.0914536,
                    60.240951
                  ],
                  [
                    25.0914536,
                    60.240951
                  ],
                  [
                    25.0914536,
                    60.240951
                  ]
                ]
              ]
            ],
            'type': 'MultiPolygon'
          },
          'properties': {},
          'type': 'Feature',
        }
      ],
      'type': 'FeatureCollection'
    }

    expect(wrapGeometryInFC(multiPolygon)).toEqual(featureCollection)
  })
})

describe('latLngArrayConstructor', () => {
  it('returns the corresponding array of LatLng values when given an array of coordinates', () => {
    const lineString: LineString = {
      coordinates: [
        [
          24.9656933,
          60.203925,
          1662368728279
        ],
        [
          24.9654753,
          60.203663,
          1662368734037
        ],
        [
          24.9652415,
          60.2034186,
          1662368736971
        ],
        [
          24.9649214,
          60.2031093,
          1662368741034
        ],
        [
          24.9646123,
          60.202864,
          1662368745369
        ]
      ],
      type: 'LineString'
    }

    const latLngArray: LatLng[] = [
      {
        latitude: 60.203925,
        longitude: 24.9656933
      },
      {
        latitude: 60.203663,
        longitude: 24.9654753
      },
      {
        latitude: 60.2034186,
        longitude: 24.9652415
      },
      {
        latitude: 60.2031093,
        longitude: 24.9649214
      },
      {
        latitude: 60.202864,
        longitude: 24.9646123
      }
    ]

    expect(latLngArrayConstructor(lineString.coordinates)).toEqual(latLngArray)
  })
})

describe('convertGC2FC', () => {
  it('converts a GeometryCollection into a FeatureCollection', () => {
    const geometryCollection: GeometryCollection = {
      'geometries': [
        {
          'coordinates': [
            [
              24.9656933,
              60.203925
            ],
            [
              24.9654808,
              60.2036669
            ],
            [
              24.9651723,
              60.2033507
            ],
            [
              24.9648622,
              60.2030614
            ],
            [
              24.9644759,
              60.202764
            ]
          ],
          'type': 'LineString'
        },
        {
          'coordinates': [
            [
              24.9665596,
              60.1999047
            ],
            [
              24.9670436,
              60.1996417
            ]
          ],
          'type': 'LineString'
        }
      ],
      'type': 'GeometryCollection'
    }

    const featureCollection: FeatureCollection = {
      'features': [
        {
          'geometry': {
            'coordinates': [
              [
                24.9656933,
                60.203925
              ],
              [
                24.9654808,
                60.2036669
              ],
              [
                24.9651723,
                60.2033507
              ],
              [
                24.9648622,
                60.2030614
              ],
              [
                24.9644759,
                60.202764
              ]
            ],
            'type': 'LineString'
          },
          properties: {},
          type: 'Feature'
        },
        {
          'geometry': {
            'coordinates': [
              [
                24.9665596,
                60.1999047
              ],
              [
                24.9670436,
                60.1996417
              ]
            ],
            'type': 'LineString'
          },
          properties: {},
          type: 'Feature'
        }
      ],
      'type': 'FeatureCollection'
    }

    expect(convertGC2FC(geometryCollection)).toEqual(featureCollection)
  })
})

describe('convertFC2GC', () => {
  it('converts a FeatureCollection into a GeometryCollection', () => {
    const featureCollection: FeatureCollection = {
      'features': [
        {
          'geometry': {
            'coordinates': [
              [
                24.9656933,
                60.203925
              ],
              [
                24.9654808,
                60.2036669
              ],
              [
                24.9651723,
                60.2033507
              ],
              [
                24.9648622,
                60.2030614
              ],
              [
                24.9644759,
                60.202764
              ]
            ],
            'type': 'LineString'
          },
          properties: {},
          type: 'Feature'
        },
        {
          'geometry': {
            'coordinates': [
              [
                24.9665596,
                60.1999047
              ],
              [
                24.9670436,
                60.1996417
              ]
            ],
            'type': 'LineString'
          },
          properties: {},
          type: 'Feature'
        }
      ],
      'type': 'FeatureCollection'
    }

    const geometryCollection: GeometryCollection = {
      'geometries': [
        {
          'coordinates': [
            [
              24.9656933,
              60.203925
            ],
            [
              24.9654808,
              60.2036669
            ],
            [
              24.9651723,
              60.2033507
            ],
            [
              24.9648622,
              60.2030614
            ],
            [
              24.9644759,
              60.202764
            ]
          ],
          'type': 'LineString'
        },
        {
          'coordinates': [
            [
              24.9665596,
              60.1999047
            ],
            [
              24.9670436,
              60.1996417
            ]
          ],
          'type': 'LineString'
        }
      ],
      'type': 'GeometryCollection'
    }

    expect(convertFC2GC(featureCollection)).toEqual(geometryCollection)
  })
})

describe('convertMultiLineStringToGCWrappedLineString', () => {
  it('converts MultiLineString to GeometryCollection', () => {
    const multiLineString: MultiLineString = {
      'coordinates': [
        [
          [
            24.9656933,
            60.203925
          ],
          [
            24.9654808,
            60.2036669
          ],
          [
            24.9651723,
            60.2033507
          ],
          [
            24.9648622,
            60.2030614
          ],
          [
            24.9644759,
            60.202764
          ]
        ],
        [
          [
            24.9665596,
            60.1999047
          ],
          [
            24.9670436,
            60.1996417
          ]
        ]
      ],
      'type': 'MultiLineString'
    }

    const geometryCollection: GeometryCollection = {
      'geometries': [
        {
          'coordinates': [
            [
              24.9656933,
              60.203925
            ],
            [
              24.9654808,
              60.2036669
            ],
            [
              24.9651723,
              60.2033507
            ],
            [
              24.9648622,
              60.2030614
            ],
            [
              24.9644759,
              60.202764
            ]
          ],
          'type': 'LineString'
        },
        {
          'coordinates': [
            [
              24.9665596,
              60.1999047
            ],
            [
              24.9670436,
              60.1996417
            ]
          ],
          'type': 'LineString'
        }
      ],
      'type': 'GeometryCollection'
    }

    expect(convertMultiLineStringToGCWrappedLineString(multiLineString)).toEqual(geometryCollection)
  })
})

describe('convertLatLngToPoint', () => {
  it('successfully converts a LatLng object into a Point', () => {
    const latLng: LatLng = {
      latitude: 60.203925,
      longitude: 24.9656933
    }

    const point: Point = {
      coordinates: [
        24.9656933,
        60.203925
      ],
      type: 'Point'
    }

    expect(convertLatLngToPoint(latLng)).toEqual(point)
  })
})

describe('convertPointToLatLng', () => {
  it('successfully converts a Point object into a LatLng', () => {
    const point: Point = {
      coordinates: [
        24.9656933,
        60.203925
      ],
      type: 'Point'
    }

    const latLng: LatLng = {
      latitude: 60.203925,
      longitude: 24.9656933
    }

    expect(convertPointToLatLng(point)).toEqual(latLng)
  })
})

describe('convertLocationDataArrayToLineString', () => {
  it('converts Expo LocationObject into a LineString', () => {
    const locationObject: LocationObject[] = [
      {
        coords: {
          latitude: 60.203925,
          longitude: 24.9656933,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        },
        timestamp: 1662368728279
      },
      {
        coords: {
          latitude: 60.203663,
          longitude: 24.9654753,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        },
        timestamp: 1662368734037
      },
      {
        coords: {
          latitude: 60.2034186,
          longitude: 24.9652415,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        },
        timestamp: 1662368736971
      },
      {
        coords: {
          latitude: 60.2031093,
          longitude: 24.9649214,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        },
        timestamp: 1662368741034
      },
      {
        coords: {
          latitude: 60.202864,
          longitude: 24.9646123,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        },
        timestamp: 1662368745369
      }
    ]

    const lineString: LineString = {
      coordinates: [
        [
          24.9656933,
          60.203925,
          1662368728279
        ],
        [
          24.9654753,
          60.203663,
          1662368734037
        ],
        [
          24.9652415,
          60.2034186,
          1662368736971
        ],
        [
          24.9649214,
          60.2031093,
          1662368741034
        ],
        [
          24.9646123,
          60.202864,
          1662368745369
        ]
      ],
      type: 'LineString'
    }

    expect(convertLocationDataArrayToLineString(locationObject)).toEqual(lineString)
  })
})