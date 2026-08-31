import React from 'react'
import { View, type ViewProps } from 'react-native'

export const animateToRegionMock = jest.fn()

type MockMapViewRef = {
  animateToRegion: typeof animateToRegionMock;
};

const MapView = React.forwardRef<MockMapViewRef, ViewProps>(function MapView(
  props,
  ref
) {
  React.useImperativeHandle(
    ref,
    () => ({
      animateToRegion: animateToRegionMock,
    }),
    []
  )

  return <View {...props} testID="mock-map-view" />
})

const Marker = (props: any) => {
  return <View {...props} />
}

const UrlTile = (props: any) => {
  return <View {...props} />
}

const Geojson = (props: any) => {
  return <View {...props} />
}

const WMSTile = (props: any) => {
  return <View {...props} />
}

export type MapType = string;
export type Region = {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
};
export type LatLng = {
  latitude: number
  longitude: number
}

export {
  MapView,
  Marker,
  UrlTile,
  Geojson,
  WMSTile,
}

export default MapView
