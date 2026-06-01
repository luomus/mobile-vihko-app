import { Point } from 'geojson'

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