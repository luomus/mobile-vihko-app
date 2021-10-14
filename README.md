# Nature Notebook

### Description

Nature Notebook is a mobile application for mapping observations of e.g. animal and fungi species. Observations are marked to the map in the application. The app can be used in the terrain, so that the
users can mark the observations which they find near their location. The app uses location data to track the path which the user has traveled. The user forms observation events in the application, which
consist of the observations and the traveled path during this trip. Observation events are sent to [Laji.fi](https://laji.fi/) with the application.

### Development

Install [expo-cli](https://docs.expo.dev/workflow/expo-cli/) for running the project server in development, console logging, opening the app in development.

Install [Expo (mobile app)](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) on your phone from Google Play to be able to test the app on your phone.

Install [Android Studio](https://developer.android.com/studio/install) for building binaries (APK's) and using emulators in testing.

Install dependencies: `npm install`.

Start the project server for testing with `expo start` and then choose "Tunnel" from the Expo Dev Tools that open into your browser, and finally scan the QR-code with expo mobile app or open it into an
emulator from terminal by pressing 'a'.

Build an APK by copying the project directory, then running `expo eject` for the copy, then making required script changes and finally building into APK with Android Studio.

### Documentation

The complete documentation can be found in [wiki.helsinki](https://wiki.helsinki.fi/display/luomusict/Mobile+observation+app) (requires authentication). It includes the Build Tutorial, which presents the
required script changes step-by-step and it also includes a more in-detail Development Environment Tutorial for getting started with the development.