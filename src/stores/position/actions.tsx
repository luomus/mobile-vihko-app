import { ThunkAction } from 'redux-thunk'
import { LocationData } from 'expo-location'
import {
  UPDATE_LOCATION,
  CLEAR_LOCATION,
  APPEND_PATH,
  SET_PATH,
  CLEAR_PATH,
  locationActionTypes,
  PathType,
  SET_FIRST_LOCATION
} from './types'

export const updateLocation = (location: LocationData | null): locationActionTypes => ({
  type: UPDATE_LOCATION,
  payload: location,
})

export const clearLocation = (): locationActionTypes => ({
  type: CLEAR_LOCATION
})

export const appendPath = (locations: LocationData[]): ThunkAction<Promise<any>, any, void, locationActionTypes> => {
  return async dispatch => {
    if (locations.length > 0) {
      const points: Array<Array<number>> = locations.map(location => {
        const coords = location.coords

        return [coords.longitude, coords.latitude]
      })

      dispatch({
        type: APPEND_PATH,
        payload: points
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