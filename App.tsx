import React, { useEffect } from 'react'
import { LogBox } from 'react-native'
import { Provider } from 'react-redux'
import * as TaskManager from 'expo-task-manager'
import {
  store,
  resetReducer,
} from './src/stores'
import Navigator from './src/navigation/Navigator'
import { LOCATION_BACKGROUND_TASK } from './src/config/location'
import { locationBackgroundTask } from './src/helpers/taskManagerHelper'
import { stopLocationAsync } from './src/helpers/geolocationHelper'

LogBox.ignoreLogs(['EventEmitter.removeListener'])

TaskManager.defineTask(LOCATION_BACKGROUND_TASK, async ({ data: { locations } }) => {
  locationBackgroundTask(locations)
})

const App = () => {
  useEffect(() => {
    const { observationEventInterrupted, tracking } = store.getState()
    stopLocationAsync(observationEventInterrupted, tracking) // cleans up tracking, if background task is found
    store.dispatch(resetReducer())
  }, [])

  return (
    <Provider store={store}>
      <Navigator initialRoute={'login'} />
    </Provider>
  )
}

export default App