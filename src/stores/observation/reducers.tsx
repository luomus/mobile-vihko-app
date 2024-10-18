import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Point } from 'geojson'
import {
  deleteObservation,
  deleteObservationEvent,
  eventPathUpdate,
  initCompleteList,
  initObservationEvents,
  newObservation,
  replaceObservationById,
  replaceObservationEventById,
  uploadObservationEvent
} from './actions'
import { ObservationEventType } from './types'

const initObservationState: Point | null = null

const initObsEventState: ObservationEventType = {
  events: []
}

const initIdState = ''

const observationSlice = createSlice({
  name: 'observation',
  initialState: initObservationState as Point | null,
  reducers: {
    clearObservationLocation() {
      return initObservationState
    },
    setObservationLocation(state: Point | null, action: PayloadAction<Point | null>) {
      return action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(newObservation.fulfilled, () => {})
      .addCase(newObservation.rejected, () => {})
      .addCase(deleteObservation.fulfilled, () => {})
      .addCase(deleteObservation.rejected, () => {})
      .addCase(replaceObservationById.fulfilled, () => {})
      .addCase(replaceObservationById.rejected, () => {})
  },
})

const observationEventInterruptedSlice = createSlice({
  name: 'observationEventInterrupted',
  initialState: false,
  reducers: {
    setObservationEventInterrupted(state, action: PayloadAction<boolean>) {
      return action.payload
    }
  }
})

const observationEventsSlice = createSlice({
  name: 'observationEvents',
  initialState: initObsEventState,
  reducers: {
    clearObservationEvents(state) {
      state.events = []
    },
    replaceObservationEvents(state, action: PayloadAction<Record<string, any>[]>) {
      state.events = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initObservationEvents.fulfilled, () => {})
      .addCase(initObservationEvents.rejected, () => {})
      .addCase(uploadObservationEvent.fulfilled, () => {})
      .addCase(uploadObservationEvent.rejected, () => {})
      .addCase(replaceObservationEventById.fulfilled, () => {})
      .addCase(replaceObservationEventById.rejected, () => {})
      .addCase(deleteObservationEvent.fulfilled, () => {})
      .addCase(deleteObservationEvent.rejected, () => {})
      .addCase(eventPathUpdate.fulfilled, () => {})
      .addCase(eventPathUpdate.rejected, () => {})
      .addCase(initCompleteList.fulfilled, () => {})
      .addCase(initCompleteList.rejected, () => {})
  },
})

const observationIdSlice = createSlice({
  name: 'observationId',
  initialState: initIdState,
  reducers: {
    clearObservationId() {
      return initIdState
    },
    setObservationId(state, action: PayloadAction<string>) {
      return action.payload
    }
  }
})

const observationEventIdSlice = createSlice({
  name: 'observationEventId',
  initialState: initIdState,
  reducers: {
    clearObservationEventId() {
      return initIdState
    },
    setObservationEventId(state, action: PayloadAction<string>) {
      return action.payload
    }
  }
})

const observingSlice = createSlice({
  name: 'observing',
  initialState: false,
  reducers: {
    setObserving(state, action: PayloadAction<boolean>) {
      return action.payload
    }
  }
})

const singleObservationSlice = createSlice({
  name: 'singleObservation',
  initialState: false,
  reducers: {
    setSingleObservation(state, action: PayloadAction<boolean>) {
      return action.payload
    }
  }
})

export const { clearObservationLocation, setObservationLocation } = observationSlice.actions
export const { setObservationEventInterrupted } = observationEventInterruptedSlice.actions
export const { clearObservationEvents, replaceObservationEvents } = observationEventsSlice.actions
export const { clearObservationId, setObservationId } = observationIdSlice.actions
export const { clearObservationEventId, setObservationEventId } = observationEventIdSlice.actions
export const { setObserving } = observingSlice.actions
export const { setSingleObservation } = singleObservationSlice.actions

export const observationReducer = observationSlice.reducer
export const observationEventInterruptedReducer = observationEventInterruptedSlice.reducer
export const observationEventsReducer = observationEventsSlice.reducer
export const observationIdReducer = observationIdSlice.reducer
export const observationEventIdReducer = observationEventIdSlice.reducer
export const observingReducer = observingSlice.reducer
export const singleObservationReducer = singleObservationSlice.reducer