import { updateIsAvailable } from '../../helpers/versionHelper'

describe('versionHelper', () => {
  it('returns true when a new update is available', () => {
    expect(updateIsAvailable('1.0.4', '1.0.5')).toBeTruthy()
  })

  it('returns false when the app is already updated', () => {
    expect(updateIsAvailable('1.0.5', '1.0.5')).toBeFalsy()
  })

  it('returns false when version is newer than the production version (patch)', () => {
    expect(updateIsAvailable('1.0.6', '1.0.5')).toBeFalsy()
  })

  it('returns false when version is newer than the production version (major)', () => {
    expect(updateIsAvailable('1.4.0', '1.3.22')).toBeFalsy()
  })

  it('returns false when version is newer than the production version by patch digits', () => {
    expect(updateIsAvailable('1.4.10', '1.4.8')).toBeFalsy()
  })
})