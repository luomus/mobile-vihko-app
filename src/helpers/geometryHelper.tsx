import { Polygon, Point, LineString, MultiLineString } from 'geojson'
import haversine from 'haversine-distance'
import { FINLAND_BOUNDS } from '../config/location'
import { forms } from '../config/fields'
import { cloneDeep } from 'lodash'

export const setEventGeometry = (event: Record<string, any>, lineStringPath: LineString | MultiLineString | undefined,
  firstLocation: any, grid: any) => {
  const eventCopy = cloneDeep(event)

  const eventHasNamedPlace = eventCopy.namedPlaceID && eventCopy.namedPlaceID !== 'empty'
  const eventHasPath = lineStringPath !== undefined
  const eventHasGrid = eventCopy.formID === forms.birdAtlas
  const eventHasUnits = eventCopy.gatherings[0].units
    .filter((unit: Record<string, any>) => !unit.id.includes('complete_list')).length >= 1
  const eventHasFirstLocation = firstLocation

  if (eventHasNamedPlace) {
    eventCopy.gatherings[0].geometry = eventCopy.gatherings[1].geometry
  } else if (eventHasPath) {
    eventCopy.gatherings[0].geometry = lineStringPath
  } else if (eventHasGrid) {
    eventCopy.gatherings[0].geometry = grid.geometry
  } else if (eventHasUnits) {
    eventCopy.singleObservation
      ? eventCopy.gatherings[0].geometry = eventCopy.gatherings[0].units[0].unitGathering.geometry
      : eventCopy.gatherings[0].geometry = createUnitBoundingBox(eventCopy.gatherings[0].units)
  } else if (eventHasFirstLocation) {
    eventCopy.gatherings[0].geometry = {
      coordinates: [
        firstLocation[1],
        firstLocation[0]
      ],
      type: 'Point'
    }
    //coordinates of luomus as the last option
  } else {
    eventCopy.gatherings[0].geometry = {
      coordinates: [
        24.931409060955048,
        60.17128187292611
      ],
      type: 'Point'
    }
  }

  if (eventHasNamedPlace && eventHasPath) {
    if (eventCopy.gatherings[1]) {
      eventCopy.gatherings[1].geometry = lineStringPath
    } else {
      eventCopy.gatherings.push({ geometry: lineStringPath })
    }
  }

  return eventCopy
}

