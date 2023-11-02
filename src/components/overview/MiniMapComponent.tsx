import React from 'react'
import MapView, { Marker, Region, UrlTile, PROVIDER_GOOGLE } from 'react-native-maps'
import { mapUrl as urlTemplate } from '../../config/urls'
import { convertPointToLatLng } from '../../helpers/geoJSONHelper'
import Os from '../../styles/OtherStyles'
import Colors from '../../styles/Colors'
import { Point } from 'geojson'
import { View, Text } from 'react-native'

interface Props {
  geometry: Point,
  color: string
}

const MiniMapComponent = (props: Props) => {

  const tileOverlay = () => (
    <UrlTile
      urlTemplate={urlTemplate}
      zIndex={-1}
    />
  )

  const observationLocationOverlay = () => {
    const coordinate = convertPointToLatLng(props.geometry)
    return (
      <Marker
        coordinate={coordinate}
        pinColor={props.color ? props.color : Colors.observationColor}
        zIndex={5}
      />
    )
  }

  const region: Region = {
    latitude: props.geometry.coordinates[1],
    latitudeDelta: 0.00300000000000000,
    longitude: props.geometry.coordinates[0],
    longitudeDelta: 0.00300000000000000,
  }

  return (
    <View>
      <MapView
        provider={PROVIDER_GOOGLE}
        region={region}
        rotateEnabled={false}
        scrollEnabled={false}
        style={Os.miniMapViewStyle}
      >
        {tileOverlay()}
        {observationLocationOverlay()}
      </MapView>
      <Text>
        {'Sijainti - N: ' + props.geometry.coordinates[1].toFixed(2) + ' E: ' + props.geometry.coordinates[0].toFixed(2)}
      </Text>
    </View>
  )
}

export default MiniMapComponent