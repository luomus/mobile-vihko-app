import * as Location from 'expo-location'
import { LocationObject } from 'expo-location'
import { useTranslation } from 'react-i18next'
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

let positionWatcher: null | { remove(): void } = null

const watchLocationAsync = async (updateLocation: (location: LocationObject) => void, title: string, body: string) => {
  let permission = await Location.requestPermissionsAsync()

  if (permission.status === 'granted') {
    await watchPositionAsync((location) => updateLocation(location))
    await watchLocationAsyncAndroid(title, body)
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

const watchLocationAsyncAndroid = async (title: string, body: string) => {
  //const { t } = useTranslation()

  // notificationTitle: t('notification title'),
  // notificationBody: t('notification body'),

  setTimeout(async () => {
    await Location.startLocationUpdatesAsync(LOCATION_BACKGROUND_TASK, {
      accuracy: PATH_ACCURACY,
      distanceInterval: PATH_MIN_X_INTERVALL,
      timeInterval: PATH_MIN_T_INTERVALL,
      foregroundService: {
        notificationTitle: title,
        notificationBody: body,
        notificationColor: Colors.headerBackground
      }
    })
  }
  , 5000)
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