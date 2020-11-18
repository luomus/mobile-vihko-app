import { combineReducers } from 'redux'
import { positionReducer, pathReducer } from './position/reducers'
import {
  observationReducer,
  observingReducer,
  observationEventsReducer,
  schemaReducer,
  observationIdReducer
} from './observation/reducers'
import {
  regionReducer,
  observationZoneReducer,
  centeringReducer,
  maptypeReducer,
  editingReducer
} from './map/reducers'
import { credentialsReducer } from './user/reducers'
import { messageReducer } from './message/reducers'

const appReducer = combineReducers({
  region: regionReducer,
  position: positionReducer,
  path: pathReducer,
  observing: observingReducer,
  observation: observationReducer,
  centered: centeringReducer,
  maptype: maptypeReducer,
  observationEvent: observationEventsReducer,
  schema: schemaReducer,
  observationId: observationIdReducer,
  editing: editingReducer,
  credentials: credentialsReducer,
  message: messageReducer,
  observationZone: observationZoneReducer
})

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
