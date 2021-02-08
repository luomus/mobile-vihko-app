import React, { useState, useEffect, ReactChild } from 'react'
import MapView, { Marker, UrlTile, Region, LatLng } from 'react-native-maps'
import { connect, ConnectedProps } from 'react-redux'
import { View, TouchableHighlight } from 'react-native'
import { useTranslation } from 'react-i18next'
import { LocationObject } from 'expo-location'
import { LineString, Point } from 'geojson'
import { convertLatLngToPoint, convertPointToLatLng, lineStringConstructor, wrapGeometryInFC } from '../../converters/geoJSONConverters'
import Geojson from 'react-native-typescript-geojson'
import {
  setObservationLocation,
  replaceLocationById,
  clearObservationLocation,
  setObservationId,
  clearObservationId,
  deleteObservation
} from '../../stores/observation/actions'
import {
  setRegion,
  toggleCentered,
  setFirstZoom,
  toggleMaptype,
  setEditing,
} from '../../stores/map/actions'
import { setMessageState } from '../../stores/message/actions'
import Colors from '../../styles/Colors'
import { MaterialIcons } from '@expo/vector-icons'
import Cs from '../../styles/ContainerStyles'
import Os from '../../styles/OtherStyles'
import ObservationButtonsComponent from './ObservationButtonsComponent'
import GpsBarComponent from './GpsBarComponent'
import { EditingType } from '../../stores/map/types'
import { ObservationEventType } from '../../stores/observation/types'
import { mapUrl as urlTemplate } from '../../config/urls'
import MessageComponent from '../general/MessageComponent'
import MapModalComponent from './MapModalComponent'
import { Icon } from 'react-native-elements'

interface BasicObject {
  [key: string]: any
}

interface RootState {
  position: LocationObject,
  path: Array<Array<number>>,
  region: Region,
  observation: Point,
  observationEvent: ObservationEventType,
  centered: boolean,
  maptype: 'topographic' | 'satellite',
  editing: EditingType,
  observationId: Record<string, any>,
  firstZoom: boolean
}

const mapStateToProps = (state: RootState) => {
  const { position, path, region, observation, observationEvent, centered, maptype, editing, observationId, firstZoom } = state
  return { position, path, region, observation, observationEvent, centered, maptype, editing, observationId, firstZoom }
}

const mapDispatchToProps = {
  setRegion,
  setObservationLocation,
  replaceLocationById,
  clearObservationLocation,
  toggleCentered,
  toggleMaptype,
  setEditing,
  setObservationId,
  clearObservationId,
  setMessageState,
  deleteObservation,
  setFirstZoom
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  onPressHome: () => void,
  onPressObservation: (isNew: boolean, rules: Record<string, any>, defaults: Record<string, any>) => void,
  onPressEditing: (fromMap?: boolean, sourcePage?: string) => void,
  onPressFinishObservationEvent: (sourcePage: string) => void,
  children?: ReactChild
}

