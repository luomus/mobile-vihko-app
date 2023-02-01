import {
  LocationType,
  PathType,
  locationActionTypes,
  CLEAR_LOCATION,
  UPDATE_LOCATION,
  SET_FIRST_LOCATION,
  CLEAR_PATH,
  SET_PATH,
  GridType,
  SET_GRID,
  CLEAR_GRID,
  SET_COORDS,
  SET_PAUSE,
  SET_OUTSIDE_BORDERS,
  SET_TRACKING,
} from './types'

const firstLocationReducer = (state: Array<number> = [60.192059, 	24.945831], action: locationActionTypes) => {
  switch (action.type) {
    case SET_FIRST_LOCATION:
      return action.payload
    default:
      return state
  }
}

const pathReducer = (state: PathType = [[]], action: locationActionTypes) => {
  switch (action.type) {
    case SET_PATH:
      return action.payload
    case CLEAR_PATH:
      return [[]]
    default:
      return state
  }
}

const positionReducer = (state: LocationType = null, action: locationActionTypes) => {
  switch (action.type) {
    case UPDATE_LOCATION:
      return action.payload
    case CLEAR_LOCATION:
      return null
    default:
      return state
  }
}

const gridReducer = (state: GridType = null, action: locationActionTypes) => {
  switch (action.type) {
    case SET_GRID:
      return action.payload
    case CLEAR_GRID:
      return null
    case SET_COORDS:
      return {
        ...state,
        ...action.payload
      }
    case SET_PAUSE:
      return {
        ...state,
        pauseGridCheck: action.payload
      }
    case SET_OUTSIDE_BORDERS:
      return {
        ...state,
        outsideBorders: action.payload
      }
    default:
      return state
  }
}

const trackingReducer = (state = true, action: locationActionTypes) => {
  switch (action.type) {
    case SET_TRACKING:
      return action.payload
    default:
      return state
  }
}

export { firstLocationReducer, pathReducer, positionReducer, gridReducer, trackingReducer }