const Config = {
  ACCESS_TOKEN: process.env.EXPO_PUBLIC_ACCESS_TOKEN ?? '',
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? '',
  ATLAS_API_URL: process.env.EXPO_PUBLIC_ATLAS_API_URL ?? '',
  GEOCODING_API_KEY: process.env.EXPO_PUBLIC_GEOCODING_API_KEY ?? '',
  LAJI_AUTH_URL: process.env.EXPO_PUBLIC_LAJI_AUTH_URL ?? '',
  LAJI_URL: process.env.EXPO_PUBLIC_LAJI_URL ?? '',
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
  SOURCE_ID: process.env.EXPO_PUBLIC_SOURCE_ID ?? '',
}

export default Config
