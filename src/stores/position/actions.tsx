import { LocationObject } from 'expo-location'
import {
  PathType,
  PathPoint
} from './types'
import { gpsOutlierFilter } from '../../helpers/pathFilters'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState, setPath } from '..'

interface appendPathParams {
  locations: LocationObject[]
}

export const appendPath = createAsyncThunk<PathType, appendPathParams, { rejectValue: Record<string, any> }>(
  'path/appendPath',
  async ({ locations }, { dispatch, getState }) => {
    const { path }: { path: PathType } = getState() as RootState
    const currentPath: Array<PathPoint> = path.slice(-1)[0]

    if (locations.length > 0) {
      const points = gpsOutlierFilter(currentPath, locations)

      if (points) {
        const newPath = [...path.slice(0, -1), [...currentPath, ...points]]
        dispatch(setPath(newPath))
        return newPath
      }
    }

    return path
  }
)