import {
  observationActionTypes,
  ObservationEventType,
  CLEAR_OBSERVATION,
  SET_OBSERVATION,
  SET_OBSERVATION_EVENT_INTERRUPTED,
  CLEAR_OBSERVATION_EVENTS,
  REPLACE_OBSERVATION_EVENTS,
  SET_OBSERVATION_ID,
  CLEAR_OBSERVATION_ID,
  SET_OBSERVATION_EVENT_ID,
  CLEAR_OBSERVATION_EVENT_ID,
  SET_OBSERVING,
  SET_SINGLE_OBSERVATION
} from './types'

const initObsEventState: ObservationEventType = {
  events: []
}

const observationReducer = (state = null, action : observationActionTypes) => {
  switch (action.type) {
    case SET_OBSERVATION:
      return action.payload
    case CLEAR_OBSERVATION:
      return null
    default:
      return state
  }
}

const observationEventInterruptedReducer = (state = false, action : observationActionTypes) => {
  switch (action.type) {
    case SET_OBSERVATION_EVENT_INTERRUPTED:
      return action.payload
    default:
      return state
  }
}

const observationEventsReducer = (state: ObservationEventType = initObsEventState, action : observationActionTypes) => {
  let newState
  switch (action.type) {
    case REPLACE_OBSERVATION_EVENTS:
      newState = {
        ...state,
        events: action.payload
      }
      return newState
    case CLEAR_OBSERVATION_EVENTS:
      newState = {
        ...state,
        events: []
      }
      return newState
    default:
      return state
  }
}

const observationIdReducer = (state = '', action : observationActionTypes) => {
  switch (action.type) {
    case SET_OBSERVATION_ID:
      return action.payload
    case CLEAR_OBSERVATION_ID:
      return ''
    default:
      return state
  }
}

const observationEventIdReducer = (state = '', action : observationActionTypes) => {
  switch (action.type) {
    case SET_OBSERVATION_EVENT_ID:
      return action.payload
    case CLEAR_OBSERVATION_EVENT_ID:
      return ''
    default:
      return state
  }
}

const observingReducer = (state = false, action : observationActionTypes) => {
  switch (action.type) {
    case SET_OBSERVING:
      return action.payload
    default:
      return state
  }
}

const singleObservationReducer = (state = false, action : observationActionTypes) => {
  switch (action.type) {
    case SET_SINGLE_OBSERVATION:
      return action.payload
    default:
      return state
  }
}

export {
  observationReducer,
  observationEventInterruptedReducer,
  observationEventsReducer,
  observationIdReducer,
  observationEventIdReducer,
  observingReducer,
  singleObservationReducer
}