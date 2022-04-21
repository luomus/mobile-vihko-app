import { ThunkAction } from 'redux-thunk'
import { LocationObject } from 'expo-location'
import {
  UPDATE_LOCATION,
  CLEAR_LOCATION,
  SET_PATH,
  CLEAR_PATH,
  locationActionTypes,
  PathType,
  PathPoint,
  SET_FIRST_LOCATION,
  GridType,
  SET_GRID,
  CLEAR_GRID,
  SET_COORDS,
  SET_PAUSE,
  PAUSE,
  UNPAUSE,
} from './types'
import { gpsOutlierFilter } from '../../helpers/pathFilters'

export const updateLocation = (location: LocationObject | null): locationActionTypes => ({
  type: UPDATE_LOCATION,
  payload: location,
})

export const clearLocation = (): locationActionTypes => ({
  type: CLEAR_LOCATION
})

export const appendPath = (locations: LocationObject[]): ThunkAction<Promise<any>, any, void, locationActionTypes> => {
  return async (dispatch, getState) => {
    const { path } : { path: PathType } = getState()
    const currentPath: Array<PathPoint> = path.slice(-1)[0]

    if (locations.length > 0) {
      const points = gpsOutlierFilter(currentPath, locations)

      if (!points) {
        return Promise.resolve()
      }

      let newPath = [...path.slice(0, -1), [ ...currentPath, ...points ]]

      dispatch({
        type: SET_PATH,
        payload: newPath
      })
    }
    Promise.resolve()
  }
}

export const setPath = (points: PathType): locationActionTypes => ({
  type: SET_PATH,
  payload: points
})

export const clearPath = (): locationActionTypes => ({
  type: CLEAR_PATH
})

export const setFirstLocation = (coordinates: Array<number>): locationActionTypes => ({
  type: SET_FIRST_LOCATION,
  payload: coordinates
})

export const setGrid = (grid: GridType): locationActionTypes => ({
  type: SET_GRID,
  payload: grid
})

export const clearGrid = (): locationActionTypes => ({
  type: CLEAR_GRID
})

export const setGridCoords = (coordinates: {n: number, e: number}): locationActionTypes => ({
  type: SET_COORDS,
  payload: coordinates
})

export const setGridPause = (state: boolean): locationActionTypes => ({
  type: SET_PAUSE,
  payload: state
})

export const pause = (): locationActionTypes => ({
  type: PAUSE
})

export const unpause = (): locationActionTypes => ({
  type: UNPAUSE
})