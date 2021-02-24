import React, { Component } from 'react'
import AppContainer from './src/navigator/MyNavigator'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { appendPath } from './src/stores/position/actions'
import reducer from './src/stores/combinedReducer'
import * as TaskManager from 'expo-task-manager'
import thunk from 'redux-thunk'
import './src/language/i18n'
import { LOCATION_BACKGROUND_TASK, PATH_BACKUP_INTERVALL } from './src/config/location'
import { cleanupLocationAsync } from './src/geolocation/geolocation'
import { resetReducer } from './src/stores/combinedActions'
import { eventPathUpdate } from './src/stores/observation/actions'
import { lineStringConstructor } from './src/converters/geoJSONConverters'

const store = createStore(reducer, applyMiddleware(thunk))

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
    appendPath(store, locations)

    const indLast = observationEvent.events.length - 1

    if (
      (!observationEvent.events[indLast].gatherings[0].geometry && locations[0].coords.accuracy <= 100) ||
      path.length - observationEvent?.events[indLast]?.gatherings[0]?.geometry?.coordinates?.length >= PATH_BACKUP_INTERVALL
    ) {
      eventPathUpdate(store, lineStringConstructor(path))
    }
  }
})
