import { Region } from 'react-native-maps'
import { mapActionTypes,
  TOGGLE_CENTERED,
  SET_FIRST_ZOOM,
  TOGGLE_MAPTYPE,
  SET_REGION,
  CLEAR_REGION,
  SET_EDITING,
  EditingType,
  FirstZoomType
} from './types'

export const setRegion = (region: Region): mapActionTypes => ({
  type: SET_REGION,
  payload: region,
})

export const clearRegion = (): mapActionTypes => ({
  type: CLEAR_REGION
})

export const toggleCentered = (): mapActionTypes => ({
  type: TOGGLE_CENTERED
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