import { Point } from 'geojson'

export const SET_OBSERVATION = 'SET_OBSERVATION'
export const CLEAR_OBSERVATION = 'CLEAR_OBSERVATION'
export const TOGGLE_OBSERVING = 'TOGGLE_OBSERVING'

export const NEW_OBSERVATION_EVENT = 'NEW_OBSERVATION_EVENT'
export const ALL_OBSERVATION_EVENTS = 'ALL_OBSERVATION_EVENTS'
export const REPLACE_OBSERVATION_EVENTS = 'REPLACE_OBSERVATION_EVENTS'
export const DELETE_OBSERVATION = 'DELETE_OBSERVATION'
export const CLEAR_OBSERVATION_EVENTS = 'CLEAR_OBSERVATION_EVENTS'

export const SET_SCHEMA = 'SET_SCHEMA_SUCCESS'

export const SET_OBSERVATION_ID = 'SET_OBSERVATION_ID'
export const CLEAR_OBSERVATION_ID = 'CLEAR_OBSERVATION_ID'

export interface SchemaType extends Record<string, any> {
  error: string | null,
  loading: boolean,
  fi: Record<string, any> | null,
  sv: Record<string, any> | null,
  en: Record<string, any> | null,
}

export interface ObservationEventType {
  events: Record<string, any>[],
}

interface setObservationLocation {
  type: typeof SET_OBSERVATION,
  payload: Point | null,
}

interface clearObservationLocation {
  type: typeof CLEAR_OBSERVATION,
}

interface toggleObserving {
  type: typeof TOGGLE_OBSERVING,
}

interface newObservationEvent {
  type: typeof NEW_OBSERVATION_EVENT,
  payload: Record<string, any>,
}

interface replaceObservationEvents {
  type: typeof REPLACE_OBSERVATION_EVENTS,
  payload: Record<string, any>[],
}

interface clearObservationEvents {
  type: typeof CLEAR_OBSERVATION_EVENTS,
}

interface setSchema {
  type: typeof SET_SCHEMA,
  payload: Record<string, any>,
}

interface setObservationId {
  type: typeof SET_OBSERVATION_ID,
  payload: object,
}

interface clearObservationId {
  type: typeof CLEAR_OBSERVATION_ID,
}

export type observationActionTypes =
  setObservationLocation |
  clearObservationLocation |
  toggleObserving |
  newObservationEvent |
  replaceObservationEvents |
  clearObservationEvents |
  setSchema |
  setObservationId |
  clearObservationId