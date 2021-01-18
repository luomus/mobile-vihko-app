import { LocationObject } from 'expo-location'

export const CLEAR_LOCATION = 'CLEAR_LOCATION'
export const UPDATE_LOCATION = 'UPDATE_LOCATION'

export const APPEND_PATH = 'APPEND_PATH'
export const CLEAR_PATH = 'CLEAR_PATH'
export const SET_PATH = 'SET_PATH'

export type LocationType = LocationObject | null
export type PathType = Array<Array<number>>

interface clearLocation {
  type: typeof CLEAR_LOCATION
}

interface updateLocation {
  type: typeof UPDATE_LOCATION,
  payload: LocationObject | null,
}

interface appendPath {
  type: typeof APPEND_PATH,
  payload: Array<Array<number>>,
}

interface clearPath {
  type: typeof CLEAR_PATH
}

interface setPath {
  type: typeof SET_PATH,
  payload: Array<Array<number>>
}

export type locationActionTypes =
  clearLocation |
  updateLocation |
  appendPath |
  clearPath |
  setPath