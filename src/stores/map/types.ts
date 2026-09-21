import { Point } from 'geojson'

export interface EditingType {
  started: boolean,
  locChanged: boolean,
  originalLocation: Point,
  originalSourcePage: string,
  formState: Record<string, any> | undefined
}

export interface ListOrderType {
  class: string
}

export interface ObservationZonesType {
  currentZoneId: string,
  zones: Record<string, any>[]
}