//this is called in HomeComponent, if there was no path geometry
//creates a bounding box from unit geometries
export const createUnitBoundingBox = (units: Record<string, any>[]): Polygon | Point => {

  //makes an array of unit coordinates
  const points: Array<Array<number>> = units
    .filter((unit) => unit.unitGathering?.geometry?.coordinates)
    .map((unit) => unit.unitGathering.geometry.coordinates)

  //return a point, in case there's only one observation
  if (points.length === 1) {
    return {
      type: 'Point',
      coordinates: points[0]
    }
  }

  //returns a bounding box based on unit coordinates
  const boundingBox: Record<string, any> = calculateBoundingBoxBoundaries(points)

  if (boundingBox.maxLat === boundingBox.minLat && boundingBox.maxLng === boundingBox.minLng) {
    return {
      type: 'Point',
      coordinates: points[0]
    }
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

//makes preparations for creating a combined bounding box (from path and units) which is used for determining
//center of bounding box for Google Geocoding API
export const centerOfGeometry = (geometry: any, units: Array<Record<string, any>>): Point | null => {

  //if event's geometry is a bounding box, it means that it doesn't have a path, so there's no point to make a combined BB
  if (geometry.type !== 'LineString' && geometry.type !== 'MultiLineString') {
    return centerOfBoundingBox(geometry)
  }

  //makes an array of unit coordinates
  const points: Array<Array<number>> = units.map((unit: Record<string, any>) => {
    return unit.unitGathering.geometry.coordinates
  })

  //creates a combined bounding box (from path and units) that is required for Google Geocoding API's center point
  //notice that the case where there isn't a path is already handled in createCombinedGeometry!
  let boundingBox: Record<string, any>
  let pathPoints: Array<Array<number>> = []

  //extract the points from path LineString or MultiLineString
  if (geometry.type === 'LineString') {
    pathPoints = geometry.coordinates
  } else if (geometry.type === 'MultiLineString') {
    geometry.coordinates.forEach((coords: Array<Array<number>>) => {
      pathPoints.push(...coords)
    })
  }

  //if there is no unit geometries (and there is a path, as !path scenario was handled in createCombinedGeometry)
  //create bounding box from only path geometry, else use unit and path geometries to create BB
  if (!points) {
    if (pathPoints.length === 0) {
      return null
    }

    boundingBox = calculateBoundingBoxBoundaries(pathPoints)
  } else {
    const combinedCoordinates: Array<Array<number>> = [
      ...points,
      ...pathPoints
    ]

    boundingBox = calculateBoundingBoxBoundaries(combinedCoordinates)
  }

  const combinedBoundingBox: Polygon = {
    type: 'Polygon',
    coordinates: [[
      [boundingBox.maxLng, boundingBox.maxLat],
      [boundingBox.minLng, boundingBox.maxLat],
      [boundingBox.minLng, boundingBox.minLat],
      [boundingBox.maxLng, boundingBox.minLat],
      [boundingBox.maxLng, boundingBox.maxLat],
    ]]
  }

  return centerOfBoundingBox(combinedBoundingBox)
}

//takes list of coordinates as input and outputs max/min lng/lat of the created BB of coordinates
const calculateBoundingBoxBoundaries = (coordinates: Array<Array<number>>): Record<string, any> => {
  let maxLat = -90
  let minLat = 90
  let maxLng = -180
  let minLng = 180

  //checks if a point is a new edge for BB
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

//returns the center point of a bounding box
export const centerOfBoundingBox = (geometry: Polygon | Point): Point => {

  //if the input is a point, return the input
  if (geometry.type === 'Point') {
    return geometry
  }

  //find out the max/min lng/lat of the BB
  const boundingBox = calculateBoundingBoxBoundaries(geometry.coordinates[0])

  //count the average of lng and lat to find out the center point
  const avgLng = (boundingBox.maxLng + boundingBox.minLng) / 2
  const avgLat = (boundingBox.maxLat + boundingBox.minLat) / 2

  return {
    type: 'Point',
    coordinates: [avgLng, avgLat]
  }
}

//returns true if event geometry overlaps finland, else false
export const overlapsFinland = (geometry: MultiLineString | LineString | Polygon | Point): boolean => {

  //helper function that checks whether a single point is inside finnish boundaries
  const pointOverlapsFinland = (coordinates: Array<number>) => {
    if ((coordinates[0] < FINLAND_BOUNDS[0][0] && coordinates[0] > FINLAND_BOUNDS[1][0]) &&
      (coordinates[1] < FINLAND_BOUNDS[0][1] && coordinates[1] > FINLAND_BOUNDS[1][1])) {
      return true
    }
    return false
  }

  //if the geometry is a Point, check if the point is inside finnish borders
  if (geometry.type === 'Point') {
    return pointOverlapsFinland(geometry.coordinates)
  }

  //if the geometry is a LineString, check if even one of the points is inside finnish borders, if so, return true
  if (geometry.type === 'LineString') {
    let somePointsOverlapFinland = false
    geometry.coordinates.forEach((point: Array<number>) => {
      if (pointOverlapsFinland(point)) {
        somePointsOverlapFinland = true
      }
    })
    return somePointsOverlapFinland
  }
  //same for GeometryCollection of LineStrings
  if (geometry.type === 'MultiLineString') {
    let somePointsOverlapFinland = false

    geometry.coordinates.forEach((coords: Array<Array<number>>) => {
      coords.forEach((point: Array<number>) => {
        if (pointOverlapsFinland(point)) {
          somePointsOverlapFinland = true
        }
      })
    })

    return somePointsOverlapFinland
  }

  //if the geometry is a bounding box, find out the max/min lng/lat of the BB
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

export const removeDuplicatesFromPath = (lineString: LineString | MultiLineString | undefined): LineString | MultiLineString | undefined => {

  if (!lineString) { return }

  const filterGeometry = (points: Array<Array<number>>) => {
    const uniqueCoordinates: Array<Array<number>> = []

    points.forEach(point => {
      let noDuplicates = true
      //use same decimals for all coordinates
      const coord0 = Number(point[0].toFixed(5))
      const coord1 = Number(point[1].toFixed(5))

      //check that the point isn't a duplicate of any of the unique coordinates
      uniqueCoordinates.forEach((uniquePoint: Array<number>) => {
        const uniqueCoord0 = Number(uniquePoint[0].toFixed(5))
        const uniqueCoord1 = Number(uniquePoint[1].toFixed(5))

        if (coord0 === uniqueCoord0 && coord1 === uniqueCoord1) {
          noDuplicates = false
        }
      })

      //if no duplicates were found, push the point to be a unique coordinate
      if (noDuplicates) {
        uniqueCoordinates.push(point)
      }
    })


    return uniqueCoordinates
  }

  if (lineString.type === 'LineString') {
    const uniqueCoordinates = filterGeometry(lineString.coordinates)

    if (uniqueCoordinates.length < 2) {
      return
    }

    lineString.coordinates = uniqueCoordinates

    return lineString
  } else if (lineString.type === 'MultiLineString') {
    let uniqueCoordinates: Array<Array<Array<number>>> = []

    lineString.coordinates.forEach((coord: Array<Array<number>>) => {
      const uniqueSubCoordinates = filterGeometry(coord)

      if (uniqueSubCoordinates.length >= 2) {
        uniqueCoordinates = uniqueCoordinates.concat([uniqueSubCoordinates])
      }
    })

    if (uniqueCoordinates.length <= 0) {
      return
    }

    if (uniqueCoordinates.length === 1) {
      return {
        type: 'LineString',
        coordinates: uniqueCoordinates[0]
      }
    }

    lineString.coordinates = uniqueCoordinates

    return lineString
  }
}

//returns a list of nearby observations of a chosen observation
export const listOfHaversineNeighbors = (units: Array<Record<string, any>>, region: Record<string, any>, point: any):
  Array<Record<string, any>> => {

  const filteredUnits: Record<string, any>[] = []
  units.forEach((observation: Record<string, any>) => {
    if (!observation.id.includes('complete_list') || observation.atlasCode || observation.count) {
      filteredUnits.push(observation)
    }
  })

  //define the latlng coordinates of the chosen unit
  const chosenPointLatLng = {
    latitude: point.coordinates[1],
    longitude: point.coordinates[0]
  }

  //for units, count the relative distance to the chosen point and add it to list of neighbors, if it's close enough
  const haversineNeighbors: Array<Record<string, any>> = filteredUnits.filter((unit: Record<string, any>) => {
    if (!unit.unitGathering) { return }

    //define the latlng coordinates of the compared unit
    const unitCoordinates: Array<number> = unit.unitGathering.geometry.coordinates
    const unitLatLng = {
      latitude: unitCoordinates[1],
      longitude: unitCoordinates[0]
    }

    //count the haversine distance between the point and the unit
    const haversineDistance = haversine(chosenPointLatLng, unitLatLng)

    //count the ratio of the haversine distance and longitude delta
    //(longitude delta is the distance in map, from your phones left edge to right edge, i.e. the map's zoom level)
    const haversineToLongitudeDeltaRatio = haversineDistance / region.longitudeDelta

    //add the point to neighbors, if the ratio is less than 6000
    //6000 is just an arbitrary number that i came up with after some trial and error
    return haversineToLongitudeDeltaRatio < 6000
  })

  return haversineNeighbors
}