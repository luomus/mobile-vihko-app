import { LocationObject } from 'expo-location'
import { Vibration } from 'react-native'
import { forms } from '../config/fields'
import { GRID_EDGE_DISTANCE } from '../config/location'
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

export const locationBackgroundTask = async (locations: Array<LocationObject>) => {
  const showAlert = (message: string) => {
    store.dispatch(setMessageState({
      type: 'err',
      messageContent: message
    }))
  }

  if (locations) {
    const { grid, observationEvent } = store.getState() as
      { grid: GridType, observationEvent: ObservationEventType, path: PathType }

    const indLast = observationEvent.events.length - 1

    const notOutsideBorders = observationEvent?.events[indLast]?.formID !== forms.birdAtlas
      || !grid || (grid && grid.outsideBorders !== 'true')

    // locationBackgroundTask adds a new path point, unless the user has left the atlas square
    if (notOutsideBorders) {
      const newPath = await store.dispatch(appendPath({ locations })).unwrap()
      store.dispatch(eventPathUpdate({ lineStringPath: pathToLineStringConstructor(newPath) })).unwrap()
    }

    if (observationEvent?.events[indLast]?.formID === forms.birdAtlas && grid && locations[0]?.coords) {
      const ykjCoords = convertWGS84ToYKJ([locations[0].coords.longitude, locations[0].coords.latitude])

      // check if user is approaching square borders or returning back
      if (!grid.pauseGridCheck && (ykjCoords[0] < grid.e * 10000 + GRID_EDGE_DISTANCE || ykjCoords[0] > grid.e * 10000 + 10000 - GRID_EDGE_DISTANCE
        || ykjCoords[1] < grid.n * 10000 + GRID_EDGE_DISTANCE || ykjCoords[1] > grid.n * 10000 + 10000 - GRID_EDGE_DISTANCE)) {
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
        || ykjCoords[1] < grid.n * 10000 || ykjCoords[1] > grid.n * 10000 + 10000)) {
        store.dispatch(setOutsideBorders('false'))
      }
    }
  }
}