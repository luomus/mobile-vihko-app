import { GeometryCollection, Polygon } from 'geojson'

export const createGeometry = (event: Record<string, any>): GeometryCollection | null => {
  let returnValue: GeometryCollection = {
    type: 'GeometryCollection',
    geometries: []
  }

  if (event.gatherings[0]?.units.length === 0 && event.gatherings[1]?.geometry) {
    returnValue.geometries.push(event.gatherings[1].geometry)

  } else if (event.gatherings[0]?.units.length === 1) {
    returnValue.geometries.push(event.gatherings[0].units[0].unitGathering.geometry)

  } else if (event.gatherings[0]?.units.length >> 1) {
    returnValue.geometries.push(boundingBox(event.gatherings[0]?.units))

  } else {
    return null
  }

  return returnValue
}

const boundingBox = (units: Record<string, any>[]): Polygon => {
  let maxLat: number = -90
  let minLat: number = 90
  let maxLng: number = -180
  let minLng: number = 180

  if (units.length === 1) {
    return units[0].unitGathering.geometry
  }
  units.forEach((unit) => {
    if (maxLat < unit.unitGathering.geometry.coordinates[1]) {
      maxLat = unit.unitGathering.geometry.coordinates[1]
    }

    if (minLat > unit.unitGathering.geometry.coordinates[1]) {
      minLat = unit.unitGathering.geometry.coordinates[1]
    }

    if (maxLng < unit.unitGathering.geometry.coordinates[0]) {
      maxLng = unit.unitGathering.geometry.coordinates[0]
    }

    if (minLng > unit.unitGathering.geometry.coordinates[0]) {
      minLng = unit.unitGathering.geometry.coordinates[0]
    }
  })

  return {
    type: 'Polygon',
    coordinates: [[
      [maxLng, maxLat],
      [minLng, maxLat],
      [minLng, minLat],
      [maxLng, minLat],
      [maxLng, maxLat],
    ]]
  }
}