import { Polygon, Point, LineString, MultiLineString } from 'geojson'
import { FINLAND_BOUNDS } from '../config/location'
import { forms } from '../config/fields'

export const setEventGeometry = (event: Record<string, any>, lineStringPath: LineString | MultiLineString | undefined,
  firstLocation: any, grid: any) => {

  const eventHasNamedPlace = event.namedPlaceID && event.namedPlaceID !== 'empty'
  const eventHasPath = lineStringPath !== undefined
  const eventHasGrid = event.formID === forms.birdAtlas
  const eventHasUnits = event.gatherings[0].units.length >= 1
  const eventHasFirstLocation = firstLocation

  if (eventHasNamedPlace) {
    event.gatherings[0].geometry = event.gatherings[1].geometry
  } else if (eventHasPath) {
    event.gatherings[0].geometry = lineStringPath
  } else if (eventHasGrid) {
    event.gatherings[0].geometry = grid.geometry
  } else if (eventHasUnits) {
    event.gatherings[0].geometry = createUnitBoundingBox(event)
  } else if (eventHasFirstLocation) {
    event.gatherings[0].geometry = {
      coordinates: [
        firstLocation[1],
        firstLocation[0]
      ],
      type: 'Point'
    }
  }

  if (event.formID === forms.lolife) {
    if (eventHasPath) {
      if (event.gatherings[1]) {
        event.gatherings[1].geometry = lineStringPath
      } else {
        event.gatherings.push({ geometry: lineStringPath })
      }
    }
  }

  return event
}

//makes preparations for creating a combined bounding box (from path and units) which is used for determining
//center of bounding box for Google Geocoding API
export const createCombinedGeometry = (event: Record<string, any>): Polygon | Point | null => {

  //if event's geometry is a bounding box, it means that it doesn't have a path, so there's no point to make a combined BB
  if (event.gatherings[0].geometry.type === 'Polygon') {
    return event.gatherings[0].geometry
  }

  //makes an array of unit coordinates
  const points: Array<Array<number>> = event.gatherings[0].units.map((unit: Record<string, any>) => {
    return unit.unitGathering.geometry.coordinates
  })

  //calls createCombinedBoundingBox, which actually returns the BB
  let returnValue: Polygon | Point | null = createCombinedBoundingBox(points, event.gatherings[0])

  return returnValue
}

//takes list of coordinates as input and outputs max/min lng/lat of the created BB of coordinates
const calculateBoundingBoxBoundaries = (coordinates: Array<Array<number>>): Record<string, any> => {
  let maxLat: number = -90
  let minLat: number = 90
  let maxLng: number = -180
  let minLng: number = 180

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

//this is called in HomeComponent, if there was no path geometry
//creates a bounding box from unit geometries
export const createUnitBoundingBox = (event: Record<string, any>): Polygon | Point => {

  //return a point, in case there's only one observation
  if (event.gatherings[0].units.length === 1) {
    return {
      type: 'Point',
      coordinates: event.gatherings[0].units[0].unitGathering.geometry.coordinates
    }
  }

  //makes an array of unit coordinates
  const points: Array<Array<number>> = event.gatherings[0].units.map((unit: Record<string, any>) => {
    return unit.unitGathering.geometry.coordinates
  })

  //returns a bounding box based on unit coordinates
  let boundingBox: Record<string, any> = calculateBoundingBoxBoundaries(points)

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

//creates a combined bounding box (from path and units) that is required for Google Geocoding API's center point
//notice that the case where there isn't a path is already handled in createCombinedGeometry!
const createCombinedBoundingBox = (points: Array<Array<number>>, gatheringsZero: Record<string, any>): Polygon | Point | null => {

  let boundingBox: Record<string, any>
  let pathPoints: Array<Array<number>> = []

  //extract the points from path LineString or MultiLineString
  if (gatheringsZero.geometry.type === 'LineString') {
    pathPoints = gatheringsZero.geometry.coordinates
  } else if (gatheringsZero.geometry.type === 'MultiLineString') {
    gatheringsZero.geometry.coordinates.forEach((coords: Array<Array<number>>) => {
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
    let somePointsOverlapFinland: boolean = false
    geometry.coordinates.forEach((point: Array<number>) => {
      if (pointOverlapsFinland(point)) {
        somePointsOverlapFinland = true
      }
    })
    return somePointsOverlapFinland
  }
  //same for GeometryCollection of LineStrings
  if (geometry.type === 'MultiLineString') {
    let somePointsOverlapFinland: boolean = false

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

//returns the center point of a bounding box
export const centerOfBoundingBox = (geometry: Polygon | Point): Point => {

  //if the input is a point, return the input
  if (geometry.type === 'Point') {
    return geometry
  }

  //find out the max/min lng/lat of the BB
  const boundingBox = calculateBoundingBoxBoundaries(geometry.coordinates[0])

  //count the average of lng and lat to find out the center point
  let avgLng = (boundingBox.maxLng + boundingBox.minLng) / 2
  let avgLat = (boundingBox.maxLat + boundingBox.minLat) / 2

  return {
    type: 'Point',
    coordinates: [avgLng, avgLat]
  }
}

export const removeDuplicatesFromPath = (lineString: LineString | MultiLineString | undefined): LineString | MultiLineString | undefined => {

  if (!lineString) { return }

  const filterGeometry = (points: Array<Array<number>>) => {
    let uniqueCoordinates: Array<Array<number>> = []

    points.forEach(point => {
      let noDuplicates: boolean = true
      //use same decimals for all coordinates
      const coord0: number = Number(point[0].toFixed(5))
      const coord1: number = Number(point[1].toFixed(5))

      //check that the point isn't a duplicate of any of the unique coordinates
      uniqueCoordinates.forEach((uniquePoint: Array<number>) => {
        const uniqueCoord0: number = Number(uniquePoint[0].toFixed(5))
        const uniqueCoord1: number = Number(uniquePoint[1].toFixed(5))

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