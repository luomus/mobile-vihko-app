import { Region } from 'react-native-maps'

export const SET_REGION = 'SET_REGION'
export const CLEAR_REGION = 'CLEAR_REGION'
export const TOGGLE_CENTERED = 'TOGGLE_CENTERED'
export const TOGGLE_MAPTYPE = 'TOGGLE_MAPTYPE'
export const SET_EDITING = 'SET_EDITING'

export interface EditingType {
  started: boolean,
  locChanged: boolean,
}

interface setRegion {
  type: typeof SET_REGION,
  payload: Region,
}

interface clearRegion {
  type: typeof CLEAR_REGION,
}

interface toggleCentered {
  type: typeof TOGGLE_CENTERED,
}

interface toggleMaptype {
  type: typeof TOGGLE_MAPTYPE,
}

interface setEditing {
  type: typeof SET_EDITING,
  payload: EditingType,
}

export type mapActionTypes =
  setRegion |
  clearRegion |
  toggleCentered |
  toggleMaptype |
  setEditing
