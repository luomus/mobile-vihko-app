import {
  observationActionTypes,
  SchemaType,
  SET_OBSERVATION,
  CLEAR_OBSERVATION,
  TOGGLE_OBSERVING,
  NEW_OBSERVATION_EVENT,
  SET_SCHEMA,
  REPLACE_OBSERVATION_EVENTS,
  CLEAR_OBSERVATION_EVENTS,
  SET_OBSERVATION_ID,
  CLEAR_OBSERVATION_ID,
  ObservationEventType,
} from './types'

const initSchemaState: SchemaType = {
  fi: null,
  en: null,
  sv: null,
  formID: ''
}

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

const observingReducer = (state = false, action : observationActionTypes) => {
  switch (action.type) {
    case TOGGLE_OBSERVING:
      return !state
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

export {
  observationReducer,
  observingReducer,
  observationEventsReducer,
  schemaReducer,
  observationIdReducer,
}