export const updateIsAvailable = (appVersion: string, latestVersion: string): boolean => {
  const appVersionArray = appVersion.split('.')
  const latestVersionArray = latestVersion.split('.')

  if (parseInt(appVersionArray[0]) < parseInt(latestVersionArray[0])) return true
  else if (parseInt(appVersionArray[0]) > parseInt(latestVersionArray[0])) return false
  else if (parseInt(appVersionArray[1]) < parseInt(latestVersionArray[1])) return true
  else if (parseInt(appVersionArray[1]) > parseInt(latestVersionArray[1])) return false
  else if (parseInt(appVersionArray[2]) < parseInt(latestVersionArray[2])) return true
  else return false
}