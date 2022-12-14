import { Region } from 'react-native-maps'
import { GeometryCollection } from 'geojson'

export const SET_EDITING = 'SET_EDITING'

export const CLEAR_CURRENT_OBS_ZONE = 'CLEAR_CURRENT_OBS_ZONE'
export const GET_OBS_ZONES_SUCCESS = 'GET_OBS_ZONES_SUCCESS'
export const SET_CURRENT_OBS_ZONE = 'SET_CURRENT_OBS_ZONE'
export const TOGGLE_ZONE = 'TOGGLE_ZONE'

export const CLEAR_REGION = 'CLEAR_REGION'
export const SET_REGION = 'SET_REGION'

export interface EditingType {
  started: boolean,
  locChanged: boolean,
  originalSourcePage: string
}

export interface ObservationZonesType {
  currentZoneId: string,
  zones: ZoneType[],
}

export interface ZoneType {
  name: string,
  id: string,
  geometry: GeometryCollection | null,
}

interface setEditing {
  type: typeof SET_EDITING,
  payload: EditingType,
}

interface clearCurrentObservationZone {
  type: typeof CLEAR_CURRENT_OBS_ZONE,
}

interface getObservationZonesSuccess {
  type: typeof GET_OBS_ZONES_SUCCESS,
  payload: ZoneType[],
}

interface setCurrentObservationZone {
  type: typeof SET_CURRENT_OBS_ZONE,
  payload: string,
}

interface clearRegion {
  type: typeof CLEAR_REGION,
}

interface setRegion {
  type: typeof SET_REGION,
  payload: Region,
}

export type mapActionTypes =
  setEditing |
  clearRegion |
  setRegion |
  setCurrentObservationZone |
  clearCurrentObservationZone |
  getObservationZonesSuccess