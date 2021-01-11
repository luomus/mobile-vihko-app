import { LocationData } from 'expo-location'
import {
  UPDATE_LOCATION,
  CLEAR_LOCATION,
  APPEND_PATH,
  SET_PATH,
  CLEAR_PATH,
  locationActionTypes
} from './types'
import { Store } from 'redux'

export const updateLocation = (location: LocationData | null): locationActionTypes => ({
  type: UPDATE_LOCATION,
  payload: location,
})

export const clearLocation = (): locationActionTypes => ({
  type: CLEAR_LOCATION
})

export const appendPath = (store: Store, locations: LocationData[]): void => {
  if (locations.length > 0) {
    const points: Array<Array<number>> = locations.map(location => {
      const coords = location.coords

      return [coords.longitude, coords.latitude]
    })

    store.dispatch({
      type: APPEND_PATH,
      payload: points
    })
  }
}

export const setPath = (points: Array<Array<number>>) => ({
  type: SET_PATH,
  payload: points
})

export const clearPath = (): locationActionTypes => ({
  type: CLEAR_PATH
})