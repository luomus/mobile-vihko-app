import { combineReducers } from 'redux'
import {
  centeringReducer,
  editingReducer,
  firstZoomReducer,
  maptypeReducer,
  regionReducer
} from './map/reducers'
import { messageReducer } from './message/reducers'
import {
  observationReducer,
  observationEventInterruptedReducer,
  observationEventsReducer,
  observationIdReducer,
  observingReducer,
  schemaReducer
} from './observation/reducers'
import {
  firstLocationReducer,
  pathReducer,
  positionReducer
} from './position/reducers'
import { credentialsReducer } from './user/reducers'

const appReducer = combineReducers({
  centered: centeringReducer,
  credentials: credentialsReducer,
  editing: editingReducer,
  firstLocation: firstLocationReducer,
  firstZoom: firstZoomReducer,
  maptype: maptypeReducer,
  message: messageReducer,
  observation: observationReducer,
  observationEventInterrupted: observationEventInterruptedReducer,
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
