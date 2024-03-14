cd ..
eas secret:push --scope project --env-file prod.env --force
eas build --platform ios --profile production