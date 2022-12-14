import * as Sentry from 'sentry-expo'
import { SENTRY_DSN } from 'react-native-dotenv'

Sentry.init({
  dsn: SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
})

export const captureException = e => {
  if (__DEV__) {
    console.error(e)
  } else {
    Sentry.Native.captureException(e)
  }
}