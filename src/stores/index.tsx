import {
  createStore,
  combineReducers,
  applyMiddleware,
  AnyAction
} from 'redux'
import thunk, { ThunkDispatch } from 'redux-thunk'

//actions
import {
  setRegion,
  clearRegion,
  toggleCentered,
  toggleMaptype,
  setEditing,
  setFirstZoom
} from './map/actions'
import {
  setMessageState,
  popMessageState,
  clearMessageState
} from './message/actions'
import {
  setObservationLocation,
  clearObservationLocation,
  toggleObserving,
  setObservationId,
  clearObservationId,
  setObservationEventInterrupted,
  clearObservationEvents,
  replaceObservationEvents,
  initObservationEvents,
  uploadObservationEvent,
  newObservationEvent,
  replaceObservationEventById,
  deleteObservationEvent,
  eventPathUpdate,
  newObservation,
  deleteObservation,
  replaceLocationById,
  replaceObservationById
} from './observation/actions'
import {
  updateLocation,
  clearLocation,
  appendPath,
  setPath,
  clearPath,
  setFirstLocation
} from './position/actions'
import {
  setSchema,
  initSchema,
  switchSchema
} from './schema/actions'
import {
  resetReducer,
  beginObservationEvent,
  continueObservationEvent,
  finishObservationEvent
} from './shared/actions'
import {
  loginUser,
  logoutUser,
  initLocalCredentials,
  setCredentials,
  clearCredentials
} from './user/actions'

//reducers
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
} from './observation/reducers'
import {
  firstLocationReducer,
  pathReducer,
  positionReducer
} from './position/reducers'
import { schemaReducer } from './schema/reducers'
import { credentialsReducer } from './user/reducers'

//types
import {
  mapActionTypes,
  EditingType,
  FirstZoomType
} from './map/types'
import {
  messageActionTypes,
  MessageType
} from './message/types'
import {
  observationActionTypes,
  ObservationEventType,
  ObservationIdType
} from './observation/types'
import {
  locationActionTypes,
  LocationType,
  PathType
} from './position/types'
import {
  schemaActionTypes,
  SchemaType
} from './schema/types'
import {
  userActionTypes,
  CredentialsType,
  UserType
} from './user/types'

import { Point } from 'geojson'
import { Region } from 'react-native-maps'

interface rootState {
  centered: boolean,
  credentials: CredentialsType,
  editing: EditingType,
  firstLocation: number[],
  firstZoom: FirstZoomType,
  maptype: string,
  message: MessageType[],
  observation: Point | null,
  observationEventInterrupted: boolean,
  observationEvent: ObservationEventType,
  observationId: ObservationIdType | null,
  observing: boolean,
  path: PathType,
  position: LocationType,
  region: Region,
  schema: SchemaType
}

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

const store = createStore(rootReducer, applyMiddleware(thunk))

type DispatchType = ThunkDispatch<any, void, AnyAction>
export { store }

export type { rootState }
export type { DispatchType }

//actions
export {
  setRegion,
  clearRegion,
  toggleCentered,
  toggleMaptype,
  setEditing,
  setFirstZoom,
  setMessageState,
  popMessageState,
  clearMessageState,
  setObservationLocation,
  clearObservationLocation,
  toggleObserving,
  setObservationId,
  clearObservationId,
  setObservationEventInterrupted,
  clearObservationEvents,
  replaceObservationEvents,
  initObservationEvents,
  uploadObservationEvent,
  newObservationEvent,
  replaceObservationEventById,
  deleteObservationEvent,
  eventPathUpdate,
  newObservation,
  deleteObservation,
  replaceLocationById,
  replaceObservationById,
  updateLocation,
  clearLocation,
  appendPath,
  setPath,
  clearPath,
  setFirstLocation,
  setSchema,
  initSchema,
  switchSchema,
  resetReducer,
  beginObservationEvent,
  continueObservationEvent,
  finishObservationEvent,
  loginUser,
  logoutUser,
  initLocalCredentials,
  setCredentials,
  clearCredentials
}

export type {
  mapActionTypes,
  EditingType,
  FirstZoomType,
  messageActionTypes,
  MessageType,
  observationActionTypes,
  ObservationEventType,
  locationActionTypes,
  LocationType,
  PathType,
  schemaActionTypes,
  SchemaType,
  userActionTypes,
  CredentialsType,
  UserType
}