import { LocationObject } from 'expo-location'
import { PathPoint } from '../stores'
import * as math from 'mathjs'
import haversine from 'haversine-distance'
import { MAX_VEL } from '../config/location'

export const gpsOutlierFilter = (path: PathPoint[], locations: LocationObject[]) => {

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
      pathWindow = pathLength < 10 - pointsLength ? [...path, ...points] : [...path.slice(-10 + pointsLength), ...points]
      lastPoint = pathWindow[pathWindow.length - 1]
    } else {
      pathWindow = pathLength < 10 - pointsLength ? [...path, ...points] : [...path.slice(-10 + pointsLength), ...points]
      lastPoint = pathWindow[pathWindow.length - 1]
    }

    const mean = math.mean(pathWindow.map(point => point[2]))
    const deviation = math.std(pathWindow.map(point => point[2]))
    const velocity = haversine(coords, [lastPoint[0], lastPoint[1]]) / (location.timestamp - lastPoint[3]) * 1000
    const zScore = (velocity - mean) / deviation

    if (zScore < 3) {
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