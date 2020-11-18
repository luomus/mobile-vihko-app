import React from 'react'
import MapView, { Marker, Region, UrlTile } from 'react-native-maps'
import { mapUrl as urlTemplate } from '../config/urls'
import { convertGC2FC, convertPointToLatLng } from '../converters/geoJSONConverters'
import Geojson from 'react-native-typescript-geojson'
import { GeometryCollection } from 'geojson'
import Cs from '../styles/ContainerStyles'
import Cl from '../styles/Colors'

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

  const zoneOverlay = () => {
    const geometry: GeometryCollection = props.event.gatherings[0].geometry

    if (geometry !== undefined) {

      return (
        <Geojson
          geojson = {convertGC2FC(geometry)}
          fillColor = '#f002'
          pinColor = '#f00'
          strokeColor = '#f00'
          strokeWidth = {4}
        />
      )
    } else {
      return null
    }
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
      {zoneOverlay()}
      {observationLocationOverlay()}
    </MapView>
  )
}

export default MiniMapComponent