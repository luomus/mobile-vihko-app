import * as Sentry from 'sentry-expo'
import { SENTRY_DSN } from 'react-native-dotenv'

Sentry.init({
  dsn: SENTRY_DSN,
  debug: false
})

export const captureException = (e: any) => {
  if (!__DEV__) {
    Sentry.Native.captureException(e)
  } else {
    console.error(e)
  }
}