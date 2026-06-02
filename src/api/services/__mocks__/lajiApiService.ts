import { LineString, MultiLineString, Point } from 'geojson'
import tripFormFi from '../../../schemas/tripFormFi.json'
import tripFormSv from '../../../schemas/tripFormSv.json'
import tripFormEn from '../../../schemas/tripFormEn.json'
import birdAtlasFi from '../../../schemas/birdAtlasFi.json'
import birdAtlasSv from '../../../schemas/birdAtlasSv.json'
import birdAtlasEn from '../../../schemas/birdAtlasEn.json'
import fungiAtlasFi from '../../../schemas/fungiAtlasFi.json'
import fungiAtlasSv from '../../../schemas/fungiAtlasSv.json'
import fungiAtlasEn from '../../../schemas/fungiAtlasEn.json'
import lolifeFi from '../../../schemas/lolifeFi.json'
import lolifeSv from '../../../schemas/lolifeSv.json'
import lolifeEn from '../../../schemas/lolifeEn.json'
import i18n from '../../../languages/i18n'

const lajiApiService = {
  getForm: async (formId: string) => {
    const language = i18n.language
    if (language === 'fi' && formId === 'JX.519') {
      return tripFormFi.data.form
    } else if (language === 'sv' && formId === 'JX.519') {
      return tripFormSv.data.form
    } else if (language === 'en' && formId === 'JX.519') {
      return tripFormEn.data.form
    } else if (language === 'fi' && formId === 'MHL.117') {
      return birdAtlasFi.data.form
    } else if (language === 'sv' && formId === 'MHL.117') {
      return birdAtlasSv.data.form
    } else if (language === 'en' && formId === 'MHL.117') {
      return birdAtlasEn.data.form
    } else if (language === 'fi' && formId === 'JX.652') {
      return fungiAtlasFi.data.form
    } else if (language === 'sv' && formId === 'JX.652') {
      return fungiAtlasSv.data.form
    } else if (language === 'en' && formId === 'JX.652') {
      return fungiAtlasEn.data.form
    } else if (language === 'fi' && formId === 'MHL.45') {
      return lolifeFi.data.form
    } else if (language === 'sv' && formId === 'MHL.45') {
      return lolifeSv.data.form
    } else if (language === 'en' && formId === 'MHL.45') {
      return lolifeEn.data.form
    }
  },
  getDocuments: async (selectedFields: string[], sourceID: string, pageSize: number) => {
    return [{
      'aggregateBy': {
        'document.createdDate': '2023-02-09',
        'document.documentId': 'http://tun.fi/JX.1111',
        'document.formId': 'http://tun.fi/MHL.117'
      },
      'count': 1
    }]
  },
  postDocument: async (document: Record<string, any>) => {
    return Promise.resolve()
  },
  getFormPermissions: async () => {
    return {
      'admins': [],
      'editors': [
        'HR.2951',
      ],
      'permissionRequests': [],
      'personID': 'MA.1',
    }
  },
  postImage: async (formDataBody: FormData) => {
    return {
      'config': {
        'adapter': [],
        'data': {
          '_parts': [
            [
              'data',
              {
                'name': 'c85d3673-c000-4c3c-b24d-cf6f1cea98a6.jpg',
                'size': 4605708,
                'type': 'image/jpeg',
                'uri': 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FMobile-Vihko-f12a92bd-81fd-4995-b2fd-d4b5bc8ae35b/ImagePicker/c85d3673-c000-4c3c-b24d-cf6f1cea98a6.jpg',
              },
            ],
          ],
        },
        'headers': {
          'Accept': 'application/json, text/plain, */*',
        },
        'maxBodyLength': -1,
        'maxContentLength': -1,
        'method': 'post',
        'params': {
          'access_token': 't4N06QPrUdoidv4uxVnNSeWDy9KlAIMXTOslCalPNRxwcUMi0AvCBsvS8HRYr186',
          'personToken': 'Pfk3NA3n6tXMSY6QJMFdWw5w2e8jvlqkiMnpqP0IEJdlgw7m',
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
        'url': 'https://apitest.laji.fi/v0/images',
        'validateStatus': [],
        'xsrfCookieName': 'XSRF-TOKEN',
        'xsrfHeaderName': 'X-XSRF-TOKEN',
      },
      'data': [
        {
          'expires': 1657802586,
          'filename': 'c85d3673-c000-4c3c-b24d-cf6f1cea98a6.jpg',
          'id': 'be9e6b12-0e74-4397-b9f1-1c99d832a1a8',
          'name': 'data',
        },
      ],
      'headers': {
        'access-control-allow-credentials': 'true',
        'access-control-allow-origin': '*',
        'cache-control': 'public',
        'content-type': 'application/json',
        'date': 'Thu, 14 Jul 2022 12:28:08 GMT',
        'referrer-policy': 'no-referrer-when-downgrade',
        'strict-transport-security': 'max-age=31536000;includeSubDomains;preload',
        'vary': 'Accept-Encoding,User-Agent',
        'via': '1.1 fmnh-ws-test.it.helsinki.fi',
        'x-content-type-options': 'nosniff',
        'x-download-options': 'noopen',
        'x-frame-options': 'DENY',
        'x-xss-protection': '1;mode=block',
      },
      'request': {
        'DONE': 4,
        'HEADERS_RECEIVED': 2,
        'LOADING': 3,
        'OPENED': 1,
        'UNSENT': 0,
        '_aborted': false,
        '_cachedResponse': undefined,
        '_hasError': false,
        '_headers': {
          'accept': 'application/json, text/plain, */*',
        },
        '_incrementalEvents': false,
        '_lowerCaseResponseHeaders': {
          'access-control-allow-credentials': 'true',
          'access-control-allow-origin': '*',
          'cache-control': 'public',
          'content-type': 'application/json',
          'date': 'Thu, 14 Jul 2022 12:28:08 GMT',
          'referrer-policy': 'no-referrer-when-downgrade',
          'strict-transport-security': 'max-age=31536000;includeSubDomains;preload',
          'vary': 'Accept-Encoding,User-Agent',
          'via': '1.1 fmnh-ws-test.it.helsinki.fi',
          'x-content-type-options': 'nosniff',
          'x-download-options': 'noopen',
          'x-frame-options': 'DENY',
          'x-xss-protection': '1;mode=block',
        },
        '_method': 'POST',
        '_perfKey': 'network_XMLHttpRequest_https://apitest.laji.fi/v0/images?personToken=Pfk3NA3n6tXMSY6QJMFdWw5w2e8jvlqkiMnpqP0IEJdlgw7m&access_token=t4N06QPrUdoidv4uxVnNSeWDy9KlAIMXTOslCalPNRxwcUMi0AvCBsvS8HRYr186',
        '_performanceLogger': {
          '_closed': false,
          '_extras': {},
          '_pointExtras': {},
          '_points': {
            'initializeCore_end': 1657801562023,
            'initializeCore_start': 1657801561960,
          },
          '_timespans': {
            'network_XMLHttpRequest_http://8i-kzw.anonymous.mobile-vihko-app.exp.direct:80/logs': {
              'endExtras': undefined,
              'endTime': 1657801563966,
              'startExtras': undefined,
              'startTime': 1657801563089,
              'totalTime': 877,
            },
            'network_XMLHttpRequest_http://8i-kzw.anonymous.mobile-vihko-app.exp.direct:80/symbolicate': {
              'endExtras': undefined,
              'endTime': 1657801563456,
              'startExtras': undefined,
              'startTime': 1657801562922,
              'totalTime': 534,
            },
            'network_XMLHttpRequest_https://apitest.laji.fi/v0/autocomplete/taxon?q=v&lang=fi&limit=5&includePayload=true&matchType=exact,partial&includeHidden=false&excludeNameTypes=MX.hasMisappliedName,MX.hasMisspelledName,MX.hasUncertainSynonym,MX.hasOrthographicVariant&access_token=t4N06QPrUdoidv4uxVnNSeWDy9KlAIMXTOslCalPNRxwcUMi0AvCBsvS8HRYr186': {
              'endExtras': undefined,
              'endTime': 1657801618814,
              'startExtras': undefined,
              'startTime': 1657801618430,
              'totalTime': 384,
            },
            'network_XMLHttpRequest_https://apitest.laji.fi/v0/autocomplete/taxon?q=varis&lang=fi&limit=5&includePayload=true&matchType=exact,partial&includeHidden=false&excludeNameTypes=MX.hasMisappliedName,MX.hasMisspelledName,MX.hasUncertainSynonym,MX.hasOrthographicVariant&access_token=t4N06QPrUdoidv4uxVnNSeWDy9KlAIMXTOslCalPNRxwcUMi0AvCBsvS8HRYr186': {
              'endExtras': undefined,
              'endTime': 1657801620489,
              'startExtras': undefined,
              'startTime': 1657801620090,
              'totalTime': 399,
            },
            'network_XMLHttpRequest_https://apitest.laji.fi/v0/coordinates/location?lang=fi&access_token=t4N06QPrUdoidv4uxVnNSeWDy9KlAIMXTOslCalPNRxwcUMi0AvCBsvS8HRYr186': {
              'endExtras': undefined,
              'endTime': 1657801682609,
              'startExtras': undefined,
              'startTime': 1657801679594,
              'totalTime': 3015,
            },
            'network_XMLHttpRequest_https://apitest.laji.fi/v0/formPermissions?personToken=Pfk3NA3n6tXMSY6QJMFdWw5w2e8jvlqkiMnpqP0IEJdlgw7m&access_token=t4N06QPrUdoidv4uxVnNSeWDy9KlAIMXTOslCalPNRxwcUMi0AvCBsvS8HRYr186': {
              'endExtras': undefined,
              'endTime': 1657801565910,
              'startExtras': undefined,
              'startTime': 1657801565575,
              'totalTime': 335,
            },
            'network_XMLHttpRequest_https://apitest.laji.fi/v0/graphql': {
              'endExtras': undefined,
              'endTime': 1657801563769,
              'startExtras': undefined,
              'startTime': 1657801563522,
              'totalTime': 247,
            },
            'network_XMLHttpRequest_https://apitest.laji.fi/v0/images?personToken=Pfk3NA3n6tXMSY6QJMFdWw5w2e8jvlqkiMnpqP0IEJdlgw7m&access_token=t4N06QPrUdoidv4uxVnNSeWDy9KlAIMXTOslCalPNRxwcUMi0AvCBsvS8HRYr186': {
              'endExtras': undefined,
              'endTime': 1657801688472,
              'startExtras': undefined,
              'startTime': 1657801682627,
              'totalTime': 5845,
            },
            'network_XMLHttpRequest_https://apitest.laji.fi/v0/named-places?collectionID=HR.2951&includePublic=true&includeUnits=false&access_token=t4N06QPrUdoidv4uxVnNSeWDy9KlAIMXTOslCalPNRxwcUMi0AvCBsvS8HRYr186&pageSize=1000': {
              'endExtras': undefined,
              'endTime': 1657801563479,
              'startExtras': undefined,
              'startTime': 1657801563145,
              'totalTime': 334,
            },
            'network_XMLHttpRequest_https://apitest.laji.fi/v0/person-token//Pfk3NA3n6tXMSY6QJMFdWw5w2e8jvlqkiMnpqP0IEJdlgw7m?access_token=t4N06QPrUdoidv4uxVnNSeWDy9KlAIMXTOslCalPNRxwcUMi0AvCBsvS8HRYr186': {
              'endExtras': undefined,
              'endTime': 1657801610899,
              'startExtras': undefined,
              'startTime': 1657801610532,
              'totalTime': 367,
            },
            'network_XMLHttpRequest_https://apitest.laji.fi/v0/person//Pfk3NA3n6tXMSY6QJMFdWw5w2e8jvlqkiMnpqP0IEJdlgw7m/profile?access_token=t4N06QPrUdoidv4uxVnNSeWDy9KlAIMXTOslCalPNRxwcUMi0AvCBsvS8HRYr186': {
              'endExtras': undefined,
              'endTime': 1657801566193,
              'startExtras': undefined,
              'startTime': 1657801566011,
              'totalTime': 182,
            },
            'network_XMLHttpRequest_https://cdn.laji.fi/mobiilivihko/version.txt': {
              'endExtras': undefined,
              'endTime': 1657801566872,
              'startExtras': undefined,
              'startTime': 1657801566437,
              'totalTime': 435,
            },
          },
        },
        '_requestId': null,
        '_response': '[{"name":"data","filename":"c85d3673-c000-4c3c-b24d-cf6f1cea98a6.jpg","id":"be9e6b12-0e74-4397-b9f1-1c99d832a1a8","expires":1657802586}]',
        '_responseType': '',
        '_sent': true,
        '_subscriptions': [],
        '_timedOut': false,
        '_trackingName': 'unknown',
        '_url': 'https://apitest.laji.fi/v0/images?personToken=Pfk3NA3n6tXMSY6QJMFdWw5w2e8jvlqkiMnpqP0IEJdlgw7m&access_token=t4N06QPrUdoidv4uxVnNSeWDy9KlAIMXTOslCalPNRxwcUMi0AvCBsvS8HRYr186',
        'readyState': 4,
        'responseHeaders': {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public',
          'Content-Type': 'application/json',
          'Date': 'Thu, 14 Jul 2022 12:28:08 GMT',
          'Referrer-Policy': 'no-referrer-when-downgrade',
          'Strict-Transport-Security': 'max-age=31536000;includeSubDomains;preload',
          'Vary': 'Accept-Encoding,User-Agent',
          'X-Content-Type-Options': 'nosniff',
          'X-Download-Options': 'noopen',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1;mode=block',
          'via': '1.1 fmnh-ws-test.it.helsinki.fi',
        },
        'responseURL': 'https://apitest.laji.fi/v0/images?personToken=Pfk3NA3n6tXMSY6QJMFdWw5w2e8jvlqkiMnpqP0IEJdlgw7m&access_token=t4N06QPrUdoidv4uxVnNSeWDy9KlAIMXTOslCalPNRxwcUMi0AvCBsvS8HRYr186',
        'status': 200,
        'timeout': 0,
        'upload': {},
        'withCredentials': true,
      },
      'status': 200,
      'statusText': undefined,
    }
  },
  postImageMetadata: async (tmpId: string, metadata: object) => {
    return {
      'config': {
        'adapter': [],
        'data': '{"capturerVerbatim":["Test Testman"],"intellectualOwner":"Test Testman","intellectualRights":"MZ.intellectualRightsCC-BY-4.0","keyword":["habitaatti"]}',
        'headers': {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        'maxBodyLength': -1,
        'maxContentLength': -1,
        'method': 'post',
        'params': {
          'access_token': 't4N06QPrUdoidv4uxVnNSeWDy9KlAIMXTOslCalPNRxwcUMi0AvCBsvS8HRYr186',
          'personToken': 'Pfk3NA3n6tXMSY6QJMFdWw5w2e8jvlqkiMnpqP0IEJdlgw7m',
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
        'url': 'https://apitest.laji.fi/v0/images/648d13ed-de48-4372-94d9-e56e45f1c771',
        'validateStatus': [],
        'xsrfCookieName': 'XSRF-TOKEN',
        'xsrfHeaderName': 'X-XSRF-TOKEN',
      },
      'data': {
        '@context': 'http://schema.laji.fi/context/image-en.jsonld',
        'capturerVerbatim': [
          'Test Testman',
        ],
        'fullURL': 'https://imagetest.laji.fi/MM.103959/7e70e3a7-4608-4e6a-a76a-f40e48584e06.jpg',
        'id': 'MM.103959',
        'intellectualOwner': 'Test Testman',
        'intellectualRights': 'MZ.intellectualRightsCC-BY-4.0',
        'keyword': [
          'habitaatti',
        ],
        'largeURL': 'https://imagetest.laji.fi/MM.103959/7e70e3a7-4608-4e6a-a76a-f40e48584e06.jpg',
        'originalURL': 'https://imagetest.laji.fi/MM.103959/7e70e3a7-4608-4e6a-a76a-f40e48584e06.jpg',
        'squareThumbnailURL': 'https://imagetest.laji.fi/MM.103959/7e70e3a7-4608-4e6a-a76a-f40e48584e06_square.jpg',
        'thumbnailURL': 'https://imagetest.laji.fi/MM.103959/7e70e3a7-4608-4e6a-a76a-f40e48584e06_thumb.jpg',
        'uploadedBy': 'MA.1',
      }
    }
  },
  postCoordinates: async (geometry: LineString | MultiLineString | Point) => {
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
      ]
    }
  },
  postError: async (errorData: { message: string, meta: Record<string, any> }) => {
    return {}
  },
  getNews: async (tag: string) => {
    return {
      'currentPage': 1,
      'lastPage': 1,
      'pageSize': 10,
      'total': 1,
      'results': [
        {
          'external': false,
          'content': '<p>This is a test. </p>',
          'title': 'Test - Please disregard',
          'author': 'Testi Testinen',
          'posted': '1678959989000',
          'tag': 'mobiilivihko',
          'id': '7457'
        }
      ]
    }
  },
  getNamedPlaces: async (collectionID: string) => {
    return [
      {
        'id': 'MNP.39004',
        'municipality': [
          'ML.660'
        ],
        'geometry': {
          'type': 'GeometryCollection',
          'geometries': [
            {
              'type': 'Polygon',
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
                    25.018809,
                    60.211475
                  ],
                  [
                    25.018924,
                    60.210995
                  ],
                  [
                    25.019898,
                    60.209955
                  ],
                  [
                    25.021357,
                    60.209386
                  ],
                  [
                    25.022271,
                    60.209394
                  ],
                  [
                    25.02372,
                    60.210099
                  ],
                  [
                    25.025321,
                    60.209576
                  ],
                  [
                    25.026286,
                    60.209825
                  ],
                  [
                    25.026616,
                    60.21022
                  ],
                  [
                    25.026867,
                    60.21074
                  ],
                  [
                    25.027282,
                    60.211501
                  ],
                  [
                    25.026744,
                    60.211827
                  ],
                  [
                    25.025948,
                    60.211969
                  ],
                  [
                    25.025213,
                    60.21201
                  ],
                  [
                    25.023613,
                    60.212519
                  ]
                ]
              ]
            }
          ]
        },
        'collectionID': 'HR.2951',
        'name': 'Mölylän metsä',
        'locality': 'Länsi-Herttoniemi, Vanhankaupunginlahti',
        'prepopulatedDocument': {
          'id': 'JX.294524',
          'formID': 'MHL.45',
          'editors': [
            'MA.2718'
          ],
          'secureLevel': 'MX.secureLevelNone',
          'gatheringEvent': {
            'leg': [
              'MA.2718'
            ],
            'dateBegin': '2022-07-11T12:47',
            'legPublic': false,
            'dateEnd': '2022-07-11T12:48'
          },
          'gatherings': [
            {
              'geometry': {
                'type': 'GeometryCollection',
                'geometries': [
                  {
                    'type': 'Polygon',
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
                          25.018809,
                          60.211475
                        ],
                        [
                          25.018924,
                          60.210995
                        ],
                        [
                          25.019898,
                          60.209955
                        ],
                        [
                          25.021357,
                          60.209386
                        ],
                        [
                          25.022271,
                          60.209394
                        ],
                        [
                          25.02372,
                          60.210099
                        ],
                        [
                          25.025321,
                          60.209576
                        ],
                        [
                          25.026286,
                          60.209825
                        ],
                        [
                          25.026616,
                          60.21022
                        ],
                        [
                          25.026867,
                          60.21074
                        ],
                        [
                          25.027282,
                          60.211501
                        ],
                        [
                          25.026744,
                          60.211827
                        ],
                        [
                          25.025948,
                          60.211969
                        ],
                        [
                          25.025213,
                          60.21201
                        ],
                        [
                          25.023613,
                          60.212519
                        ]
                      ]
                    ]
                  }
                ]
              }
            },
            {
              'geometry': {
                'type': 'GeometryCollection',
                'geometries': [
                  {
                    'type': 'Polygon',
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
                          25.018809,
                          60.211475
                        ],
                        [
                          25.018924,
                          60.210995
                        ],
                        [
                          25.019898,
                          60.209955
                        ],
                        [
                          25.021357,
                          60.209386
                        ],
                        [
                          25.022271,
                          60.209394
                        ],
                        [
                          25.02372,
                          60.210099
                        ],
                        [
                          25.025321,
                          60.209576
                        ],
                        [
                          25.026286,
                          60.209825
                        ],
                        [
                          25.026616,
                          60.21022
                        ],
                        [
                          25.026867,
                          60.21074
                        ],
                        [
                          25.027282,
                          60.211501
                        ],
                        [
                          25.026744,
                          60.211827
                        ],
                        [
                          25.025948,
                          60.211969
                        ],
                        [
                          25.025213,
                          60.21201
                        ],
                        [
                          25.023613,
                          60.212519
                        ]
                      ]
                    ]
                  }
                ]
              },
              'locality': 'Mölylän metsä'
            }
          ],
          'namedPlaceID': 'MNP.39004',
          'keywords': [],
          'publicityRestrictions': 'MZ.publicityRestrictionsPublic',
          'sourceID': 'KE.1141',
          'collectionID': 'HR.2951',
          'creator': 'MA.2718',
          'editor': 'MA.2718',
          'dateEdited': '2022-07-11T12:48:37+03:00',
          'dateCreated': '2022-07-11T12:48:37+03:00'
        },
        'public': true,
        'owners': [
          'MA.9'
        ],
        '@type': 'MNP.namedPlace',
        '@context': 'https://store-dev.luomus.fi/json-ld-context/MNP.namedPlace.json'
      },
      {
        'id': 'MNP.38187',
        'municipality': [
          'ML.660'
        ],
        'geometry': {
          'type': 'GeometryCollection',
          'geometries': [
            {
              'type': 'Polygon',
              'coordinates': [
                [
                  [
                    25.090203,
                    60.242307
                  ],
                  [
                    25.089003,
                    60.241454
                  ],
                  [
                    25.087946,
                    60.241096
                  ],
                  [
                    25.087048,
                    60.240236
                  ],
                  [
                    25.089054,
                    60.240372
                  ],
                  [
                    25.089452,
                    60.23966
                  ],
                  [
                    25.09078,
                    60.240302
                  ],
                  [
                    25.089905,
                    60.24101
                  ],
                  [
                    25.091066,
                    60.242129
                  ],
                  [
                    25.090203,
                    60.242307
                  ]
                ]
              ]
            }
          ]
        },
        'collectionID': 'HR.2951',
        'name': 'Koskenhaanpuisto',
        'prepopulatedDocument': {
          'id': 'JX.285276',
          'formID': 'MHL.45',
          'editors': [
            'MA.2718'
          ],
          'secureLevel': 'MX.secureLevelNone',
          'gatheringEvent': {
            'leg': [
              'MA.2718'
            ],
            'dateBegin': '2022-05-18T12:05',
            'legPublic': false,
            'dateEnd': '2022-05-18T12:07'
          },
          'gatherings': [
            {
              'geometry': {
                'type': 'GeometryCollection',
                'geometries': [
                  {
                    'type': 'Polygon',
                    'coordinates': [
                      [
                        [
                          25.090203,
                          60.242307
                        ],
                        [
                          25.089003,
                          60.241454
                        ],
                        [
                          25.087946,
                          60.241096
                        ],
                        [
                          25.087048,
                          60.240236
                        ],
                        [
                          25.089054,
                          60.240372
                        ],
                        [
                          25.089452,
                          60.23966
                        ],
                        [
                          25.09078,
                          60.240302
                        ],
                        [
                          25.089905,
                          60.24101
                        ],
                        [
                          25.091066,
                          60.242129
                        ],
                        [
                          25.090203,
                          60.242307
                        ]
                      ]
                    ]
                  }
                ]
              }
            },
            {
              'geometry': {
                'type': 'LineString',
                'coordinates': [
                  [
                    25.09185,
                    60.2406833
                  ],
                  [
                    25.0920239,
                    60.2409741
                  ],
                  [
                    25.0922322,
                    60.2412732
                  ],
                  [
                    25.0924339,
                    60.2415792
                  ],
                  [
                    25.0926246,
                    60.2418562
                  ],
                  [
                    25.0928777,
                    60.2421021
                  ],
                  [
                    25.0932295,
                    60.2423132
                  ],
                  [
                    25.0937046,
                    60.2424757
                  ],
                  [
                    25.0941914,
                    60.2426444
                  ],
                  [
                    25.0945204,
                    60.2429013
                  ],
                  [
                    25.0946252,
                    60.24317
                  ],
                  [
                    25.0945868,
                    60.2434419
                  ]
                ]
              },
              'locality': 'Koskenhaanpuisto'
            }
          ],
          'namedPlaceID': 'MNP.38187',
          'keywords': [],
          'publicityRestrictions': 'MZ.publicityRestrictionsPublic',
          'sourceID': 'KE.1141',
          'collectionID': 'HR.2951',
          'creator': 'MA.2718',
          'editor': 'MA.2718',
          'dateEdited': '2022-05-18T12:07:18+03:00',
          'dateCreated': '2022-05-18T12:07:18+03:00'
        },
        'public': true,
        'owners': [
          'MA.2718'
        ],
        '@type': 'MNP.namedPlace',
        '@context': 'https://store-dev.luomus.fi/json-ld-context/MNP.namedPlace.json'
      }
    ]
  },
  getLogin: async () => {
    return {
      'loginURL': 'https://fmnh-ws-test.it.helsinki.fi/laji-auth/login?target=KE.1141&redirectMethod=POST&next=%2F%3FtmpToken%3Dtmp_JuVT28QfBI6GTkpPOCfSnBZvAzZXzQXxK0X2dJoY6QY84ODB',
      'tmpToken': 'tmp_JuVT28QfBI6GTkpPOCfSnBZvAzZXzQXxK0X2dJoY6QY84ODB',
    }
  },
  postLoginCheck: async (tmpToken: string) => {
    return {
      'token': 'Pfk3NA3n6tXMSY6QJMFdWw5w2e8jvlqkiMnpqP0IEJdlgw7m'
    }
  },
  getPerson: async () => {
    return {
      '@context': 'http://schema.laji.fi/context/person-en.jsonld',
      'defaultLanguage': 'fi',
      'emailAddress': 'test.testman@testmail.com',
      'fullName': 'Test Testman',
      'group': 'LUOMUS',
      'id': 'MA.1',
      'role': [
        'MA.admin',
      ]
    }
  },
  getProfile: async () => {
    return {
      '@context': 'http://schema.laji.fi/context/profile.jsonld',
      '@type': 'MA.profile',
      'blocked': [],
      'friendRequests': [],
      'friends': [],
      'id': 'JX.1',
      'profileKey': 'aVX0EJiEGbEmaIvp',
      'settings': {
        'defaultMediaMetadata': {
          'capturerVerbatim': 'Test Testman',
          'intellectualOwner': 'Test Testman',
          'intellectualRights': 'MZ.intellectualRightsCC-BY-4.0',
        }
      },
      'userID': 'MA.1'
    }
  },
  getAuthenticationEvent: async () => {
    return {
      'next': '',
      'personId': 'MA.1',
      'target': 'KE.1141',
    }
  },
  deleteAuthenticationEvent: async () => {
    return {}
  }
}

export default lajiApiService
