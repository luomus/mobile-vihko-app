import { Region } from 'react-native-maps'
import { GeometryCollection } from 'geojson'

export const SET_REGION = 'SET_REGION'
export const CLEAR_REGION = 'CLEAR_REGION'
export const SET_CURRENT_OBS_ZONE = 'SET_CURRENT_OBS_ZONE'
export const CLEAR_CURRENT_OBS_ZONE = 'CLEAR_CURRENT_OBS_ZONE'
export const GET_OBS_ZONES_SUCCESS = 'GET_OBS_ZONES_SUCCESS'
export const TOGGLE_CENTERED = 'TOGGLE_CENTERED'
export const TOGGLE_MAPTYPE = 'TOGGLE_MAPTYPE'
export const TOGGLE_ZONE  = 'TOGGLE_ZONE'
export const SET_EDITING = 'SET_EDITING'

export interface EditingType {
  started: boolean,
  locChanged: boolean,
}

export interface ZoneType {
  name: string,
  id: string,
  geometry: GeometryCollection | null,
}

export interface ObservationZonesType {
  currentZoneId: string,
  zones: ZoneType[],
}

interface setRegion {
  type: typeof SET_REGION,
  payload: Region,
}

interface clearRegion {
  type: typeof CLEAR_REGION,
}

interface setCurrentObservationZone {
  type : typeof SET_CURRENT_OBS_ZONE,
  payload: string,
}

interface clearCurrentObservationZone {
  type: typeof CLEAR_CURRENT_OBS_ZONE,
}

interface getObservationZonesSuccess {
  type: typeof GET_OBS_ZONES_SUCCESS,
  payload: ZoneType[],
}

interface toggleCentered {
  type: typeof TOGGLE_CENTERED,
}

interface toggleMaptype {
  type: typeof TOGGLE_MAPTYPE,
}

interface toggleZoomToZone {
  type: typeof TOGGLE_ZONE,
}

interface setEditing {
  type: typeof SET_EDITING,
  payload: EditingType,
}

export type mapActionTypes =
  setRegion |
  clearRegion |
  setCurrentObservationZone |
  clearCurrentObservationZone |
  getObservationZonesSuccess |
  toggleCentered |
  toggleMaptype |
  toggleZoomToZone |
  setEditing
