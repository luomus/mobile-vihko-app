import {
  locationActionTypes,
  UPDATE_LOCATION,
  CLEAR_LOCATION,
  APPEND_PATH,
  CLEAR_PATH,
  pathType,
  locationType,
  SET_PATH
} from './types'

const positionReducer = (state: locationType = null, action : locationActionTypes) => {
  switch (action.type) {
    case UPDATE_LOCATION:
      return action.payload
    case CLEAR_LOCATION:
      return null
    default:
      return state
  }
}

const pathReducer = (state: pathType = [], action : locationActionTypes) => {
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

export { positionReducer, pathReducer }