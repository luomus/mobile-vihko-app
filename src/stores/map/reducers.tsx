import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Region } from 'react-native-maps'
import {
  EditingType,
  ListOrderType,
  ObservationZonesType
} from './types'
import { initObservationZones } from './actions'

const initEditingState: EditingType = {
  started: false,
  locChanged: false,
  originalLocation: { 'coordinates': [64.559, 26.840], 'type': 'Point' },
  originalSourcePage: ''
}

const initListOrderState: ListOrderType = {
  class: ''
}

const initRegionState = {
  latitude: 64.559, longitude: 26.840, latitudeDelta: 12, longitudeDelta: 12
}

const initZoneState: ObservationZonesType = {
  currentZoneId: '',
  zones: []
}

const editingSlice = createSlice({
  name: 'editing',
  initialState: initEditingState,
  reducers: {
    setEditing(state, action: PayloadAction<EditingType>) {
      return action.payload
    }
  }
})

const listOrderSlice = createSlice({
  name: 'listOrder',
  initialState: initListOrderState,
  reducers: {
    setListOrder(state, action: PayloadAction<ListOrderType>) {
      return action.payload
    }
  }
})

const observationZoneSlice = createSlice({
  name: 'observationZone',
  initialState: initZoneState,
  reducers: {
    clearCurrentObservationZone(state) {
      state.currentZoneId = ''
    },
    setObservationZones(state, action: PayloadAction<any[]>) {
      state.zones = action.payload
    },
    setCurrentObservationZone(state, action: PayloadAction<string>) {
      state.currentZoneId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initObservationZones.fulfilled, () => { })
      .addCase(initObservationZones.rejected, () => { })
  }
})

const regionSlice = createSlice({
  name: 'region',
  initialState: initRegionState,
  reducers: {
    clearRegion() {
      return initRegionState
    },
    setRegion(state, action: PayloadAction<Region>) {
      return action.payload
    }
  }
})

export const { setEditing } = editingSlice.actions
export const { setListOrder } = listOrderSlice.actions
export const { clearCurrentObservationZone, setObservationZones, setCurrentObservationZone } = observationZoneSlice.actions
export const { clearRegion, setRegion } = regionSlice.actions

export const editingReducer = editingSlice.reducer
export const listOrderReducer = listOrderSlice.reducer
export const observationZoneReducer = observationZoneSlice.reducer
export const regionReducer = regionSlice.reducer