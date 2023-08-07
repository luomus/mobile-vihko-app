import React, { useState } from 'react'
import MapView, { Marker, Region, UrlTile, PROVIDER_GOOGLE } from 'react-native-maps'
import { mapUrl as urlTemplate } from '../../config/urls'
import { convertPointToLatLng } from '../../helpers/geoJSONHelper'
import Os from '../../styles/OtherStyles'
import Colors from '../../styles/Colors'

interface Props {
  observation: Record<string, any>,
  event: Record<string, any>
}

const MiniMapComponent = (props: Props) => {

  const [visibleRegion, setVisibleRegion] = useState<Region>() // for the iPhone 8 bug

  const tileOverlay = () => (
    <UrlTile
      urlTemplate={urlTemplate}
      zIndex={-1}
    />
  )

  const observationLocationOverlay = () => {
    const coordinate = convertPointToLatLng(props.observation.unitGathering.geometry)
    return (
      <Marker
        coordinate={coordinate}
        pinColor={props.observation.color ? props.observation.color : Colors.observationColor}
        zIndex={5}
      />
    )
  }

  const region: Region = {
    latitude: props.observation.unitGathering.geometry.coordinates[1],
    latitudeDelta: 0.00300000000000000,
    longitude: props.observation.unitGathering.geometry.coordinates[0],
    longitudeDelta: 0.00300000000000000,
  }

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      region={region}
      rotateEnabled={false}
      scrollEnabled={false}
      style={Os.miniMapViewStyle}
      onRegionChangeComplete={(region) => {
        setVisibleRegion(region) // for the iPhone 8 bug
      }}
    >
      {tileOverlay()}
      {observationLocationOverlay()}
    </MapView>
  )
}

export default MiniMapComponent