const MapComponent = (props: Props) => {
  const { t } = useTranslation()
  const [mapLoaded, setMapLoaded] = useState(false)
  const [observationButtonsState, setObservationButtonsState] = useState('')
  const [modalVisibility, setModalVisibility] = useState(false)
  const [observationOptions, setObservationOptions] = useState<Record<string, any>[]>([])

  const onMapLoaded = () => {
    setMapLoaded(true)
  }

  //if centering is true keeps recentering the map on renders
  useEffect(() => {
    if (props.centered && props.position) {

      if (!props.firstZoom) {
        followUser()

      } else {
        const coords: LatLng = { ...props.position.coords }
        let initialRegion = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01000000000000000,
          longitudeDelta: 0.01000000000000000
        }

        props.setRegion(initialRegion)
        moveToRegion(initialRegion)
      }
    }
  })
  //if observation location is being edited center on observation initially, else to user location
  useEffect(() => {
    if (props.editing.started && props.observation) {
      props.setRegion({
        ...convertPointToLatLng(props.observation),
        latitudeDelta: 0.01000000000000000,
        longitudeDelta: 0.01000000000000000
      })
    }
  }, [props.editing])

  useEffect(() => {
    if (props.editing.started) {
      setObservationButtonsState('changeLocation')
    } else {
      setObservationButtonsState('newObservation')
    }
  }, [props.editing])

  //reference for mapView
  let mapView: MapView | null = null

  //animates map to given region
  const moveToRegion = (region: Region | null) => {
    if (region && mapView && mapLoaded) {
      mapView.animateToRegion(region, 500)
      if (props.firstZoom) { props.setFirstZoom(false) }
    }
  }

  //gets user region and moves map to them
  const followUser = () => {
    const region = getRegionFromCoords()
    moveToRegion(region)
  }

  //extracts user coordinates from geoLocationObject, and converts to region-type
  //for map view
  const getRegionFromCoords = () => {
    if (props.position) {
      const coords: LatLng = { ...props.position.coords }

      const region: Region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: props.region.latitudeDelta,
        longitudeDelta: props.region.longitudeDelta
      }

      return region
    }

    return null
  }

  //centers the map on user and sets the centering flag to true
  const centerMapAnim = () => {
    props.centered ? null : props.toggleCentered()

    followUser()
  }

  //releases mapcenter from userlocation on moving the map or tapping one of the
  //markers
  const stopCentering = () => {
    props.centered ? props.toggleCentered() : null
  }

  //updates region reducer once map has stopped moving
  const onRegionChangeComplete = (region: Region) => {
    props.setRegion(region)
  }

  //on long press on map converts selected location to point and places in observation location reducer
  const markObservation = (coordinate: LatLng) => {
    const point = convertLatLngToPoint(coordinate)
    props.setObservationLocation(point)
  }

  //clears observation location from its reducer, and removes it from the list
  //of locations in observationEvent
  const cancelObservation = () => {
    props.clearObservationLocation()
  }

  //redirects navigator back to edit page of single observation with flags telling
  //it that coordinate has been changed
  const submitEdit = () => {
    props.setEditing({
      started: true,
      locChanged: true,
      originalSourcePage: props.editing.originalSourcePage
    })
    props.onPressEditing()
  }

  const showSubmitDelete = (eventId: string, unitId: string) => {
    setModalVisibility(false)
    props.setMessageState({
      type: 'dangerConf',
      messageContent: t('remove observation?'),
      onOk: () => submitDelete(eventId, unitId),
      okLabel: t('delete')
    })
  }

  const submitDelete = async (eventId: string, unitId: string) => {
    try {
      await props.deleteObservation(eventId, unitId)
    } catch (error) {
      props.setMessageState({
        type: 'err',
        messageContent: error.message
      })
    } finally {
      props.clearObservationId()
    }
  }

  //redirects navigator back to edit page and set editing-flags to false
  const cancelEdit = () => {
    props.setEditing({
      started: false,
      locChanged: false,
      originalSourcePage: props.editing.originalSourcePage
    })
    props.onPressEditing()
  }

  const stopObserving = () => {
    props.setMessageState({
      type: 'dangerConf',
      messageContent: t('stop observing'),
      okLabel: t('cancelObservation'),
      cancelLabel: t('do not stop'),
      onOk: () => {
        props.setObservationId({
          eventId: props.observationEvent?.events?.[props?.observationEvent?.events?.length - 1].id,
          unitId: null
        })
        props.onPressFinishObservationEvent('MapComponent')
      }
    })
  }

  //sets observation ids and shifts screen to observation edit page, parameter
  //in onPressEditing will tell edit page that observation is being modified
  //from map, enabling return to correct screen when editing is finished
  const shiftToEditPage = (eventId: string, unitId: string) => {
    setModalVisibility(false)
    cancelObservation()
    props.setObservationId({
      eventId,
      unitId
    })
    props.onPressEditing(true, 'MapComponent')
  }

  //preparations for opening the edit observation modal
  const openModal = (units: Array<Record<string, any>>, eventId: string): void => {
    props.setObservationId({ eventId: eventId, unitId: null })
    cancelObservation()
    stopCentering()
    //gets the list of nearby observations and saves them to a state, so they can be rendered in the modal
    setObservationOptions(units)
    setModalVisibility(true)
  }

  //preparations for closing the edit modal
  const closeModal = (): void => {
    setModalVisibility(false)
    props.clearObservationId()
  }

  //draws user position to map
  const locationOverlay = () => (props.position !== null ?
    <Marker
      onPress={(event) => markObservation(event.nativeEvent.coordinate)}
      coordinate={{
        latitude: props.position.coords.latitude,
        longitude: props.position.coords.longitude
      }}
      zIndex={3}
      anchor={{ x: 0.5, y: 0.5 }}>
      <Icon
        type={'materials-icons'}
        name={'my-location'}
        size={50}
      />
    </Marker>
    : null
  )

  //draws user path to map
  const pathOverlay = () => {
    if (props.path.length >= 1 && props.position) {
      const path: Array<Array<number>> = props.path.concat([[
        props.position.coords.longitude,
        props.position.coords.latitude
      ]])

      const lineString: LineString | null = lineStringConstructor(path)
      return lineString ?
        <Geojson
          geojson={wrapGeometryInFC(lineString)}
          strokeWidth={5}
          strokeColor={Colors.red}
        />
        : null
    }

    return null
  }

  //draws currently selected point to map & enables dragabilty to finetune its
  //position
  const targetOverlay = () => (props.observation ?
    <Marker
      draggable={true}
      coordinate={convertPointToLatLng(props.observation)}
      onDragEnd={(event) => markObservation(event.nativeEvent.coordinate)}
      zIndex={4}
    />
    : null
  )

  //if topomap is selected draws its tiles on map
  const tileOverlay = () => (props.maptype === 'topographic' ?
    <UrlTile
      urlTemplate={urlTemplate}
      zIndex={-1}
    />
    : null
  )

  //draws past observations in same gatheringevent to map, markers are draggable
  const observationLocationsOverlay = () => {
    if (
      props.editing.started ||
      props.observationEvent?.events?.[props?.observationEvent?.events?.length - 1]
        ?.schema?.gatherings[0]?.units?.length <= 0
    ) {
      return null
    }

    const units: BasicObject[] = props.observationEvent.events?.[props.observationEvent.events.length - 1]
      .gatherings[0].units

    return units.map((unit) => {
      const coordinate = convertPointToLatLng(unit.unitGathering.geometry)
      const unitId = unit.id
      let color = unit.color

      if (!color) {
        color = Colors.obsColor
      }

      return (
        <Marker
          key={unitId}
          coordinate={coordinate}
          pinColor={color}
          zIndex={3}
        />
      )
    })
  }

  return (
    <>
      <GpsBarComponent stopObserving={stopObserving} />
      <View style={Cs.mapContainer}>
        <MapView
          ref={map => { mapView = map }}
          provider={'google'}
          initialRegion={props.region}
          onPanDrag={() => stopCentering()}
          onLongPress={(event) => markObservation(event.nativeEvent.coordinate)}
          onRegionChangeComplete={(region) => onRegionChangeComplete(region)}
          maxZoomLevel={18.9}
          minZoomLevel={5}
          mapType={props.maptype === 'topographic' ? 'none' : props.maptype}
          pitchEnabled={false}
          rotateEnabled={false}
          moveOnMarkerPress={false}
          style={Cs.mapViewStyle}
          onMapReady={onMapLoaded}
        >
          {locationOverlay()}
          {targetOverlay()}
          {pathOverlay()}
          {tileOverlay()}
          {observationLocationsOverlay()}
        </MapView>
        <View
          style={Cs.mapTypeContainer}>
          <TouchableHighlight onPress={() => props.toggleMaptype()} style={Os.touchableHiglightStyle}>
            <MaterialIcons
              name='layers'
              size={50}
              color='white'
            />
          </TouchableHighlight>
        </View>
        <View
          style={Cs.userLocationContainer}>
          <TouchableHighlight onPress={() => centerMapAnim()} style={Os.touchableHiglightStyle}>
            <MaterialIcons
              name='my-location'
              size={50}
              color='white'
            />
          </TouchableHighlight>
        </View>
        {props.observation ?
          observationButtonsState === 'newObservation' &&
          <ObservationButtonsComponent
            confirmationButton={props.onPressObservation}
            cancelButton={cancelObservation}
            mode={observationButtonsState}
            openModal={openModal}
            shiftToEditPage={shiftToEditPage}
          />
          ||
          observationButtonsState === 'changeLocation' &&
          <ObservationButtonsComponent
            confirmationButton={submitEdit}
            cancelButton={cancelEdit}
            mode={observationButtonsState}
            openModal={openModal}
            shiftToEditPage={shiftToEditPage}
          />
          : null
        }
        {props.children}
        <MapModalComponent
          shiftToEditPage={shiftToEditPage} showSubmitDelete={showSubmitDelete}
          cancelObservation={cancelObservation} isVisible={modalVisibility}
          onBackButtonPress={closeModal} observationOptions={observationOptions} />
        <MessageComponent />
      </View>
    </>
  )
}

export default connector(MapComponent)
