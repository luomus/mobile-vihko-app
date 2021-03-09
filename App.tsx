import React, { Component } from 'react'
import AppContainer from './src/navigation/MyNavigator'
import { Provider } from 'react-redux'
import {
  store,
  appendPath,
  eventPathUpdate,
  resetReducer
} from './src/stores'
import * as TaskManager from 'expo-task-manager'
import './src/languages/i18n'
import { LOCATION_BACKGROUND_TASK, PATH_BACKUP_INTERVALL } from './src/config/location'
import { cleanupLocationAsync } from './src/helpers/geolocationHelper'
import { lineStringConstructor } from './src/helpers/geoJSONHelper'

export default class App extends Component {
  componentDidMount() {
    cleanupLocationAsync()
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
    const { observationEvent, path } = store.getState()
    appendPath(locations)

    const indLast = observationEvent.events.length - 1

    if (
      (!observationEvent.events[indLast].gatherings[0].geometry && locations[0].coords.accuracy <= 100) ||
      path.length - observationEvent?.events[indLast]?.gatherings[0]?.geometry?.coordinates?.length >= PATH_BACKUP_INTERVALL
    ) {
      eventPathUpdate(lineStringConstructor(path))
    }
  }
})
