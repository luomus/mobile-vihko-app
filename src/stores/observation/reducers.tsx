import {
  SchemaType,
  observationActionTypes,
  ObservationEventType,
  CLEAR_OBSERVATION,
  SET_OBSERVATION,
  CLEAR_OBSERVATION_EVENTS,
  NEW_OBSERVATION_EVENT,
  REPLACE_OBSERVATION_EVENTS,
  CLEAR_OBSERVATION_ID,
  SET_OBSERVATION_ID,
  TOGGLE_OBSERVING,
  SET_SCHEMA
} from './types'

const initObsEventState: ObservationEventType = {
  events: []
}

const initSchemaState: SchemaType = {
  fi: null,
  en: null,
  sv: null,
  formID: ''
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

const observationEventsReducer = (state: ObservationEventType = initObsEventState, action : observationActionTypes) => {
  let newState
  switch (action.type) {
    case NEW_OBSERVATION_EVENT:
      newState = {
        ...state,
        events: state.events.concat(action.payload)
      }
      return newState
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

const observationIdReducer = (state = null, action : observationActionTypes) => {
  switch (action.type) {
    case SET_OBSERVATION_ID:
      return action.payload
    case CLEAR_OBSERVATION_ID:
      return null
    default:
      return state
  }
}

const observingReducer = (state = false, action : observationActionTypes) => {
  switch (action.type) {
    case TOGGLE_OBSERVING:
      return !state
    default:
      return state
  }
}

const schemaReducer = (state = initSchemaState, action : observationActionTypes) => {
  switch (action.type) {
    case SET_SCHEMA:
      return {
        ...action.payload,
      }
    default:
      return state
  }
}

export {
  observationReducer,
  observationEventsReducer,
  observationIdReducer,
  observingReducer,
  schemaReducer
}