import 'dotenv/config'

module.exports = ({ config }) => {

  const sentry = {
    'file': 'sentry-expo/upload-sourcemaps',
    'config': {
      'organization': 'luomus',
      'project': 'mobiilivihko'
    }
  }
  config.hooks.postPublish.push(sentry)

  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...config.android.config,
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        },
      },
    },
    ios: {
      ...config.ios,
      config: {
        ...config.ios.config,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS
      }
    }
  }
}
