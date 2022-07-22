import { LocationObject } from 'expo-location'
import proj4 from 'proj4'
import { Polygon } from 'geojson'
import { GRID_EDGE_DISTANCE } from '../../config/location'

let positionWatcher: null | { remove(): void } = null

export const convertWGS84ToYKJ = (coordinates: [number, number]) => {
  const ykjProjection = '+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=3500000 +y_0=0 +ellps=intl +towgs84=-96.0617,-82.4278,-121.7535,4.80107,0.34543,-1.37646,1.4964 +units=m +no_defs'
  return proj4(ykjProjection, coordinates)
}

export const convertYKJToWGS84 = (coordinates: [number, number]) => {
  const ykjProjection = '+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=3500000 +y_0=0 +ellps=intl +towgs84=-96.0617,-82.4278,-121.7535,4.80107,0.34543,-1.37646,1.4964 +units=m +no_defs'
  return proj4(ykjProjection, 'WGS84', coordinates)
}

export const getCurrentLocation = async () => {
  return {
    'coords': {
      'accuracy': 14.213000297546387,
      'altitude': 41.60000228881836,
      'altitudeAccuracy': 1.3554112911224365,
      'heading': 346.2547912597656,
      'latitude': 60.1715396,
      'longitude': 24.9301734,
      'speed': 0.9732660055160522,
    },
    'mocked': true,
    'timestamp': 1658131616523,
  }
}

export const watchLocationAsync = async (updateLocation: (location: LocationObject) => void, title: string, body: string, tracking: boolean) => {
  await watchPositionAsync(updateLocation)
  Promise.resolve()
}

export const watchPositionAsync = async (updateLocation: (location: LocationObject) => void) => {
  const location = await getCurrentLocation()
  updateLocation(location)
  Promise.resolve()
}

export const watchBackgroundLocationAsync = async (title: string, body: string) => {
  Promise.resolve()
}

export const stopLocationAsync = async (observationEventInterrupted: boolean, tracking: boolean) => {
  Promise.resolve()
}

export const stopBackgroundLocationAsync = async () => {
  Promise.resolve()
}

export const cleanupLocationAsync = async (observationEventInterrupted: boolean, tracking: boolean) => {
    Promise.resolve()
}

export const YKJCoordinateIntoWGS84Grid = (northing: number, easting: number): Polygon => {
  const easting1 = easting * 10000 + GRID_EDGE_DISTANCE
  const easting2 = easting * 10000 + 10000 - GRID_EDGE_DISTANCE
  const northing1 = northing * 10000 + GRID_EDGE_DISTANCE
  const northing2 = northing * 10000 + 10000 - GRID_EDGE_DISTANCE

  const northWestCorner = convertYKJToWGS84([easting1, northing2])
  const northEastCorner = convertYKJToWGS84([easting2, northing2])
  const southEastCorner = convertYKJToWGS84([easting2, northing1])
  const southWestCorner = convertYKJToWGS84([easting1, northing1])

  return {
    type: 'Polygon',
    coordinates: [[
      northWestCorner,
      northEastCorner,
      southEastCorner,
      southWestCorner,
      northWestCorner
    ]]
  }
}