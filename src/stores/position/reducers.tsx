import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LocationType, PathType, GridType } from './types'
import { appendPath } from '..'

const pathInitialState: PathType = [[]]

const positionInitialState: LocationType = null

const gridInitialState: GridType = null

const firstLocationSlice = createSlice({
  name: 'firstLocation',
  initialState: [60.192059, 24.945831],
  reducers: {
    setFirstLocation(state, action: PayloadAction<Array<number>>) {
      return action.payload
    }
  }
})

const pathSlice = createSlice({
  name: 'path',
  initialState: pathInitialState,
  reducers: {
    clearPath() {
      return pathInitialState
    },
    setPath(state, action: PayloadAction<PathType>) {
      return action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(appendPath.fulfilled, () => {})
  }
})

const positionSlice = createSlice({
  name: 'position',
  initialState: positionInitialState as LocationType,
  reducers: {
    clearLocation() {
      return null
    },
    updateLocation(state: LocationType, action: PayloadAction<LocationType>) {
      return action.payload
    }
  }
})

const gridSlice = createSlice({
  name: 'grid',
  initialState: gridInitialState as GridType,
  reducers: {
    clearGrid() {
      return gridInitialState
    },
    setGrid(state: GridType, action: PayloadAction<GridType>) {
      return action.payload
    },
    setGridCoords(state: GridType, action: PayloadAction<{ n: number, e: number }>) {
      if (state !== null) {
        return {
          ...state,
          n: action.payload.n,
          e: action.payload.e
        }
      }
    },
    setGridPause(state: GridType, action: PayloadAction<boolean>) {
      if (state !== null) {
        return {
          ...state,
          pauseGridCheck: action.payload
        }
      }
    },
    setOutsideBorders(state: GridType, action: PayloadAction<'false' | 'pending' | 'true'>) {
      if (state !== null) {
        return {
          ...state,
          outsideBorders: action.payload
        }
      }
    }
  }
})

const trackingSlice = createSlice({
  name: 'tracking',
  initialState: true,
  reducers: {
    setTracking(state, action: PayloadAction<boolean>) {
      return action.payload
    }
  }
})

export const { setFirstLocation } = firstLocationSlice.actions
export const { clearPath, setPath } = pathSlice.actions
export const { clearLocation, updateLocation } = positionSlice.actions
export const { clearGrid, setGrid, setGridCoords, setGridPause, setOutsideBorders } = gridSlice.actions
export const { setTracking } = trackingSlice.actions

export const firstLocationReducer = firstLocationSlice.reducer
export const pathReducer = pathSlice.reducer
export const positionReducer = positionSlice.reducer
export const gridReducer = gridSlice.reducer
export const trackingReducer = trackingSlice.reducer