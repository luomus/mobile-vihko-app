import { Region } from 'react-native-maps'
import { ThunkAction } from 'redux-thunk'
import i18n from '../../languages/i18n'
import { mapActionTypes,
  ZoneType,
  TOGGLE_CENTERED,
  SET_FIRST_ZOOM,
  SET_CURRENT_OBS_ZONE,
  CLEAR_CURRENT_OBS_ZONE,
  GET_OBS_ZONES_SUCCESS,
  TOGGLE_MAPTYPE,
  SET_REGION,
  CLEAR_REGION,
  SET_EDITING,
  EditingType,
  FirstZoomType
} from './types'
import zoneController from '../../services/zoneService'
import storageService from '../../services/storageService'
import { netStatusChecker } from '../../helpers/netStatusHelper'
import { log } from '../../helpers/logger'

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
  return async dispatch => {
    let zones: ZoneType[]
    let error: Record<string, any> | null = null

    //check connection exists and try to fetch observation zones from server
    try {
      await netStatusChecker()
      zones = await zoneController.getZones()
    } catch (netError) {
      try {
        //couldn't load zones from server. Check for local copy, if found inform user of use of local copy.
        zones = await storageService.fetch('zones')
        error = {
          severity: 'low',
          message: `${i18n.t('error loading zones from server')} ${netError.message
            ? netError.message
            : i18n.t('status code') + netError.response.status
          }`
        }
        log.error({
          location: '/stores/map/actions.tsx initObservationZones()',
          error: netError.response.data.error
        })
      //if local copy does not exist inform user that no zones are available
      } catch (localError) {
        error = {
          severity: 'fatal',
          message: `${i18n.t('error loading zones from server and internal')} ${netError.message
            ? netError.message
            : i18n.t('status code') + netError.response.status
          }`
        }
        log.error({
          location: '/stores/map/actions.tsx initObservationZones()',
          error: localError
        })
        return Promise.reject(error)
      }
    }

    //create an empty observation zone
    let empty = {
      id: 'empty',
      name: '',
      geometry: null
    }

    let firstElement: ZoneType[] = [empty]

    //sort the observation zones in alphabetical order
    zones.sort((zoneA: ZoneType, zoneB: ZoneType) => {
      let nameA = zoneA.name
      let nameB = zoneB.name

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
        error = {
          severity: 'low',
          message: i18n.t('zone save to async failed')
        }
        log.error({
          location: '/stores/map/actions.tsx initObservationZones()', 
          error: localError
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

export const toggleCentered = (): mapActionTypes => ({
  type: TOGGLE_CENTERED
})

export const toggleZoomToZone = (): mapActionTypes => ({
  type: TOGGLE_ZONE
})

export const toggleMaptype = (): mapActionTypes => ({
  type: TOGGLE_MAPTYPE
})

export const setEditing = (editing: EditingType): mapActionTypes => ({
  type: SET_EDITING,
  payload: editing
})

export const setFirstZoom = (zoomState: FirstZoomType): mapActionTypes => ({
  type: SET_FIRST_ZOOM,
  payload: zoomState
})