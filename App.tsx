import React, { Component } from 'react'
import AppContainer from './src/navigation/MyNavigator'
import { Provider } from 'react-redux'
import {
  store,
  appendPath,
  eventPathUpdate,
  resetReducer,
  ObservationEventType,
  PathType
} from './src/stores'
import * as TaskManager from 'expo-task-manager'
import './src/languages/i18n'
import { LOCATION_BACKGROUND_TASK, PATH_BACKUP_INTERVALL } from './src/config/location'
import { cleanupLocationAsync } from './src/helpers/geolocationHelper'
import { lineStringConstructor } from './src/helpers/geoJSONHelper'
import { LineString, MultiLineString } from 'geojson'

export default class App extends Component {
  componentDidMount() {
    const { observationEventInterrupted } = store.getState()
    cleanupLocationAsync(observationEventInterrupted)
    store.dispatch(resetReducer())
  }

  render() {
    return  (
      <Provider store={ store }>
        <AppContainer />
      </Provider>
    )
  }
}

TaskManager.defineTask(LOCATION_BACKGROUND_TASK, async ({ data: { locations }, error }) => {
  if (locations) {
    const { observationEvent, path }: {observationEvent: ObservationEventType, path: PathType} = store.getState()
    store.dispatch(appendPath(locations))

    const indLast = observationEvent.events.length - 1
    const lastGeometry: undefined | LineString | MultiLineString = observationEvent?.events[indLast]?.gatherings[0]?.geometry

    const pathSections = path.length

    const locationAccuracy = locations[0].coords.accuracy

    let coordinateLength = lastGeometry?.coordinates.length

    if (lastGeometry?.type === 'MultiLineString') {
      coordinateLength = lastGeometry.coordinates[lastGeometry.coordinates.length - 1].length
    }

    if (
      (!lastGeometry && locationAccuracy <= 100) ||
        (lastGeometry?.type === 'LineString' && pathSections > 1 && locationAccuracy <= 100) ||
        (lastGeometry?.type === 'MultiLineString' && pathSections > lastGeometry.coordinates.length && locationAccuracy <= 100) ||
        (coordinateLength && path[path.length - 1].length - coordinateLength > PATH_BACKUP_INTERVALL)
    ) {
      store.dispatch(eventPathUpdate(lineStringConstructor(path)))
    }
  }
})
