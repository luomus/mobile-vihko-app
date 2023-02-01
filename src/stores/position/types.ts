import { LocationObject } from 'expo-location'
import { Polygon } from 'geojson'

export const CLEAR_LOCATION = 'CLEAR_LOCATION'
export const UPDATE_LOCATION = 'UPDATE_LOCATION'

export const SET_FIRST_LOCATION = 'SET_FIRST_LOCATION'

export const APPEND_PATH = 'APPEND_PATH'
export const CLEAR_PATH = 'CLEAR_PATH'
export const SET_PATH = 'SET_PATH'

export const SET_GRID = 'SET_GRID'
export const CLEAR_GRID = 'CLEAR_GRID'
export const SET_COORDS = 'SET_COORDS'
export const SET_PAUSE = 'SET_PAUSE'
export const SET_OUTSIDE_BORDERS = 'SET_OUTSIDE_BORDERS'

export const SET_TRACKING = 'SET_TRACKING'

export type PathPoint = [
  number,
  number,
  number,
  number,
  boolean
]

export type GridType = {
  n: number,
  e: number,
  geometry: Polygon | undefined,
  name: string,
  pauseGridCheck: boolean,
  outsideBorders: 'false' | 'pending' | 'true'
} | null

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

interface setGrid {
  type: typeof SET_GRID,
  payload: GridType
}

interface clearGrid {
  type: typeof CLEAR_GRID
}

interface setGridCoords {
  type: typeof SET_COORDS,
  payload: {n: number, e: number}
}

interface setGridPause {
  type: typeof SET_PAUSE,
  payload: boolean
}

interface setOutsideBorders {
  type: typeof SET_OUTSIDE_BORDERS,
  payload: 'false' | 'pending' | 'true'
}

interface setTracking {
  type: typeof SET_TRACKING,
  payload: boolean
}

export type locationActionTypes =
  clearLocation |
  updateLocation |
  setFirstLocation |
  appendPath |
  clearPath |
  setPath |
  setGrid |
  clearGrid |
  setGridCoords |
  setGridPause |
  setOutsideBorders |
  setTracking