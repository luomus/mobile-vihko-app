import { LocationObject } from 'expo-location'

export const CLEAR_LOCATION = 'CLEAR_LOCATION'
export const UPDATE_LOCATION = 'UPDATE_LOCATION'

export const SET_FIRST_LOCATION = 'SET_FIRST_LOCATION'

export const APPEND_PATH = 'APPEND_PATH'
export const CLEAR_PATH = 'CLEAR_PATH'
export const SET_PATH = 'SET_PATH'

export type PathPoint = [
  number,
  number,
  number,
  number,
  boolean
]

export type LocationType = LocationObject | null
export type PathType = Array<Array<PathPoint>>

interface clearLocation {
  type: typeof CLEAR_LOCATION
}

interface updateLocation {
  type: typeof UPDATE_LOCATION,
  payload: LocationObject | null,
}

interface setFirstLocation {
  type: typeof SET_FIRST_LOCATION,
  payload: Array<number>
}

interface appendPath {
  type: typeof APPEND_PATH,
  payload: PathType,
}

interface clearPath {
  type: typeof CLEAR_PATH
}

interface setPath {
  type: typeof SET_PATH,
  payload: PathType
}

export type locationActionTypes =
  clearLocation |
  updateLocation |
  setFirstLocation |
  appendPath |
  clearPath |
  setPath