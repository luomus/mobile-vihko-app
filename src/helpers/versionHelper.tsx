export const updateIsAvailable = async (appVersion: string, latestVersion: string): Promise<boolean> => {
  const appVersionArray = appVersion.split('.')
  const latestVersionArray = latestVersion.split('.')

  if (appVersionArray[0] < latestVersionArray[0]) return true
  else if (appVersionArray[1] < latestVersionArray[1]) return true
  else if (appVersionArray[2] < latestVersionArray[2]) return true
  else return false
}