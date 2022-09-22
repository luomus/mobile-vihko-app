import { GeometryCollection, FeatureCollection, Feature, Geometry, Point, LineString, MultiLineString, MultiPolygon, Position } from 'geojson'
import { LatLng } from 'react-native-maps'
import { LocationObject } from 'expo-location'
import { PathPoint, PathType } from '../stores'

const geometryCollectionConstructor = (geometries: Geometry[]) => {
  const geometryCollection: GeometryCollection = {
    type: 'GeometryCollection',
    geometries: geometries
  }

  return geometryCollection
}

const featureConstructor = (geometry: Geometry) => {
  const feature: Feature = {
    type: 'Feature',
    properties: {},
    geometry: geometry,
  }

  return feature
}

const featureCollectionConstructor = (features: Feature[]) => {
  const featureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features: features
  }

  return featureCollection
}

const pointConstructor = (lng: number, lat: number) => {
  const point: Point = {
    type: 'Point',
    coordinates: [
      lng,
      lat
    ]
  }

  return point
}

const latLngConstructor = (lng: number, lat: number) => {
  const latlng: LatLng = {
    latitude: lat,
    longitude: lng
  }

  return latlng
}

const lineStringConstructor = (coordinates: Array<Position>): LineString => {
  return {
    type: 'LineString',
    coordinates: coordinates
  }
}

const multiLineStringConstructor = (coordinates: Array<Array<Position>>): MultiLineString => {
  return {
    type: 'MultiLineString',
    coordinates: coordinates
  }
}

const pathToLineStringConstructor = (path: any[]) => {

  if (path.length <= 0) {
    return
  } else if (path.length === 1) {
    const coordinates: Array<[number, number, number]> = []
    path[0].forEach((point: PathPoint) => {
      if (!point[4]) {
        coordinates.push([
          point[0],
          point[1],
          point[3],
        ])
      }
    })

    if (coordinates.length < 2) return

    return lineStringConstructor(coordinates)
  } else {
    const coordinates: Array<Array<[number, number, number]>> = []
    path.forEach(line => {
      const subCoordinates: Array<[number, number, number]> = []

      line.forEach((point: PathPoint) => {
        if (!point[4]) {
          subCoordinates.push([
            point[0],
            point[1],
            point[3],
          ])
        }
      })

      if (subCoordinates.length >= 2) {
        coordinates.push(subCoordinates)
      }
    })

    if (coordinates.length < 1) return

    return multiLineStringConstructor(coordinates)
  }
}

const lineStringsToPathDeconstructor = (geometry: LineString | MultiLineString | undefined) => {

  if (!geometry) {
    return undefined

  } else if (geometry.type === 'LineString') {
    const path: PathType = [geometry.coordinates.map(point => [
      point[0],
      point[1],
      0.0,
      point[2] || -1,
      false
    ])]

    return path
  } else if (geometry.type === 'MultiLineString') {
    const path: PathType = geometry.coordinates.map(coord =>
      coord.map(point => [
        point[0],
        point[1],
        0.0,
        point[2] || -1,
        false
      ])
    )

    return path
  }
}

const pathPolygonConstructor = (coords: PathType, userLocation: number[] | undefined) => {
  if (coords.length <= 0) {
    return
  }

  let coordinates: Position[][][] = []

  if (coords.length > 1) {
    coordinates = coords.slice(0, -1).map(points => {
      const cleanedPoints = points.map(point => [
        point[0],
        point[1]
      ])

      return [[
        ...cleanedPoints,
        ...[...cleanedPoints].reverse()
      ]]
    })
  }

  const subCoordinates: Position[] = []
  coords.slice(-1)[0].forEach((point: PathPoint) => {
    if (!point[4]) {
      subCoordinates.push([
        point[0],
        point[1]
      ])
    }
  })

  if (userLocation) subCoordinates.push(userLocation)

  if (subCoordinates.length >= 2) {
    coordinates.push([[
      ...subCoordinates,
      ...[...subCoordinates].reverse()
    ]])
  }

  const multiPolygon: MultiPolygon = {
    type: 'MultiPolygon',
    coordinates: coordinates
  }

  return multiPolygon
}

const wrapGeometryInFC = (geometry: Geometry) => {
  const feature = featureConstructor(geometry)

  return featureCollectionConstructor([feature])
}

const latLngArrayConstructor = (points: any[]) => {
  if (points.length <= 1) {
    return null
  }

  return points.map(point => latLngConstructor(point[0], point[1]))
}

const convertGC2FC = (geometryCollection: GeometryCollection) => {
  const features = geometryCollection.geometries.map((geometry) => featureConstructor(geometry))
  const featureCollection = featureCollectionConstructor(features)

  return featureCollection
}

const convertFC2GC = (featureCollection: FeatureCollection) => {
  const geometries = featureCollection.features.map((feature) => feature.geometry)
  const geometryCollection = geometryCollectionConstructor(geometries)

  return geometryCollection
}

const convertMultiLineStringToGCWrappedLineString = (multiLineString: MultiLineString) => {
  const geometries: LineString[] = multiLineString.coordinates.map(path => lineStringConstructor(path))
  const geometryCollection = geometryCollectionConstructor(geometries)

  return geometryCollection
}

const convertLatLngToPoint = (coord: LatLng) => {
  const point = pointConstructor(coord.longitude, coord.latitude)

  return point
}

const convertPointToLatLng = (point: Point) => {
  const latlng = latLngConstructor(point.coordinates[0], point.coordinates[1])

  return latlng
}

const convertLocationDataArrToLineString = (locations: LocationObject[]) => {
  const points: any[] = []

  locations.forEach(location => points.push([location.coords.longitude, location.coords.latitude]))

  const lineString = pathToLineStringConstructor(points)

  return lineString
}

export {
  geometryCollectionConstructor,
  featureConstructor,
  featureCollectionConstructor,
  pointConstructor,
  latLngConstructor,
  lineStringsToPathDeconstructor, 
  latLngArrayConstructor,
  pathPolygonConstructor,
  wrapGeometryInFC,
  convertFC2GC,
  convertGC2FC,
  convertLatLngToPoint,
  convertPointToLatLng,
  convertLocationDataArrToLineString,
  pathToLineStringConstructor,
  convertMultiLineStringToGCWrappedLineString,
  lineStringConstructor,
  multiLineStringConstructor,
}