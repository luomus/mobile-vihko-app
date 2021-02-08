import { Region } from 'react-native-maps'

export const TOGGLE_CENTERED = 'TOGGLE_CENTERED'

export const SET_EDITING = 'SET_EDITING'

export const SET_FIRST_ZOOM = 'SET_FIRST_ZOOM'

export const TOGGLE_MAPTYPE = 'TOGGLE_MAPTYPE'

export const CLEAR_REGION = 'CLEAR_REGION'
export const SET_REGION = 'SET_REGION'

export interface EditingType {
  started: boolean,
  locChanged: boolean,
  originalSourcePage: string
}

interface toggleCentered {
  type: typeof TOGGLE_CENTERED,
}

interface setEditing {
  type: typeof SET_EDITING,
  payload: EditingType,
}

interface setFirstZoom {
  type: typeof SET_FIRST_ZOOM,
  payload: boolean
}

interface toggleMaptype {
  type: typeof TOGGLE_MAPTYPE,
}

interface clearRegion {
  type: typeof CLEAR_REGION,
}

interface setRegion {
  type: typeof SET_REGION,
  payload: Region,
}

export type mapActionTypes =
  toggleCentered |
  setEditing |
  setFirstZoom |
  toggleMaptype |
  clearRegion |
  setRegion
