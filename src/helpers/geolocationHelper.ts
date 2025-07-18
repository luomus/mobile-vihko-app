import * as Location from 'expo-location'
import { LocationObject } from 'expo-location'
import Colors from '../styles/Colors'
import proj4 from 'proj4'
import { Polygon } from 'geojson'
import {
  LOCATION_BACKGROUND_TASK,
  LOCATION_ACCURACY,
  LOCATION_MIN_T_INTERVAL,
  LOCATION_MIN_X_INTERVAL,
  PATH_ACCURACY,
  PATH_MIN_T_INTERVAL,
  PATH_MIN_X_INTERVAL
} from '../config/location'
import i18n from '../languages/i18n'
import { captureException } from './sentry'

let positionWatcher: null | { remove(): void } = null

export const convertWGS84ToYKJ = (coordinates: [number, number]) => {
  const ykjProjection = '+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=3500000 +y_0=0 +ellps=intl +towgs84=-96.0617,-82.4278,-121.7535,4.80107,0.34543,-1.37646,1.4964 +units=m +no_defs'
  return proj4(ykjProjection, coordinates)
}

export const convertYKJToWGS84 = (coordinates: [number, number]) => {
  const ykjProjection = '+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=3500000 +y_0=0 +ellps=intl +towgs84=-96.0617,-82.4278,-121.7535,4.80107,0.34543,-1.37646,1.4964 +units=m +no_defs'
  return proj4(ykjProjection, 'WGS84', coordinates)
}

export const getCurrentLocation = async (usePreviousLocation?: boolean, locationAccuracy: number = LOCATION_ACCURACY): Promise<LocationObject> => {
  let permission: Location.LocationPermissionResponse | undefined = undefined

  try {
    permission = await Location.requestForegroundPermissionsAsync()
  } catch (error: any) {
    throw new Error(i18n.t('failed to request foreground permissions'))
  }

  if (permission.status === 'granted') {
    if (usePreviousLocation) {
      let previousLocation: Location.LocationObject | null = null

      try {
        previousLocation = await Location.getLastKnownPositionAsync({
          requiredAccuracy: locationAccuracy
        })
      } catch (error: any) {
        throw new Error(i18n.t('failed to get previous location'))
      }

      if (previousLocation !== null) return previousLocation
    }

    const getCurrentLocationAttempt = (timeout: number) => {
      return new Promise<Location.LocationObject>(async (resolve, reject) => {
        const timer = setTimeout(() => { reject() }, timeout)

        try {
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: locationAccuracy
          })
          clearTimeout(timer)
          resolve(currentLocation)
        } catch (error: any) {
          clearTimeout(timer)
          reject()
        }
      })
    }

    let attempt = 1
    let location: Location.LocationObject | undefined = undefined

    while (attempt <= 8) {
      try {
        location = attempt <= 5 ? await getCurrentLocationAttempt(3000) : await getCurrentLocationAttempt(15000)
        break
      } catch (error: any) {
        attempt++
      }
    }

    if (location === undefined) {
      throw new Error(i18n.t('failed to fetch location'))
    } else {
      return location
    }

  } else {
    throw new Error(i18n.t('permission to access location denied'))
  }
}

export const watchLocationAsync = async (updateLocation: (location: LocationObject) => void, title: string, body: string, tracking: boolean) => {
  let permission: Location.LocationPermissionResponse | undefined = undefined

  try {
    permission = await Location.requestForegroundPermissionsAsync()
  } catch (error: any) {
    throw new Error(i18n.t('failed to request foreground permissions'))
  }

  if (permission?.status === 'granted') {
    try {
      await watchPositionAsync((location) => updateLocation(location))
    } catch (error: any) {
      throw new Error(error.message)
    }

    if (tracking) {
      try {
        await watchBackgroundLocationAsync(title, body)
      } catch (error: any) {
        throw new Error(error.message)
      }
    }
  } else {
    throw new Error(i18n.t('permission to access location denied'))
  }
}

export const watchPositionAsync = async (updateLocation: (location: LocationObject) => void) => {
  try {
    positionWatcher = await Location.watchPositionAsync({
      accuracy: LOCATION_ACCURACY,
      distanceInterval: LOCATION_MIN_X_INTERVAL,
      timeInterval: LOCATION_MIN_T_INTERVAL,
    }, (location) => {
      return updateLocation(location)
    })
  } catch (error: any) {
    captureException(error)
    throw new Error(i18n.t('failed to watch position'))
  }
}

export const watchBackgroundLocationAsync = async (title: string, body: string) => {
  setTimeout(async () => {
    try {
      await Location.startLocationUpdatesAsync(LOCATION_BACKGROUND_TASK, {
        accuracy: PATH_ACCURACY,
        distanceInterval: PATH_MIN_X_INTERVAL,
        timeInterval: PATH_MIN_T_INTERVAL,
        foregroundService: {
          notificationTitle: title,
          notificationBody: body,
          notificationColor: Colors.primary5
        }
      })
    } catch (error) {
      captureException(error)
      throw new Error(i18n.t('failed to start location updates'))
    }
  }, 500)
}

export const stopLocationAsync = async () => {
  if (positionWatcher) positionWatcher.remove()
  await stopBackgroundLocationAsync()
}

export const stopBackgroundLocationAsync = async () => {
  const locationRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_BACKGROUND_TASK)

  if (!locationRunning) {
    return Promise.resolve()
  }

  let lastError: any = undefined

  const stopTrackingAttempt = (timeout: number) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await new Promise<void>((timeoutResolve) => {
          setTimeout(() => {
            timeoutResolve()
          }, timeout)
        })

        await Location.stopLocationUpdatesAsync(LOCATION_BACKGROUND_TASK)
        resolve()

      } catch (error: any) {
        lastError = error
        reject()
      }
    })
  }

  let stopped = false
  let attempt = 1

  while (attempt <= 5) {
    try {
      await stopTrackingAttempt(3000)
      stopped = true
      break
    } catch (error: any) {
      attempt++
    }
  }

  if (!stopped) {
    throw new Error(lastError)
  }
}

export const YKJCoordinateIntoWGS84Grid = (northing: number, easting: number): Polygon => {
  const easting1 = easting * 10000
  const easting2 = easting * 10000 + 10000
  const northing1 = northing * 10000
  const northing2 = northing * 10000 + 10000

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
