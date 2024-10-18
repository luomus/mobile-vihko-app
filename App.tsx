import React, { useEffect } from 'react'
import { LogBox } from 'react-native'
import { Provider } from 'react-redux'
import * as TaskManager from 'expo-task-manager'
import * as Sentry from '@sentry/react-native'
import { SENTRY_DSN } from 'react-native-dotenv'
import {
  store,
  resetReducer,
} from './src/stores'
import Navigator from './src/navigation/Navigator'
import { LOCATION_BACKGROUND_TASK } from './src/config/location'
import { locationBackgroundTask } from './src/helpers/taskManagerHelper'

Sentry.init({
  dsn: SENTRY_DSN,
  debug: false
})

LogBox.ignoreLogs(['EventEmitter.removeListener'])

TaskManager.defineTask(LOCATION_BACKGROUND_TASK, async ({ data: { locations } }) => {
  await locationBackgroundTask(locations)
})

const App = () => {
  useEffect(() => {
    store.dispatch(resetReducer())
  }, [])

  return (
    <Provider store={store}>
      <Navigator initialRoute={'login'} />
    </Provider>
  )
}

export default Sentry.wrap(App)