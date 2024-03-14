cd ..
eas secret:push --scope project --env-file .env --force
eas build --platform ios --profile preview