import {
  mapActionTypes,
  EditingType,
  ListOrderType,
  ObservationZonesType,
  SET_EDITING,
  CLEAR_CURRENT_OBS_ZONE,
  GET_OBS_ZONES_SUCCESS,
  SET_CURRENT_OBS_ZONE,
  CLEAR_REGION,
  SET_REGION,
  SET_LIST_ORDER
} from './types'
import { Region } from 'react-native-maps'

const initEditingState: EditingType = {
  started: false,
  locChanged: false,
  originalLocation: { 'coordinates': [64.559, 26.840], 'type': 'Point' },
  originalSourcePage: ''
}

const initListOrderState: ListOrderType = {
  class: ''
}

const initRegionState = {
  latitude: 64.559, longitude: 26.840, latitudeDelta: 12, longitudeDelta: 12
}

const initZoneState: ObservationZonesType = {
  currentZoneId: '',
  zones: []
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

const listOrderReducer = (state: ListOrderType = initListOrderState, action: mapActionTypes) => {
  switch (action.type) {
    case SET_LIST_ORDER:
      return action.payload
    default:
      return state
  }
}

const observationZoneReducer = (state = initZoneState, action: mapActionTypes) => {
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
  editingReducer,
  listOrderReducer,
  observationZoneReducer,
  regionReducer
}