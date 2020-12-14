import { Polygon, Point, LineString } from 'geojson'
import { FINLAND_BOUNDS } from '../config/location'

export const createGeometry = (event: Record<string, any>): Polygon | Point | null => {

  const points: Array<Point> = event.gatherings[0].units.map((unit: Record<string, any>) => {
    return unit.unitGathering.geometry
  })

  let returnValue: Polygon | Point | null = createBoundingBox(points, event.gatherings[1])

  return returnValue
}

const calculateBoundingBoxBoundaries = (coordinates: Array<Array<number>>): Record<string, any> => {
  let maxLat: number = -90
  let minLat: number = 90
  let maxLng: number = -180
  let minLng: number = 180

  const addPoint = (pointCoordinates: Array<number>): void => {
    if (maxLat < pointCoordinates[1]) {
      maxLat = pointCoordinates[1]
    }

    if (minLat > pointCoordinates[1]) {
      minLat = pointCoordinates[1]
    }

    if (maxLng < pointCoordinates[0]) {
      maxLng = pointCoordinates[0]
    }

    if (minLng > pointCoordinates[0]) {
      minLng = pointCoordinates[0]
    }
  }

  coordinates.forEach((point: Array<number>) => { addPoint(point) })

  const boundingBox: Record<string, any> = {
    maxLat: maxLat,
    minLat: minLat,
    maxLng: maxLng,
    minLng: minLng
  }

  return boundingBox
}

const createBoundingBox = (points: Array<Point>, path: LineString): Polygon | Point | null => {

  if (!path && points.length === 0) {
    return null
  }

  if (!path && points.length === 1) {
    return points[0]
  }

  let unitCoordinates: Array<Array<number>> = []

  points.forEach((point: Point) => {
    unitCoordinates = [
      ...unitCoordinates,
      point.coordinates
    ]
  })

  let boundingBox: Record<string, any>

  if (!path.geometry) {
    boundingBox = calculateBoundingBoxBoundaries(unitCoordinates)
  } else {
    const combinedCoordinates: Array<Array<number>> = [
      ...unitCoordinates,
      ...path.geometry.coordinates
    ]

    boundingBox = calculateBoundingBoxBoundaries(combinedCoordinates)
  }

  return {
    type: 'Polygon',
    coordinates: [[
      [boundingBox.maxLng, boundingBox.maxLat],
      [boundingBox.minLng, boundingBox.maxLat],
      [boundingBox.minLng, boundingBox.minLat],
      [boundingBox.maxLng, boundingBox.minLat],
      [boundingBox.maxLng, boundingBox.maxLat],
    ]]
  }
}

export const overlapsFinland = (geometry: Polygon | Point): boolean => {

  if (geometry.type === 'Point') {
    if ((geometry.coordinates[0] < FINLAND_BOUNDS[0][0] && geometry.coordinates[0] > FINLAND_BOUNDS[1][0]) &&
    (geometry.coordinates[1] < FINLAND_BOUNDS[0][1] && geometry.coordinates[1] > FINLAND_BOUNDS[1][1])) {
      return true
    }
    return false
  }

  const boundingBox = calculateBoundingBoxBoundaries(geometry.coordinates[0])

  //if one rectangle is on left side of the other
  if (boundingBox.maxLat <= FINLAND_BOUNDS[1][1] || FINLAND_BOUNDS[0][1] <= boundingBox.minLat) {
    return false
  }

  //if one rectangle is above the other
  if (boundingBox.minLng >= FINLAND_BOUNDS[0][0] || FINLAND_BOUNDS[1][0] >= boundingBox.maxLng) {
    return false
  }
  return true
}

export const centerOfBoundingBox = (geometry: Polygon | Point): Point => {

  if (geometry.type === 'Point') {
    return geometry
  }

  const boundingBox = calculateBoundingBoxBoundaries(geometry.coordinates[0])

  let avgLat = (boundingBox.maxLat + boundingBox.minLat) / 2
  let avgLng = (boundingBox.maxLng + boundingBox.minLng) / 2

  return {
    type: 'Point',
    coordinates: [avgLng, avgLat]
  }
}