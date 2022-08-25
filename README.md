# Mobiilivihko (Nature Notebook)

### Description

Mobiilivihko (eng. Nature Notebook) is a mobile application developed by LUOMUS, for making nature observations. The app allows the users to mark their observations on map. It can be used in the terrain, so that the users can mark the observations that they find nearby. The app uses location data to track the path which the user has traveled. The user forms observation events in the application, which consist of the observations and the traveled path during this trip. Observation events are sent to [Laji.fi](https://laji.fi/).

### Development

Install [expo-cli](https://docs.expo.dev/workflow/expo-cli/) for running the app in development.

Install [Expo (mobile app)](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) on your phone from Google Play to be able to test the app on your phone.

Install [Android Studio](https://developer.android.com/studio/install) for building binaries (.aab, .apk) and using emulators for testing.

Install dependencies: `npm install`.

Add a file named `.env` to the project root with the following content. Replace the placeholder values with the help of the documentation.

```
// @ts-nocheck

// types have been configured manually in src/types/env.d.ts 

// development
ACCESS_TOKEN=<DEV_ACCESS_TOKEN>
API_URL=<DEV_API_URL>
SOURCE_ID=<DEV_SOURCE_ID>

// production
// ACCESS_TOKEN=<PROD_ACCESS_TOKEN>
// API_URL=<PROD_API_URL>
// SOURCE_ID=<PROD_SOURCE_ID>

GEOCODING_API_KEY=<GEOCODING_API_KEY>
```

Start the app for development with `expo start --tunnel` and scan the QR-code from the terminal with the Expo mobile app or open it into an emulator from terminal by pressing 'a'.

For a production version, build a binary (.aab) by copying the project directory, then running `expo eject` for the copy, then making required script changes and finally building the project with Android Studio. Detailed instructions for the build and deployment process can be found in the documentation.

### Documentation

The complete documentation can be found in [wiki.helsinki](https://wiki.helsinki.fi/display/luomusict/Mobile+observation+app) (requires authentication). It includes the build tutorial, which presents the required script changes step-by-step and it also includes a more detailed development environment tutorial for getting started with the development.
