import { combineReducers } from 'redux'
import {
  centeringReducer,
  editingReducer,
  maptypeReducer,
  regionReducer
} from './map/reducers'
import { messageReducer } from './message/reducers'
import {
  observationReducer,
  observationEventsReducer,
  observationIdReducer,
  observingReducer,
  schemaReducer
} from './observation/reducers'
import { pathReducer, positionReducer } from './position/reducers'
import { credentialsReducer } from './user/reducers'

const appReducer = combineReducers({
  centered: centeringReducer,
  credentials: credentialsReducer,
  editing: editingReducer,
  maptype: maptypeReducer,
  message: messageReducer,
  observation: observationReducer,
  observationEvent: observationEventsReducer,
  observationId: observationIdReducer,
  observing: observingReducer,
  path: pathReducer,
  position: positionReducer,
  region: regionReducer,
  schema: schemaReducer
})

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
