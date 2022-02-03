import haversine from 'haversine-distance'

//returns a list of nearby observations of a chosen observation
export const listOfHaversineNeighbors = (units: Array<Record<string, any>>, region: Record<string, any>, point: any):
  Array<Record<string, any>> => {

  //define the latlng coordinates of the chosen unit
  const chosenPointLatLng = {
    latitude: point.coordinates[1],
    longitude: point.coordinates[0]
  }

  //for units, count the relative distance to the chosen point and add it to list of neighbors, if it's close enough
  const haversineNeighbors: Array<Record<string, any>> = units.filter((unit: Record<string, any>) => {
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