import * as Location from 'expo-location'
import { LocationObject } from 'expo-location'
import Colors from '../styles/Colors'
import {
  LOCATION_BACKGROUND_TASK,
  LOCATION_ACCURACY,
  LOCATION_MIN_T_INTERVALL,
  LOCATION_MIN_X_INTERVALL,
  PATH_ACCURACY,
  PATH_MIN_T_INTERVALL,
  PATH_MIN_X_INTERVALL
} from '../config/location'

let positionWatcher: null | {remove(): void} = null

const watchLocationAsync = async (updateLocation: (location: LocationObject) => void) => {
  let permission = await Location.requestPermissionsAsync()

  if (permission.status === 'granted') {
    await watchPositionAsync((location) => updateLocation(location))
    await watchLocationAsyncAndroid()
  } else {
    throw new Error('Permission to access location denied.')
  }
}

const watchPositionAsync = async (updateLocation: (location: LocationObject) => void) => {
  positionWatcher = await Location.watchPositionAsync({
    accuracy: LOCATION_ACCURACY,
    distanceInterval: LOCATION_MIN_X_INTERVALL,
    timeInterval: LOCATION_MIN_T_INTERVALL,
  }, (location) => {
    return updateLocation(location)
  })
}

const watchLocationAsyncAndroid = async () => {
  await Location.startLocationUpdatesAsync(LOCATION_BACKGROUND_TASK, {
    accuracy: PATH_ACCURACY,
    distanceInterval: PATH_MIN_X_INTERVALL,
    timeInterval: PATH_MIN_T_INTERVALL,
    foregroundService: {
      notificationTitle: 'Location',
      notificationBody: 'Your path is being tracked.',
      notificationColor: Colors.headerBackground
    }
  })
}

const stopLocationAsync = async () => {
  positionWatcher?.remove()
  await Location.stopLocationUpdatesAsync(LOCATION_BACKGROUND_TASK)
}

const cleanupLocationAsync = async () => {
  const locationRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_BACKGROUND_TASK)
  if (locationRunning) {
    await stopLocationAsync()
  }
}

export { watchLocationAsync, stopLocationAsync, cleanupLocationAsync }