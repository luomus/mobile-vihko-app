import React from 'react'
import { Platform } from 'react-native'
import { Icon } from 'react-native-elements'
import MapView, { Marker, Region, UrlTile, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps'
import { mapUrl as urlTemplate } from '../../config/urls'
import { convertPointToLatLng } from '../../helpers/geoJSONHelper'
import Os from '../../styles/OtherStyles'
import Colors from '../../styles/Colors'

interface Props {
  observation: Record<string, any>,
  event: Record<string, any>
}

const MiniMapComponent = (props: Props) => {

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
      >
        {
          Platform.OS === 'ios' ?
            <Icon
              type={'material-icons'}
              name={'location-pin'}
              size={45}
              color={Colors.observationColor}
              tvParallaxProperties={undefined}
            />
            : null
        }
      </Marker>
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
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      region={region}
      rotateEnabled={false}
      scrollEnabled={false}
      style={Os.miniMapViewStyle}
    >
      {tileOverlay()}
      {observationLocationOverlay()}
    </MapView>
  )
}

export default MiniMapComponent