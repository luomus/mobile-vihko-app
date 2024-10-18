import { createAsyncThunk } from '@reduxjs/toolkit'
import i18n from '../../languages/i18n'
import { getZones } from '../../services/zoneService'
import storageService from '../../services/storageService'
import { netStatusChecker } from '../../helpers/netStatusHelper'
import { log } from '../../helpers/logger'
import { captureException } from '../../helpers/sentry'
import { RootState, setObservationZones } from '..'

export const initObservationZones = createAsyncThunk<void, undefined, { rejectValue: Record<string, any> | unknown }>(
  'observationZone/initObservationZones',
  async(_, { dispatch, getState, rejectWithValue }) => {
    const { credentials } = getState() as RootState

    let zones: Record<string, any>[]
    let error: Record<string, any> | null = null

    try {
      await netStatusChecker()
      zones = await getZones()
    } catch (netError) {
      captureException(netError)
      try {
        zones = await storageService.fetch('zones')
        error = {
          severity: 'low',
          message: `${i18n.t('error loading zones from server')}`
        }
        log.error({
          location: '/stores/map/actions.tsx initObservationZones()',
          error: netError,
          user_id: credentials.user?.id
        })
      } catch (localError) {
        captureException(localError)
        error = {
          severity: 'high',
          message: `${i18n.t('error loading zones from server and internal')}`
        }
        log.error({
          location: '/stores/map/actions.tsx initObservationZones()',
          error: localError,
          user_id: credentials.user?.id
        })
        return rejectWithValue(localError)
      }
    }

    //create an empty observation zone
    const empty = {
      id: 'empty',
      name: '',
      geometry: null
    }

    const firstElement: Record<string, any>[] = [empty]

    //sort the observation zones in alphabetical order
    zones.sort((zoneA: Record<string, any>, zoneB: Record<string, any>) => {
      const nameA = zoneA.name
      const nameB = zoneB.name

      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    })

    zones = firstElement.concat(zones)

    if (!error) {
      try {
        await storageService.save('zones', zones)
      } catch (localError) {
        captureException(localError)
        error = {
          severity: 'low',
          message: i18n.t('zone save to async failed')
        }
        log.error({
          location: '/stores/map/actions.tsx initObservationZones()',
          error: localError,
          user_id: credentials.user?.id
        })
        return rejectWithValue(localError)
      }
    } else {
      return rejectWithValue(error)
    }

    dispatch(setObservationZones(zones))
  }
)