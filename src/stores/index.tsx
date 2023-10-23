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
  setEditing,
  setListOrder,
  setCurrentObservationZone,
  clearCurrentObservationZone,
  initObservationZones,
  getObservationZonesSuccess
} from './map/actions'
import {
  setMessageState,
  popMessageState,
  clearMessageState
} from './message/actions'
import {
  setObservationLocation,
  clearObservationLocation,
  setObserving,
  setObservationId,
  clearObservationId,
  setObservationEventInterrupted,
  clearObservationEventId,
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
  setObservationEventId
} from './observation/actions'
import {
  updateLocation,
  clearLocation,
  appendPath,
  setPath,
  clearPath,
  setFirstLocation,
  setGrid,
  clearGrid,
  setGridCoords,
  setGridPause,
  setOutsideBorders,
  setTracking,
} from './position/actions'
import {
  setSchema,
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
  clearCredentials,
  getPermissions,
  getMetadata
} from './user/actions'

//reducers
import {
  editingReducer,
  listOrderReducer,
  observationZoneReducer,
  regionReducer
} from './map/reducers'
import { messageReducer } from './message/reducers'
import {
  observationReducer,
  observationEventInterruptedReducer,
  observationEventsReducer,
  observationIdReducer,
  observingReducer,
  observationEventIdReducer,
} from './observation/reducers'
import {
  firstLocationReducer,
  pathReducer,
  positionReducer,
  gridReducer,
  trackingReducer
} from './position/reducers'
import { schemaReducer } from './schema/reducers'
import { credentialsReducer } from './user/reducers'

//types
import {
  mapActionTypes,
  EditingType,
  ListOrderType,
  ObservationZonesType
} from './map/types'
import {
  messageActionTypes,
  MessageType
} from './message/types'
import {
  observationActionTypes,
  ObservationEventType
} from './observation/types'
import {
  locationActionTypes,
  LocationType,
  PathType,
  PathPoint,
  GridType
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
  credentials: CredentialsType,
  editing: EditingType,
  firstLocation: number[],
  grid: GridType,
  listOrder: ListOrderType,
  message: MessageType[],
  observation: Point | null,
  observationEventInterrupted: boolean,
  observationEvent: ObservationEventType,
  observationEventId: string,
  observationId: string,
  observationZone: ObservationZonesType,
  observing: boolean,
  path: PathType,
  position: LocationType,
  region: Region,
  schema: SchemaType,
  tracking: boolean
}

const appReducer = combineReducers({
  credentials: credentialsReducer,
  editing: editingReducer,
  firstLocation: firstLocationReducer,
  grid: gridReducer,
  listOrder: listOrderReducer,
  message: messageReducer,
  observation: observationReducer,
  observationEventInterrupted: observationEventInterruptedReducer,
  observationEvent: observationEventsReducer,
  observationEventId: observationEventIdReducer,
  observationId: observationIdReducer,
  observationZone: observationZoneReducer,
  observing: observingReducer,
  path: pathReducer,
  position: positionReducer,
  region: regionReducer,
  schema: schemaReducer,
  tracking: trackingReducer
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
  setEditing,
  setListOrder,
  setCurrentObservationZone,
  clearCurrentObservationZone,
  initObservationZones,
  getObservationZonesSuccess,
  setMessageState,
  popMessageState,
  clearMessageState,
  setObservationLocation,
  clearObservationLocation,
  setObserving,
  setObservationId,
  clearObservationId,
  setObservationEventId,
  clearObservationEventId,
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
  setGrid,
  clearGrid,
  setGridCoords,
  setGridPause,
  setOutsideBorders,
  setTracking,
  setSchema,
  switchSchema,
  resetReducer,
  beginObservationEvent,
  continueObservationEvent,
  finishObservationEvent,
  loginUser,
  logoutUser,
  getPermissions,
  getMetadata,
  initLocalCredentials,
  setCredentials,
  clearCredentials
}

export type {
  mapActionTypes,
  EditingType,
  ListOrderType,
  ObservationZonesType,
  messageActionTypes,
  MessageType,
  observationActionTypes,
  ObservationEventType,
  locationActionTypes,
  LocationType,
  PathType,
  PathPoint,
  GridType,
  schemaActionTypes,
  SchemaType,
  userActionTypes,
  CredentialsType,
  UserType
}