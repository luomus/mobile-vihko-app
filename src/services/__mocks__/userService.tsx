import { createAsyncThunk } from '@reduxjs/toolkit'
import { CredentialsType } from '../../stores'
import i18n from '../../languages/i18n'

interface checkTokenValidityParams {
  credentials: CredentialsType
}

export const getTempTokenAndLoginUrl = async () => {
  return {
    'loginURL': 'https://fmnh-ws-test.it.helsinki.fi/laji-auth/login?target=KE.1141&redirectMethod=POST&next=%2F%3FtmpToken%3Dtmp_JuVT28QfBI6GTkpPOCfSnBZvAzZXzQXxK0X2dJoY6QY84ODB',
    'tmpToken': 'tmp_JuVT28QfBI6GTkpPOCfSnBZvAzZXzQXxK0X2dJoY6QY84ODB',
  }
}

export const postTmpToken = async (tmpToken: string) => {
  return {
    'token': 'Pfk3NA3n6tXMSY6QJMFdWw5w2e8jvlqkiMnpqP0IEJdlgw7m'
  }
}

export const getUserByPersonToken = async (personToken: string) => {
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
}

export const pollUserLogin = async (tmpToken: string, setCanceler: any) => {
  return {
    'token': 'Pfk3NA3n6tXMSY6QJMFdWw5w2e8jvlqkiMnpqP0IEJdlgw7m',
    'user': {
      '@context': 'http://schema.laji.fi/context/person-en.jsonld',
      'defaultLanguage': 'fi',
      'emailAddress': 'test.testman@testmail.com',
      'fullName': 'Test Testman',
      'group': 'LUOMUS',
      'id': 'MA.1',
      'role': [
        'MA.admin',
      ],
    },
  }
}

export const getTokenValidity = async (personToken: string) => {
  return {
    'next': '',
    'personId': 'MA.1',
    'target': 'KE.1141',
  }
}

export const getProfile = async () => {
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
}

export const logout = async (credentials: CredentialsType) => {
  return {}
}

export default { getTempTokenAndLoginUrl, postTmpToken, getUserByPersonToken, getTokenValidity, getProfile, logout }