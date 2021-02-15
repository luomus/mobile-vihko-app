import {
  mapActionTypes,
  EditingType,
  TOGGLE_CENTERED,
  SET_EDITING,
  SET_FIRST_ZOOM,
  TOGGLE_MAPTYPE,
  CLEAR_REGION,
  SET_REGION,
  FirstZoomType
} from './types'
import { Region } from 'react-native-maps'

const initEditingState: EditingType = {
  started: false,
  locChanged: false,
  originalSourcePage: ''
}

const initRegionState = {
  latitude: 64.559, longitude: 26.840, latitudeDelta: 12, longitudeDelta: 12
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

const firstZoomReducer = (state: FirstZoomType = 'not', action : mapActionTypes) => {
  switch (action.type) {
    case SET_FIRST_ZOOM:
      return action.payload
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
  firstZoomReducer,
  maptypeReducer,
  regionReducer
}