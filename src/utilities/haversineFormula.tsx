import haversine from 'haversine-distance'

//returns a list of nearby observations of a chosen observation
<<<<<<< HEAD
export const listOfHaversineNeighbors = (units: Array<Record<string, any>>, region: Record<string, any>, point: any):
  Array<Record<string, any>> => {

  //define the latlng coordinates of the chosen unit
  const chosenPointLatLng = {
    latitude: point.coordinates[1],
    longitude: point.coordinates[0]
  }

  //for units, count the relative distance to the chosen point and add it to list of neighbors, if it's close enough
  const haversineNeighbors: Array<Record<string, any>> = units.filter((unit: Record<string, any>) => {
    //define the latlng coordinates of the compared unit
    const unitCoordinates: Array<number> = unit.unitGathering.geometry.coordinates
    const unitLatLng = {
      latitude: unitCoordinates[1],
      longitude: unitCoordinates[0]
    }

    //count the haversine distance between the point and the unit
    const haversineDistance = haversine(chosenPointLatLng, unitLatLng)
=======
export const listOfHaversineNeighbors = (units: Array<Record<string, any>>, region: Record<string, any>, unitId: string):
  Array<Record<string, any>> => {

  //find the chosen unit
  const chosenUnit: Record<string, any> | undefined = units.find((unit: Record<string, any>) => {
    return unit.id === unitId
  })

  //define the latlng coordinates of the chosen unit
  const chosenUnitCoordinates: Array<number> = chosenUnit?.unitGathering.geometry.coordinates
  const chosenUnitLatLng = {
    latitude: chosenUnitCoordinates[1],
    longitude: chosenUnitCoordinates[0]
  }

  //get the list of other units
  const otherUnits: Array<Record<string, any>> = units.filter((unit: Record<string, any>) => {
    return unit.id !== unitId
  })

  //for other units, count the relative distance to the chosen unit and add it to list of neighbors, if it's close enough
  const haversineNeighbors: Array<Record<string, any>> = otherUnits.filter((unit: Record<string, any>) => {
    //define the latlng coordinates of the compared unit
    const otherUnitCoordinates: Array<number> = unit.unitGathering.geometry.coordinates
    const otherUnitLatLng = {
      latitude: otherUnitCoordinates[1],
      longitude: otherUnitCoordinates[0]
    }

    //count the haversine distance between the chosen unit and the other unit
    const haversineDistance = haversine(chosenUnitLatLng, otherUnitLatLng)
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17

    //count the ratio of the haversine distance and longitude delta
    //(longitude delta is the distance in map, from your phones left edge to right edge, i.e. the map's zoom level)
    const haversineToLongitudeDeltaRatio = haversineDistance / region.longitudeDelta

    //add the point to neighbors, if the ratio is less than 6000
    //6000 is just an arbitrary number that i came up with after some trial and error
    return haversineToLongitudeDeltaRatio < 6000
  })

<<<<<<< HEAD
=======
  //also, include the unit itself to the list, so it will be rendered too
  if (chosenUnit) {
    haversineNeighbors.push(chosenUnit)
  }

>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
  return haversineNeighbors
}