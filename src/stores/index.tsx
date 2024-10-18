import { UnknownAction } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { ThunkDispatch } from 'redux-thunk'

import {
  initObservationZones
} from './map/actions'
import {
  initObservationEvents,
  uploadObservationEvent,
  replaceObservationEventById,
  deleteObservationEvent,
  eventPathUpdate,
  newObservation,
  deleteObservation,
  replaceObservationById,
  initCompleteList
} from './observation/actions'
import {
  appendPath
} from './position/actions'
import {
  initSchema,
  switchSchema
} from './schema/actions'
import {
  resetReducer,
  beginObservationEvent,
  continueObservationEvent,
  finishObservationEvent,
  beginSingleObservation,
  finishSingleObservation
} from './shared/actions'
import {
  loginUser,
  initLocalCredentials,
  getPermissions,
  getMetadata,
  logoutUser
} from './user/actions'

import { schemaReducer, setSchema } from './schema/reducers'
import {
  editingReducer,
  listOrderReducer,
  observationZoneReducer,
  regionReducer,
  setEditing,
  setListOrder,
  clearCurrentObservationZone,
  setObservationZones,
  setCurrentObservationZone,
  clearRegion,
  setRegion
} from './map/reducers'
import messageReducer, {
  clearMessageState,
  popMessageState,
  setMessageState
} from './message/reducers'
import {
  observationReducer,
  observationEventInterruptedReducer,
  observationEventsReducer,
  observationIdReducer,
  observationEventIdReducer,
  observingReducer,
  singleObservationReducer,
  setObservationLocation,
  clearObservationLocation,
  setObserving,
  setObservationId,
  clearObservationId,
  setObservationEventInterrupted,
  clearObservationEventId,
  clearObservationEvents,
  replaceObservationEvents,
  setSingleObservation,
  setObservationEventId
} from './observation/reducers'
import {
  firstLocationReducer,
  pathReducer,
  positionReducer,
  gridReducer,
  trackingReducer,
  updateLocation,
  clearLocation,
  setPath,
  clearPath,
  setFirstLocation,
  setGrid,
  clearGrid,
  setGridCoords,
  setGridPause,
  setOutsideBorders,
  setTracking,
} from './position/reducers'
import credentialsReducer, {
  clearCredentials,
  setCredentials
} from './user/reducers'

//types
import {
  EditingType,
  ListOrderType,
  ObservationZonesType
} from './map/types'
import {
  MessageType
} from './message/types'
import {
  ObservationEventType
} from './observation/types'
import {
  LocationType,
  PathType,
  PathPoint,
  GridType
} from './position/types'
import {
  SchemaType
} from './schema/types'
import {
  CredentialsType,
  UserType
} from './user/types'

export const store = configureStore({
  reducer: {
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
    singleObservation: singleObservationReducer,
    tracking: trackingReducer
  },
  // middleware: getDefaultMiddleware => getDefaultMiddleware({
  //   serializableCheck: false
  // })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

type DispatchType = ThunkDispatch<any, void, UnknownAction>
export type { DispatchType }

//actions
export {
  setRegion,
  clearRegion,
  setEditing,
  setListOrder,
  clearCurrentObservationZone,
  setCurrentObservationZone,
  setObservationZones,
  initObservationZones,
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
  setSingleObservation,
  initObservationEvents,
  uploadObservationEvent,
  replaceObservationEventById,
  deleteObservationEvent,
  eventPathUpdate,
  newObservation,
  deleteObservation,
  replaceObservationById,
  initCompleteList,
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
  initSchema,
  switchSchema,
  resetReducer,
  beginObservationEvent,
  continueObservationEvent,
  finishObservationEvent,
  beginSingleObservation,
  finishSingleObservation,
  loginUser,
  initLocalCredentials,
  getPermissions,
  getMetadata,
  logoutUser,
  setCredentials,
  clearCredentials
}

export type {
  EditingType,
  ListOrderType,
  ObservationZonesType,
  MessageType,
  ObservationEventType,
  LocationType,
  PathType,
  PathPoint,
  GridType,
  SchemaType,
  CredentialsType,
  UserType
}