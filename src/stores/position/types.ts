import { LocationObject } from 'expo-location'

export const UPDATE_LOCATION = 'UPDATE_LOCATION'
export const CLEAR_LOCATION = 'CLEAR_LOCATION'
export const APPEND_PATH = 'APPEND_PATH'
export const SET_PATH = 'SET_PATH'
export const CLEAR_PATH = 'CLEAR_PATH'

export type locationType = LocationObject | null
export type pathType = Array<Array<number>>

interface updateLocation {
  type: typeof UPDATE_LOCATION,
  payload: LocationObject | null,
}

interface clearLocation {
  type: typeof CLEAR_LOCATION
}

interface appendPath {
  type: typeof APPEND_PATH,
  payload: Array<Array<number>>,
}

interface setPath {
  type: typeof SET_PATH,
  payload: Array<Array<number>>
}

interface clearPath {
  type: typeof CLEAR_PATH
}

export type locationActionTypes =
  updateLocation |
  clearLocation |
  appendPath |
  setPath |
  clearPath