import {
  mapActionTypes,
  EditingType,
  ObservationZonesType,
  TOGGLE_CENTERED,
  SET_EDITING,
  SET_FIRST_ZOOM,
  TOGGLE_MAPTYPE,
  CLEAR_CURRENT_OBS_ZONE,
  GET_OBS_ZONES_SUCCESS,
  SET_CURRENT_OBS_ZONE,
  CLEAR_REGION,
  SET_REGION,
  FirstZoomType
} from './types'
import { MapType, Region } from 'react-native-maps'

const initEditingState: EditingType = {
  started: false,
  locChanged: false,
  originalSourcePage: ''
}

const initRegionState = {
  latitude: 64.559, longitude: 26.840, latitudeDelta: 12, longitudeDelta: 12
}

const initZoneState: ObservationZonesType = {
  currentZoneId: '',
  zones: []
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

const maptypeReducer = (state: MapType = 'terrain', action : mapActionTypes) => {
  let newState: MapType
  switch (action.type) {
    case TOGGLE_MAPTYPE:
      newState = state === 'terrain' ? 'satellite' : 'terrain'
      return newState
    default:
      return state
  }
}

const observationZoneReducer = (state = initZoneState, action : mapActionTypes) => {
  switch (action.type) {
    case CLEAR_CURRENT_OBS_ZONE:
      return {
        ...state,
        currentZoneId: ''
      }
    case GET_OBS_ZONES_SUCCESS:
      return {
        ...initZoneState,
        zones: action.payload
      }
    case SET_CURRENT_OBS_ZONE:
      return {
        ...state,
        currentZoneId: action.payload
      }
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
  observationZoneReducer,
  regionReducer
}