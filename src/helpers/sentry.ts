import * as Sentry from '@sentry/react-native'

export const captureException = (e: any) => {
  if (!__DEV__) {
    Sentry.captureException(e)
  } else {
    console.error(e)
  }
}