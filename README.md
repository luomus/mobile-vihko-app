# Mobiilivihko (Nature Notebook)

### Description

Mobiilivihko (eng. Nature Notebook) is a mobile application developed by Finnish Museum of Natural History LUOMUS, for making nature observations. The app allows the users to mark their observations on map. It can be used in the field, so that the users can mark the observations that they find nearby. The app uses location data to track the path which the user has traveled. Observation events are sent to [Laji.fi](https://laji.fi/).

### Development

Install [expo-cli](https://docs.expo.dev/workflow/expo-cli/) for running the app in development.

Install [Expo (mobile app)](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) on your phone from Google Play to be able to run the app on your phone while developing.

Install [Android Studio](https://developer.android.com/studio/install) to use emulators for running the app locally.

Install dependencies: `npm ci`.

Add the following `.env` file to the project root. Ask the developers for the values and replace the placeholders with them.

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

Start the app for development with `expo start --tunnel` and scan the QR-code from the terminal with the Expo mobile app or open it into an emulator from the terminal by pressing 'a' (might require to have an emulator already running on Android Studio).

### Build process

Create an [Expo account](https://expo.dev/) and contact the developers to add you to LUOMUS' Expo organization.

Install [eas-cli](https://docs.expo.dev/distribution/introduction/) for building the app.

Add the Google Maps Geocoding API Key (ask from developers) into app.json, as a value to expo.android.config.googleMaps.apiKey but remember to not push it to Git!

To create a test build, run `eas build --platform android --profile preview` for Android, or `eas build --platform ios --profile preview` for iOS.

To create a production build, run `eas build --platform android --profile production` for Android, or `eas build --platform ios --profile production` for iOS.

To release the app to Play Store, first run `eas submit --platform android` and then log into luomusict@gmail.com account on Google, and finally go to [Google Play Console](https://play.google.com/console) to add changelog and to publish the uploaded .aab file.

To release the app to App Store, first download the .ipa file from the [Expo Dev](https://expo.dev/) page of LUOMUS into a Macbook and then use the [Apple Transporter App](https://apps.apple.com/us/app/transporter/id1450874784?mt=12) to upload the .ipa into [Apple Store Connect](https://appstoreconnect.apple.com/) (ASC). You need to log in to ASC with a University of Helsinki developer account. On ASC you can add the changelog and publish the uploaded .ipa file.

---

More documentation can be found in [wiki.helsinki](https://wiki.helsinki.fi/pages/viewpage.action?pageId=353494475) (requires access to LUOMUS wiki pages).
