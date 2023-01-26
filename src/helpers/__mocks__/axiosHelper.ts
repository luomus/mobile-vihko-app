import { getLoginUrl, getUserUrl, personTokenUrl, pollLoginUrl } from '../../config/urls'
import storageService from '../../services/storageService'

const getLoginUrlMockData = {
  'loginURL': 'https://fmnh-ws-test.it.helsinki.fi/laji-auth/login?target=KE.1141&redirectMethod=POST&next=%2F%3FtmpToken%3Dtmp_JuVT28QfBI6GTkpPOCfSnBZvAzZXzQXxK0X2dJoY6QY84ODB',
  'tmpToken': 'tmp_JuVT28QfBI6GTkpPOCfSnBZvAzZXzQXxK0X2dJoY6QY84ODB',
}

const getUserUrlMockData = {
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

const getUserUrlMockDataWithProfile = {
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

const personTokenUrlMockData = {
  'next': '',
  'personId': 'MA.1',
  'target': 'KE.1141',
}

const pollLoginUrlMockData = {
  'token': 'Pfk3NA3n6tXMSY6QJMFdWw5w2e8jvlqkiMnpqP0IEJdlgw7m'
}

// TODO: add more url -> default responses to the functions below

export const get = async (url: string, config?: object) => {
  if (await storageService.fetch('testingInternetStatus') === 404) {
    throw {}
  }
  console.log('get(' + url + ')')
  if (url === getLoginUrl) {
    return { 'data': getLoginUrlMockData }
  } else if (url.startsWith(getUserUrl)) {
    if (url.endsWith('/profile')) {
      return { 'data': getUserUrlMockDataWithProfile }
    } else {
      return { 'data': getUserUrlMockData }
    }
  } else if (url.startsWith(personTokenUrl)) {
    return { 'data': personTokenUrlMockData }
  } else {
    console.error('WARNING! Axios Mock is not handling url "' + url + '" yet.')
  }
}

export const post = async (url: string, data: any, config?: object) => {
  if (await storageService.fetch('testingInternetStatus') === 404) {
    throw {}
  }
  console.log('post(' + url + ')')
  if (url === pollLoginUrl) {
    return { 'data': pollLoginUrlMockData }
  } else {
    console.error('WARNING! Axios Mock is not handling url "' + url + '" yet.')
  }
}

export const axiosDelete = async (url: string, config?: object) => {
  if (await storageService.fetch('testingInternetStatus') === 404) {
    throw {}
  }
  console.log('delete(' + url + ')')
  if (url.startsWith(personTokenUrl)) {
    return {}
  } else {
    console.error('WARNING! Axios Mock is not handling url "' + url + '" yet.')
  }
}