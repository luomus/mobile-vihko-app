import AppJSON from '../../app.json'
import { getVersionNumber } from "../services/versionService"

export const updateIsAvailable = async (): Promise<boolean> => {
    const appVersion = AppJSON.expo.version
    const latestVersion = await getVersionNumber()

    const appVersionArray = appVersion.split('.')
    const latestVersionArray = latestVersion.split('.')

    if (appVersionArray[0] < latestVersionArray[0]) return true
    else if (appVersionArray[1] < latestVersionArray[1]) return true
    else if (appVersionArray[2] < latestVersionArray[2]) return true
    else return false
}