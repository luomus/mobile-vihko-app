import { updateIsAvailable } from '../../helpers/versionHelper'

describe('versionHelper', () => {
  it('returns true when a new update is available', async () => {
    await expect(updateIsAvailable('1.0.4', '1.0.5')).resolves.toBeTruthy()
  })

  it('returns false when the app is already updated', async () => {
    await expect(updateIsAvailable('1.0.5', '1.0.5')).resolves.toBeFalsy()
  })

  it('returns false when version is newer than the production version (patch)', async () => {
    await expect(updateIsAvailable('1.0.6', '1.0.5')).resolves.toBeFalsy()
  })

  it('returns false when version is newer than the production version (major)', async () => {
    await expect(updateIsAvailable('1.4.0', '1.3.22')).resolves.toBeFalsy()
  })
})