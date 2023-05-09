import { LocationObject } from 'expo-location'
import { LineString, MultiLineString } from 'geojson'
import { Vibration } from 'react-native'
import { forms } from '../config/fields'
import { GRID_EDGE_DISTANCE, PATH_BACKUP_INTERVALL } from '../config/location'
import i18n from '../languages/i18n'
import {
  store,
  appendPath,
  eventPathUpdate,
  GridType,
  ObservationEventType,
  PathType,
  setGridPause,
  setMessageState,
  setOutsideBorders
} from '../stores'
import { pathToLineStringConstructor } from './geoJSONHelper'
import { convertWGS84ToYKJ } from './geolocationHelper'

export const locationBackgroundTask = (locations: Array<LocationObject>) => {
  const showAlert = (message: string) => {
    store.dispatch(setMessageState({
      type: 'err',
      messageContent: message
    }))
  }

  if (locations) {
    const { grid, observationEvent, path } = store.getState() as
      { grid: GridType, observationEvent: ObservationEventType, path: PathType }

    const indLast = observationEvent.events.length - 1
    const lastGeometry: undefined | LineString | MultiLineString = observationEvent?.events[indLast]?.gatherings[0]?.geometry

    const pathSections = path.length

    let locationAccuracy = locations[0].coords.accuracy
    if (locationAccuracy === null) locationAccuracy = 3000

    let coordinateLength = lastGeometry?.coordinates.length

    if (lastGeometry?.type === 'MultiLineString') {
      coordinateLength = lastGeometry.coordinates[lastGeometry.coordinates.length - 1].length
    }

    const notOutsideBorders = observationEvent?.events[indLast]?.formID !== forms.birdAtlas
      || !grid || (grid && grid.outsideBorders !== 'true')

    // locationBackgroundTask adds a new path point, unless the user has left the atlas square
    if (notOutsideBorders) {
      store.dispatch(appendPath(locations))

      if
      ((!lastGeometry && locationAccuracy <= 50) ||
        (lastGeometry?.type === 'LineString' && pathSections > 1 && locationAccuracy <= 50) ||
        (lastGeometry?.type === 'MultiLineString' && pathSections > lastGeometry.coordinates.length && locationAccuracy <= 50) ||
        (coordinateLength && path[path.length - 1].length - coordinateLength > PATH_BACKUP_INTERVALL))
      {
        store.dispatch(eventPathUpdate(pathToLineStringConstructor(path)))
      }
    }

    if (observationEvent?.events[indLast]?.formID === forms.birdAtlas && grid && locations[0]?.coords) {
      const ykjCoords = convertWGS84ToYKJ([locations[0].coords.longitude, locations[0].coords.latitude])

      // check if user is approaching square borders or returning back
      if (!grid.pauseGridCheck && (ykjCoords[0] < grid.e * 10000 + GRID_EDGE_DISTANCE || ykjCoords[0] > grid.e * 10000 + 10000 - GRID_EDGE_DISTANCE
        || ykjCoords[1] < grid.n * 10000 + GRID_EDGE_DISTANCE || ykjCoords[1] > grid.n * 10000 + 10000 - GRID_EDGE_DISTANCE))
      {
        store.dispatch(setGridPause(true))
        Vibration.vibrate([500, 1000, 500, 1000, 500])
        showAlert(i18n.t('leaving grid'))

      } else if (grid.pauseGridCheck && !(ykjCoords[0] < grid.e * 10000 + GRID_EDGE_DISTANCE || ykjCoords[0] > grid.e * 10000 + 10000 - GRID_EDGE_DISTANCE
        || ykjCoords[1] < grid.n * 10000 + GRID_EDGE_DISTANCE || ykjCoords[1] > grid.n * 10000 + 10000 - GRID_EDGE_DISTANCE)
      ) {
        store.dispatch(setGridPause(false))
      }

      // check if user is outside or inside square borders
      if (grid.outsideBorders === 'false' && (ykjCoords[0] < grid.e * 10000 || ykjCoords[0] > grid.e * 10000 + 10000
        || ykjCoords[1] < grid.n * 10000 || ykjCoords[1] > grid.n * 10000 + 10000)
      ) {
        store.dispatch(setOutsideBorders('pending'))

      } else if (grid.outsideBorders !== 'false' && !(ykjCoords[0] < grid.e * 10000 || ykjCoords[0] > grid.e * 10000 + 10000
        || ykjCoords[1] < grid.n * 10000 || ykjCoords[1] > grid.n * 10000 + 10000))
      {
        store.dispatch(setOutsideBorders('false'))
      }
    }
  }
}