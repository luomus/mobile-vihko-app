import {
  mapActionTypes,
  EditingType,
  TOGGLE_CENTERED,
  SET_EDITING,
  TOGGLE_MAPTYPE,
  CLEAR_REGION,
  SET_REGION
} from './types'
import { Region } from 'react-native-maps'

const initEditingState: EditingType = {
  started: false,
  locChanged: false,
  originalSourcePage: ''
}

const initRegionState = {
  latitude: 60.171, longitude: 24.931, latitudeDelta: 0.010, longitudeDelta: 0.010
}

const centeringReducer = (state: boolean = true, action : mapActionTypes) => {
  let newState
  switch (action.type) {
    case TOGGLE_CENTERED:
      newState = !state
      return newState
    default:
      return state
  }
}

const editingReducer = (state: EditingType = initEditingState, action: mapActionTypes) => {
  let newState
  switch (action.type) {
    case SET_EDITING:
      newState = action.payload
      return newState
    default:
      return state
  }
}

const maptypeReducer = (state: 'topographic' | 'satellite' = 'topographic', action : mapActionTypes) => {
  let newState
  switch (action.type) {
    case TOGGLE_MAPTYPE:
      newState = state === 'topographic' ? 'satellite' : 'topographic'
      return newState
    default:
      return state
  }
}

const regionReducer = (state: Region = initRegionState, action: mapActionTypes) => {
  switch (action.type) {
    case CLEAR_REGION:
      return initRegionState
    case SET_REGION:
      return action.payload
    default:
      return state
  }
}

export {
  centeringReducer,
  editingReducer,
  maptypeReducer,
  regionReducer
}