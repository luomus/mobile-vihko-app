import { Region } from 'react-native-maps'
import { ThunkAction } from 'redux-thunk'
import i18n from '../../languages/i18n'
import {
  mapActionTypes,
  SET_CURRENT_OBS_ZONE,
  CLEAR_CURRENT_OBS_ZONE,
  GET_OBS_ZONES_SUCCESS,
  SET_REGION,
  CLEAR_REGION,
  SET_EDITING,
  SET_LIST_ORDER,
  EditingType,
  ListOrderType,
} from './types'
import { getZones } from '../../services/zoneService'
import storageService from '../../services/storageService'
import { netStatusChecker } from '../../helpers/netStatusHelper'
import { log } from '../../helpers/logger'
import { captureException } from '../../helpers/sentry'

export const setRegion = (region: Region): mapActionTypes => ({
  type: SET_REGION,
  payload: region,
})

export const clearRegion = (): mapActionTypes => ({
  type: CLEAR_REGION
})

export const setCurrentObservationZone = ( id: string ): mapActionTypes => ({
  type: SET_CURRENT_OBS_ZONE,
  payload: id
})

export const clearCurrentObservationZone = (): mapActionTypes => ({
  type: CLEAR_CURRENT_OBS_ZONE
})

export const initObservationZones = (): ThunkAction<Promise<any>, any, void, mapActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials } = getState()

    let zones: Record<string, any>[]
    let error: Record<string, any> | null = null

    //check connection exists and try to fetch observation zones from server
    try {
      await netStatusChecker()
      zones = await getZones()
    } catch (netError) {
      captureException(netError)
      try {
        //couldn't load zones from server. Check for local copy, if found inform user of use of local copy.
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
      //if local copy does not exist inform user that no zones are available
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
        return Promise.reject(error)
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

    dispatch(getObservationZonesSuccess(zones))

    if (!error) {
      //try to save loaded zone to asyncStorage, warn user if error happens
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
        return Promise.reject(error)
      }
    } else {
      return Promise.reject(error)
    }

    return Promise.resolve()
  }
}

export const getObservationZonesSuccess = (zones: any[]): mapActionTypes => ({
  type: GET_OBS_ZONES_SUCCESS,
  payload: zones
})

export const setEditing = (editing: EditingType): mapActionTypes => ({
  type: SET_EDITING,
  payload: editing
})

export const setListOrder = (order: ListOrderType): mapActionTypes => ({
  type: SET_LIST_ORDER,
  payload: order
})