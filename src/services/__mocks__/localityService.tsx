import { LineString, MultiLineString, Point } from 'geojson'

export const getLocalityDetailsFromLajiApi = async (geometry: MultiLineString | LineString | Point, lang: string) => {
  return {
    'results': [
      {
        'address_components': [
          {
            'long_name': 'Uusimaa',
            'short_name': 'U',
            'types': [
              'biogeographicalProvince',
            ],
          },
        ],
        'formatted_address': 'Uusimaa (U)',
        'geometry': {
          'bounds': {
            'northeast': {
              'lat': 60.9551,
              'lng': 26.87533,
            },
            'southwest': {
              'lat': 59.611003,
              'lng': 22.658911,
            },
          },
          'location': {
            'lat': '60.283051',
            'lng': '24.767121',
          },
          'location_type': 'APPROXIMATE',
          'viewport': {
            'northeast': {
              'lat': 60.9551,
              'lng': 26.87533,
            },
            'southwest': {
              'lat': 59.611003,
              'lng': 22.658911,
            },
          },
        },
        'place_id': 'ML.253',
        'types': [
          'biogeographicalProvince',
        ],
      },
      {
        'address_components': [
          {
            'short_name': 'Uusimaa',
            'types': [
              'region',
            ],
          },
        ],
        'formatted_address': 'Uusimaa',
        'geometry': {
          'bounds': {
            'northeast': {
              'lat': 60.852328909136,
              'lng': 26.649098268891,
            },
            'southwest': {
              'lat': 59.611003765602,
              'lng': 22.658921499564,
            },
          },
          'location': {
            'lat': '60.231666',
            'lng': '24.654010',
          },
          'location_type': 'APPROXIMATE',
          'viewport': {
            'northeast': {
              'lat': 60.852328909136,
              'lng': 26.649098268891,
            },
            'southwest': {
              'lat': 59.611003765602,
              'lng': 22.658921499564,
            },
          },
        },
        'types': [
          'region',
        ],
      },
      {
        'address_components': [
          {
            'short_name': 'Helsinki',
            'types': [
              'municipality',
            ],
          },
        ],
        'formatted_address': 'Helsinki',
        'geometry': {
          'bounds': {
            'northeast': {
              'lat': 60.297839,
              'lng': 25.254493,
            },
            'southwest': {
              'lat': 59.922482,
              'lng': 24.782792,
            },
          },
          'location': {
            'lat': '60.110161',
            'lng': '25.018642',
          },
          'location_type': 'APPROXIMATE',
          'viewport': {
            'northeast': {
              'lat': 60.297839,
              'lng': 25.254493,
            },
            'southwest': {
              'lat': 59.922482,
              'lng': 24.782792,
            },
          },
        },
        'place_id': 'ML.660',
        'types': [
          'municipality',
        ],
      },
    ],
    'status': 'OK',
  }
}

export const getLocalityDetailsFromGoogleAPI = async (point: Point, lang: string) => {
  return {
    'config': {
      'adapter': [],
      'data': undefined,
      'headers': {
        'Accept': 'application/json, text/plain, */*',
      },
      'maxBodyLength': -1,
      'maxContentLength': -1,
      'method': 'get',
      'params': {
        'key': 'AIzaSyCtGFaUCGx1J8GxuTwMZqmcpxGFzTUWZWE',
        'language': 'fi',
        'latlng': '51.501168414523825,-0.14232438057661057',
      },
      'timeout': 0,
      'transformRequest': [
        [],
      ],
      'transformResponse': [
        [],
      ],
      'transitional': {
        'clarifyTimeoutError': false,
        'forcedJSONParsing': true,
        'silentJSONParsing': true,
      },
      'url': 'https://maps.googleapis.com/maps/api/geocode/json',
      'validateStatus': [],
      'xsrfCookieName': 'XSRF-TOKEN',
      'xsrfHeaderName': 'X-XSRF-TOKEN',
    },
    'data': {
      'plus_code': {
        'compound_code': 'GV25+F37 Lontoo, Yhdistynyt kuningaskunta',
        'global_code': '9C3XGV25+F37',
      },
      'results': [
        {
          'address_components': [
            {
              'long_name': 'Greater London',
              'short_name': 'Greater London',
              'types': [
                'administrative_area_level_2',
                'political',
              ],
            },
            {
              'long_name': 'England',
              'short_name': 'England',
              'types': [
                'administrative_area_level_1',
                'political',
              ],
            },
            {
              'long_name': 'Yhdistynyt kuningaskunta',
              'short_name': 'GB',
              'types': [
                'country',
                'political',
              ],
            },
          ]
        }
      ]
    }
  }
}