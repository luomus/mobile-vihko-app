import { Point } from 'geojson'

export const CLEAR_OBSERVATION = 'CLEAR_OBSERVATION'
export const SET_OBSERVATION = 'SET_OBSERVATION'

export const SET_OBSERVATION_EVENT_FINISHED = 'SET_OBSERVATION_EVENT_FINISHED'

export const SET_OBSERVATION_EVENT_INTERRUPTED = 'SET_OBSERVATION_EVENT_INTERRUPTED'

export const ALL_OBSERVATION_EVENTS = 'ALL_OBSERVATION_EVENTS'
export const CLEAR_OBSERVATION_EVENTS = 'CLEAR_OBSERVATION_EVENTS'
export const DELETE_OBSERVATION = 'DELETE_OBSERVATION'
export const NEW_OBSERVATION_EVENT = 'NEW_OBSERVATION_EVENT'
export const REPLACE_OBSERVATION_EVENTS = 'REPLACE_OBSERVATION_EVENTS'

export const SET_OBSERVATION_ID = 'SET_OBSERVATION_ID'
export const CLEAR_OBSERVATION_ID = 'CLEAR_OBSERVATION_ID'

export const SET_OBSERVATION_EVENT_ID = 'SET_OBSERVATION_EVENT_ID'
export const CLEAR_OBSERVATION_EVENT_ID = 'CLEAR_OBSERVATION_EVENT_ID'

export const SET_OBSERVING = 'SET_OBSERVING'

export const SET_SINGLE_OBSERVATION = 'SET_SINGLE_OBSERVATION'

export interface ObservationEventType {
  events: Record<string, any>[],
}

interface clearObservationLocation {
  type: typeof CLEAR_OBSERVATION,
}

interface setObservationLocation {
  type: typeof SET_OBSERVATION,
  payload: Point | null,
}

interface clearObservationEvents {
  type: typeof CLEAR_OBSERVATION_EVENTS,
}

interface setObservationEventInterrupted {
  type: typeof SET_OBSERVATION_EVENT_INTERRUPTED,
  payload: boolean
}

interface replaceObservationEvents {
  type: typeof REPLACE_OBSERVATION_EVENTS,
  payload: Record<string, any>[],
}

interface setObservationId {
  type: typeof SET_OBSERVATION_ID,
  payload: string,
}

interface clearObservationId {
  type: typeof CLEAR_OBSERVATION_ID
}

interface setObservationEventId {
  type: typeof SET_OBSERVATION_EVENT_ID,
  payload: string
}

interface clearObservationEventId {
  type: typeof CLEAR_OBSERVATION_EVENT_ID
}

interface setObserving {
  type: typeof SET_OBSERVING,
  payload: boolean
}

interface setSingleObservation {
  type: typeof SET_SINGLE_OBSERVATION,
  payload: boolean
}

export type observationActionTypes =
  clearObservationLocation |
  setObservationLocation |
  setObservationEventInterrupted |
  clearObservationEvents |
  replaceObservationEvents |
  setObservationId |
  clearObservationId |
  setObservationEventId |
  clearObservationEventId |
  setObserving |
  setSingleObservation
