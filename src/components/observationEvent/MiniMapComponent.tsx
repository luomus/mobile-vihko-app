import React from 'react'
import MapView, { Marker, Region, UrlTile } from 'react-native-maps'
import { mapUrl as urlTemplate } from '../../config/urls'
import { convertPointToLatLng } from '../../converters/geoJSONConverters'
import Cs from '../../styles/ContainerStyles'
import Cl from '../../styles/Colors'

interface Props {
  observation: Record<string, any>,
  event: Record<string, any>
}

const MiniMapComponent = (props: Props) => {

  const tileOverlay = () => (
    <UrlTile
      urlTemplate = {urlTemplate}
      zIndex = {-1}
    />
  )

  const observationLocationOverlay = () => {
    const coordinate = convertPointToLatLng(props.observation.unitGathering.geometry)
    return (
      <Marker
        coordinate = {coordinate}
        pinColor = {props.observation.color ? props.observation.color : Cl.obsColor}
        zIndex = {5}
      >
      </Marker>
    )
  }

  const region: Region = {
    'latitude': props.observation.unitGathering.geometry.coordinates[1],
    'latitudeDelta': 0.00300000000000000,
    'longitude': props.observation.unitGathering.geometry.coordinates[0],
    'longitudeDelta': 0.00300000000000000,
  }

  return (
    <MapView
      provider = {'google'}
      region={region}
      rotateEnabled = {false}
      scrollEnabled={false}
      style = {Cs.observationInfoMapContainer}
    >
      {tileOverlay()}
      {observationLocationOverlay()}
    </MapView>
  )
}

export default MiniMapComponent