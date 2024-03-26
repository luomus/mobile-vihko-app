import { LocationObject } from 'expo-location'
import { PathPoint } from '../stores'
import * as math from 'mathjs'
import haversine from 'haversine-distance'
import { MAX_VEL, MIN_DIST, PATH_WINDOW_SIZE, Z_SCORE } from '../config/location'
import { LineString, MultiLineString } from 'geojson'
import moment from 'moment'
import { lineStringConstructor } from './geoJSONHelper'

const temporalOutlierFilter = (path: LineString | MultiLineString, dateEnd: string) => {
  if (path.type === 'LineString') {
    const newCoordinates: number[][] = []
    path.coordinates.forEach(point => {
      if (point[2] === -1 || moment(point[2]).isBefore(moment(dateEnd, moment.HTML5_FMT.DATETIME_LOCAL).add(1, 'm'))) {
        newCoordinates.push(point.slice(0, 2))
      }
    })
    if (newCoordinates.length > 1) {
      path.coordinates = newCoordinates
      return path
    }
  } else if (path.type === 'MultiLineString') {
    const newCoordinates: number[][][] = []
    path.coordinates.forEach(coords => {
      const newCoords: number[][] = []
      coords.forEach(point => {
        if (point[2] === -1 || moment(point[2]).isBefore(moment(dateEnd, moment.HTML5_FMT.DATETIME_LOCAL))) {
          newCoords.push(point.slice(0, 2))
        }
      })

      if (newCoords.length > 1) {
        newCoordinates.push(newCoords)
      }
    })

    if (newCoordinates.length === 0) {
      return
    } else if (newCoordinates.length === 1) {
      path = lineStringConstructor(newCoordinates[0])
    } else {
      path.coordinates = newCoordinates
    }

    return path
  } else {
    return path
  }
}

const gpsOutlierFilter = (path: PathPoint[], locations: LocationObject[]) => {

  const points: PathPoint[] = []
  const pathLength: number = path.length

  locations.forEach((location, index) => {
    const pointsLength = points.length
    const coords: [number, number] = [location.coords.longitude, location.coords.latitude]

    let pathWindow: PathPoint[]
    let lastPoint: PathPoint
    let newPoint: PathPoint

    //filter out points with high inaccuracies first
    if (location.coords.accuracy && location.coords.accuracy >= 100) {
      return
    }

    //filter out point that are closer to last accepted point than minimum
    const lastShownPoint = [...path, ...points].reverse().find((point: PathPoint) => {
      return !point[4]
    })

    if (lastShownPoint && haversine([lastShownPoint[0], lastShownPoint[1]], coords) < MIN_DIST) {
      return
    }

    //set so that at least 5 points must be in path before filtering starts
    if (path.length === 0) {
      newPoint = [
        coords[0],
        coords[1],
        0.0,
        location.timestamp,
        false
      ]

      points.push(newPoint)
      return
    } else if (path.length < 5) {
      lastPoint = path[path.length - 1]

      if (lastPoint[3] === location.timestamp) {
        return
      }

      const velocity = haversine(coords, [lastPoint[0], lastPoint[1]]) / (location.timestamp - lastPoint[3]) * 1000

      newPoint = [
        coords[0],
        coords[1],
        velocity,
        location.timestamp,
        false
      ]

      points.push(newPoint)
      return
    }

    if (index !== 0) {
      pathWindow = pathLength < PATH_WINDOW_SIZE - pointsLength
        ? [...path, ...points]
        : [...path.slice(-PATH_WINDOW_SIZE + pointsLength), ...points]
      lastPoint = pathWindow[pathWindow.length - 1]
    } else {
      pathWindow = pathLength < PATH_WINDOW_SIZE - pointsLength
        ? [...path, ...points]
        : [...path.slice(-PATH_WINDOW_SIZE + pointsLength), ...points]
      lastPoint = pathWindow[pathWindow.length - 1]
    }

    const mean = math.mean(pathWindow.map(point => point[2]))
    const deviation = math.std(pathWindow.map(point => point[2]))
    const velocity = haversine(coords, [lastPoint[0], lastPoint[1]]) / (location.timestamp - lastPoint[3]) * 1000
    const zScore = (velocity - mean) / deviation

    if (zScore < Z_SCORE) {
      newPoint = [
        coords[0],
        coords[1],
        velocity,
        location.timestamp,
        false
      ]
    } else if (velocity < MAX_VEL) {
      newPoint = [
        coords[0],
        coords[1],
        velocity,
        location.timestamp,
        true
      ]
    } else {
      newPoint = [
        coords[0],
        coords[1],
        MAX_VEL,
        location.timestamp,
        true
      ]
    }

    points.push(newPoint)
  })

  return points
}

export { temporalOutlierFilter, gpsOutlierFilter }