import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import {
  store,
  appendPath,
  eventPathUpdate,
  resetReducer,
  ObservationEventType,
  PathType,
  setGridPause,
  setMessageState
} from './src/stores'
import * as TaskManager from 'expo-task-manager'
import { LogBox, Vibration } from 'react-native'
import i18n from './src/languages/i18n'
import { GRID_EDGE_DISTANCE, LOCATION_BACKGROUND_TASK, PATH_BACKUP_INTERVALL } from './src/config/location'
import { cleanupLocationAsync, convertWGS84ToYKJ } from './src/helpers/geolocationHelper'
import { pathToLineStringConstructor } from './src/helpers/geoJSONHelper'
import { LineString, MultiLineString } from 'geojson'
import Navigator from './src/navigation/Navigator'
import { GridType } from './src/stores/position/types'
import { forms } from './src/config/fields'
import * as Sentry from 'sentry-expo';
import { SENTRY_DSN } from 'react-native-dotenv'

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

Sentry.init({
  dsn: SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

TaskManager.defineTask(LOCATION_BACKGROUND_TASK, async ({ data: { locations } }) => {
  const showAlert = (message: string) => {
    store.dispatch(setMessageState({
      type: 'err',
      messageContent: message
    }))
  }

  if (locations) {
    const { observationEvent, path, grid }: {observationEvent: ObservationEventType, path: PathType, grid: GridType} = store.getState()
    store.dispatch(appendPath(locations))

    const indLast = observationEvent.events.length - 1
    const lastGeometry: undefined | LineString | MultiLineString = observationEvent?.events[indLast]?.gatherings[0]?.geometry

    const pathSections = path.length

    const locationAccuracy = locations[0].coords.accuracy

    let coordinateLength = lastGeometry?.coordinates.length

    if (lastGeometry?.type === 'MultiLineString') {
      coordinateLength = lastGeometry.coordinates[lastGeometry.coordinates.length - 1].length
    }

    if (
      (!lastGeometry && locationAccuracy <= 50) ||
        (lastGeometry?.type === 'LineString' && pathSections > 1 && locationAccuracy <= 50) ||
        (lastGeometry?.type === 'MultiLineString' && pathSections > lastGeometry.coordinates.length && locationAccuracy <= 50) ||
        (coordinateLength && path[path.length - 1].length - coordinateLength > PATH_BACKUP_INTERVALL)
    ) {
      store.dispatch(eventPathUpdate(pathToLineStringConstructor(path)))
    }

    if (observationEvent?.events[indLast]?.formID === forms.birdAtlas && grid && locations[0]?.coords) {
      const ykjCoords = convertWGS84ToYKJ([locations[0].coords.longitude, locations[0].coords.latitude])

      if (!grid.pauseGridCheck && (ykjCoords[0] < grid.e * 10000 + GRID_EDGE_DISTANCE || ykjCoords[0] > grid.e * 10000 + 10000 - GRID_EDGE_DISTANCE
        || ykjCoords[1] < grid.n * 10000 + GRID_EDGE_DISTANCE || ykjCoords[1] > grid.n * 10000 + 10000 - GRID_EDGE_DISTANCE)) {
        store.dispatch(setGridPause(true))
        Vibration.vibrate([500, 1000, 500, 1000, 500])
        showAlert(i18n.t('leaving grid'))

      } else if (grid.pauseGridCheck && !(ykjCoords[0] < grid.e * 10000 + GRID_EDGE_DISTANCE || ykjCoords[0] > grid.e * 10000 + 10000 - GRID_EDGE_DISTANCE
        || ykjCoords[1] < grid.n * 10000 + GRID_EDGE_DISTANCE || ykjCoords[1] > grid.n * 10000 + 10000 - GRID_EDGE_DISTANCE)) {
        store.dispatch(setGridPause(false))
      }
    }
  }
})

const App = () => {
  useEffect(() => {
    const { observationEventInterrupted, tracking } = store.getState()
    cleanupLocationAsync(observationEventInterrupted, tracking)
    store.dispatch(resetReducer())
  }, [])

  return (
    <Provider store={ store }>
      <Navigator />
    </Provider>
  )
}

export default App