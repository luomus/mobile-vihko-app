import {
  LocationType,
  PathType,
  locationActionTypes,
  CLEAR_LOCATION,
  UPDATE_LOCATION,
  SET_FIRST_LOCATION,
  APPEND_PATH,
  CLEAR_PATH,
  SET_PATH
} from './types'

const firstLocationReducer = (state: Array<number> = [60.192059, 	24.945831], action: locationActionTypes) => {
  switch (action.type) {
    case SET_FIRST_LOCATION:
      return action.payload
    default:
      return state
  }
}

const pathReducer = (state: PathType = [], action : locationActionTypes) => {
  switch (action.type) {
    case APPEND_PATH:
      return [...state, ...action.payload]
    case SET_PATH:
      return action.payload
    case CLEAR_PATH:
      return []
    default:
      return state
  }
}

const positionReducer = (state: LocationType = null, action : locationActionTypes) => {
  switch (action.type) {
    case UPDATE_LOCATION:
      return action.payload
    case CLEAR_LOCATION:
      return null
    default:
      return state
  }
}

export { firstLocationReducer, pathReducer, positionReducer }