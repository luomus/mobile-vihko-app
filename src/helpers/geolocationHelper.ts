import * as Location from 'expo-location'
import { LocationObject } from 'expo-location'
import Colors from '../styles/Colors'
import proj4 from 'proj4'
import { Polygon } from 'geojson'
import {
  LOCATION_BACKGROUND_TASK,
  LOCATION_ACCURACY,
  LOCATION_MIN_T_INTERVALL,
  LOCATION_MIN_X_INTERVALL,
  PATH_ACCURACY,
  PATH_MIN_T_INTERVALL,
  PATH_MIN_X_INTERVALL
} from '../config/location'
import { GRID_EDGE_DISTANCE } from '../config/location'

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
  let permission = await Location.requestForegroundPermissionsAsync()

  if (permission.status === 'granted') {
    return await Location.getCurrentPositionAsync({
      accuracy: LOCATION_ACCURACY
    })
  } else {
    throw new Error('Permission to access location denied.')
  }
}

export const watchLocationAsync = async (updateLocation: (location: LocationObject) => void, title: string, body: string) => {
  let permission = await Location.requestForegroundPermissionsAsync()

  if (permission.status === 'granted') {
    await watchPositionAsync((location) => updateLocation(location))
    await watchLocationAsyncAndroid(title, body)
  } else {
    throw new Error('Permission to access location denied.')
  }
}

export const watchPositionAsync = async (updateLocation: (location: LocationObject) => void) => {
  positionWatcher = await Location.watchPositionAsync({
    accuracy: LOCATION_ACCURACY,
    distanceInterval: LOCATION_MIN_X_INTERVALL,
    timeInterval: LOCATION_MIN_T_INTERVALL,
  }, (location) => {
    return updateLocation(location)
  })
}

export const watchLocationAsyncAndroid = async (title: string, body: string) => {
  setTimeout(async () => {
    await Location.startLocationUpdatesAsync(LOCATION_BACKGROUND_TASK, {
      accuracy: PATH_ACCURACY,
      distanceInterval: PATH_MIN_X_INTERVALL,
      timeInterval: PATH_MIN_T_INTERVALL,
      foregroundService: {
        notificationTitle: title,
        notificationBody: body,
        notificationColor: Colors.primary5
      }
    })
  }, 500)
}

export const stopLocationAsync = async (observationEventInterrupted: boolean) => {
  if (!observationEventInterrupted) {
    positionWatcher ? positionWatcher.remove() : null
    await Location.stopLocationUpdatesAsync(LOCATION_BACKGROUND_TASK)
  }
}

export const cleanupLocationAsync = async (observationEventInterrupted: boolean) => {
  const locationRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_BACKGROUND_TASK)
  if (locationRunning) {
    await stopLocationAsync(observationEventInterrupted)
  }
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