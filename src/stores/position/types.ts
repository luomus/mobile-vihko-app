import { LocationObject } from 'expo-location'
import { Polygon } from 'geojson'

export type PathPoint = [
  number,
  number,
  number,
  number,
  boolean
]

export type GridType = {
  n: number,
  e: number,
  geometry: Polygon | undefined,
  name: string,
  pauseGridCheck: boolean,
  outsideBorders: 'false' | 'pending' | 'true'
} | null

export type LocationType = LocationObject | null
export type PathType = Array<Array<PathPoint>>