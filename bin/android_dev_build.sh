cd ..
eas secret:push --scope project --env-file .env --force
eas build --platform android --profile preview