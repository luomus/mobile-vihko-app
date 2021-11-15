import React, { useState, useEffect } from 'react'
import MapView, { Marker, UrlTile, Region, LatLng, Geojson } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { MultiPolygon } from 'geojson'
import { convertGC2FC, convertLatLngToPoint, convertPointToLatLng, wrapGeometryInFC, pathPolygonConstructor } from '../../helpers/geoJSONHelper'
import {
  rootState,
  DispatchType,
  setObservationLocation,
  clearObservationLocation,
  setObservationId,
  clearObservationId,
  deleteObservation,
  setRegion,
  toggleCentered,
  setFirstZoom,
  toggleMaptype,
  setEditing,
  setFirstLocation,
  setMessageState
} from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import Cs from '../../styles/ContainerStyles'
import Os from '../../styles/OtherStyles'
import ObservationButtonsComponent from './ObservationButtonsComponent'
import { mapUrl as urlTemplate } from '../../config/urls'
import MessageComponent from '../general/MessageComponent'
import MapModalComponent from './MapModalComponent'
import { Icon } from 'react-native-elements'

type Props = {
  onPressHome: () => void,
  onPressObservation: (isNew: boolean, rules: Record<string, any>, defaults: Record<string, any>) => void,
  onPressEditing: (fromMap?: boolean, sourcePage?: string) => void,
  onPressFinishObservationEvent: (sourcePage: string) => void,
  onPop: () => void
}

const MapComponent = (props: Props) => {

  const [mapLoaded, setMapLoaded] = useState(false)
  const [observationButtonsState, setObservationButtonsState] = useState('')
  const [modalVisibility, setModalVisibility] = useState(false)
  const [observationOptions, setObservationOptions] = useState<Record<string, any>[]>([])

  const centered = useSelector((state: rootState) => state.centered)
  const editing = useSelector((state: rootState) => state.editing)
  const firstZoom = useSelector((state: rootState) => state.firstZoom)
  const maptype = useSelector((state: rootState) => state.maptype)
  const observation = useSelector((state: rootState) => state.observation)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const observationZone = useSelector((state: rootState) => state.observationZone)
  const path = useSelector((state: rootState) => state.path)
  const position = useSelector((state: rootState) => state.position)
  const region = useSelector((state: rootState) => state.region)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  const onMapLoaded = () => {
    setMapLoaded(true)
  }

  //if centering is true keeps recentering the map on renders
  useEffect(() => {
    if (centered && position && mapLoaded) {

      //zoom from initial region to user location when starting the observation event
      const triggerZoomFromFinland = async () => {
        zoomFromFinlandToLocation()
      }

      if (firstZoom === 'zoomed') {
        followUser()

      } else if (firstZoom === 'not') {
        triggerZoomFromFinland()
      }
    }
  })

  //if observation location is being edited center on observation initially, else to user location
  useEffect(() => {
    if (editing.started && observation) {
      dispatch(setRegion({
        ...convertPointToLatLng(observation),
        latitudeDelta: 0.01000000000000000,
        longitudeDelta: 0.01000000000000000
      }))
    }
  }, [editing])

  useEffect(() => {
    if (editing.started) {
      setObservationButtonsState('changeLocation')
    } else {
      setObservationButtonsState('newObservation')
    }
  }, [editing])

  //reference for mapView
  let mapView: MapView | null = null

  //animates map to given region
  const moveToRegion = (region: Region | null) => {
    if (region && mapView && mapLoaded) {
      mapView.animateToRegion(region, 500)
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
    if (position) {
      const coords: LatLng = { ...position.coords }

      const reg: Region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta
      }

      return reg
    }

    return null
  }

  //centers the map on user and sets the centering flag to true
  const centerMapAnim = () => {
    centered ? null : dispatch(toggleCentered())

    followUser()
  }

  //releases mapcenter from userlocation on moving the map or tapping one of the
  //markers
  const stopCentering = () => {
    centered ? dispatch(toggleCentered()) : null
  }

  //updates region reducer once map has stopped moving
  const onRegionChangeComplete = (region: Region) => {
    dispatch(setRegion(region))
  }

  //on long press on map converts selected location to point and places in observation location reducer
  const markObservation = (coordinate: LatLng) => {
    const point = convertLatLngToPoint(coordinate)
    dispatch(setObservationLocation(point))
  }

  //performs the zoom from initial region to user location
  const zoomFromFinlandToLocation = () => {
    dispatch(setFirstZoom('zooming'))

    const coords: LatLng = { ...position.coords }
    let initialRegion = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.01000000000000000,
      longitudeDelta: 0.01000000000000000
    }

    dispatch(setRegion(initialRegion))
    moveToRegion(initialRegion)
    dispatch(setFirstLocation([coords.latitude, coords.longitude]))

    setTimeout(() => {
      setFirstZoom('zoomed')
    }, 1000)
  }

  //clears observation location from its reducer, and removes it from the list
  //of locations in observationEvent
  const cancelObservation = () => {
    dispatch(clearObservationLocation())
  }

  //redirects navigator back to edit page of single observation with flags telling
  //it that coordinate has been changed
  const changeObservationLocation = () => {
    dispatch(setEditing({
      started: true,
      locChanged: true,
      originalSourcePage: editing.originalSourcePage
    }))
    props.onPop()
  }

  const showSubmitDelete = (eventId: string, unitId: string) => {
    setModalVisibility(false)
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('remove observation?'),
      onOk: () => submitDelete(eventId, unitId),
      okLabel: t('delete')
    }))
  }

  const submitDelete = async (eventId: string, unitId: string) => {
    try {
      await dispatch(deleteObservation(eventId, unitId))
    } catch (error) {
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message
      }))
    } finally {
      dispatch(clearObservationId())
    }
  }

  //redirects navigator back to edit page and set editing-flags to false
  const cancelEdit = () => {
    dispatch(setEditing({
      started: false,
      locChanged: false,
      originalSourcePage: editing.originalSourcePage
    }))
    props.onPressEditing()
  }

  const stopObserving = () => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('stop observing'),
      okLabel: t('cancelObservation'),
      cancelLabel: t('do not stop'),
      onOk: () => {
        dispatch(setObservationId({
          eventId: observationEvent?.events?.[observationEvent?.events?.length - 1].id,
          unitId: null
        }))
        props.onPressFinishObservationEvent('map')
      }
    }))
  }

  //sets observation ids and shifts screen to observation edit page, parameter
  //in onPressEditing will tell edit page that observation is being modified
  //from map, enabling return to correct screen when editing is finished
  const shiftToEditPage = (eventId: string, unitId: string) => {
    setModalVisibility(false)
    cancelObservation()
    dispatch(setObservationId({
      eventId,
      unitId
    }))
    props.onPressEditing(true, 'map')
  }

  //preparations for opening the edit observation modal
  const openModal = (units: Array<Record<string, any>>, eventId: string): void => {
    dispatch(setObservationId({ eventId: eventId, unitId: null }))
    cancelObservation()
    stopCentering()
    //gets the list of nearby observations and saves them to a state, so they can be rendered in the modal
    setObservationOptions(units)
    setModalVisibility(true)
  }

  //preparations for closing the edit modal
  const closeModal = (): void => {
    setModalVisibility(false)
    dispatch(clearObservationId())
  }

  //draws user position to map
  const locationOverlay = () => (position !== null ?
    <Marker
      onPress={(event) => markObservation(event.nativeEvent.coordinate)}
      coordinate={{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
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

    if (path?.length >= 1 && position) {
      const pathPolygon: MultiPolygon | undefined = pathPolygonConstructor(path, [
        position.coords.longitude,
        position.coords.latitude
      ])

      // if (path[path.length - 1]?.length >= 1 && position) {
      //   const pathToDraw = path.map((subpath, index) => {
      //     if (index === path.length - 1) {
      //       return subpath.concat([[
      //         position.coords.longitude,
      //         position.coords.latitude,
      //         0.0,
      //         0.0,
      //         false
      //       ]])
      //     }

      //     return subpath
      //   })

      //   const pathPolygon: LineString | MultiLineString | undefined = pathToLineStringConstructor(pathToDraw)

      return pathPolygon ?
        <Geojson
          geojson={wrapGeometryInFC(pathPolygon)}
          strokeWidth={5}
          strokeColor={Colors.pathColor}
        />
        : null
    }

    return null
  }

  //draws currently selected point to map & enables dragabilty to finetune its
  //position
  const targetOverlay = () => (observation ?
    <Marker
      draggable={true}
      coordinate={convertPointToLatLng(observation)}
      onDragEnd={(event) => markObservation(event.nativeEvent.coordinate)}
      zIndex={4}
    />
    : null
  )

  //draws observation zone to map
  const zoneOverlay = () => {
    let zone = observationZone.zones.find(z =>
      observationZone.currentZoneId !== 'empty' &&
      z.id === observationZone.currentZoneId &&
      z.geometry !== null
    )

    return (zone ?
      <Geojson
        geojson={convertGC2FC(zone.geometry)}
        fillColor="#f002"
        pinColor="#f00"
        strokeColor="#f00"
        strokeWidth={1}
      />
      : null
    )
  }

  //if topomap is selected draws its tiles on map
  const tileOverlay = () => (maptype === 'terrain' ?
    <UrlTile
      urlTemplate={urlTemplate}
      zIndex={-1}
    />
    : null
  )

  //draws past observations in same gatheringevent to map, markers are draggable
  const observationLocationsOverlay = () => {
    if (
      editing.started ||
      observationEvent.events[observationEvent?.events?.length - 1] === undefined ||
      observationEvent?.events?.[observationEvent?.events?.length - 1]
        ?.schema?.gatherings[0]?.units?.length <= 0
    ) {
      return null
    }

    const units: Record<string, any> = observationEvent.events?.[observationEvent.events.length - 1]
      .gatherings[0].units

    return units.map((unit: Record<string, any>) => {
      const coordinate = convertPointToLatLng(unit.unitGathering.geometry)
      const unitId = unit.id
      let color = unit.color

      if (!color) {
        color = Colors.observationColor
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
      <View style={Cs.stopObservingContainer}>
        <ButtonComponent onPressFunction={() => stopObserving()} title={t('stop observation event')}
          height={30} width={150} buttonStyle={Bs.stopObservingFromMapButton}
          gradientColorStart={Colors.dangerButton1} gradientColorEnd={Colors.dangerButton2} shadowColor={Colors.dangerShadow}
          textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={undefined} contentColor={Colors.whiteText}
        />
      </View>
      <View style={Cs.mapContainer}>
        <MapView
          ref={map => { mapView = map }}
          provider={'google'}
          initialRegion={region}
          onPanDrag={() => stopCentering()}
          onLongPress={(event) => markObservation(event.nativeEvent.coordinate)}
          onRegionChangeComplete={(region) => onRegionChangeComplete(region)}
          maxZoomLevel={18.9}
          minZoomLevel={5}
          mapType={maptype === 'terrain' ? 'none' : maptype}
          pitchEnabled={false}
          rotateEnabled={false}
          moveOnMarkerPress={false}
          style={Os.mapViewStyle}
          onMapReady={onMapLoaded}
        >
          {locationOverlay()}
          {targetOverlay()}
          {pathOverlay()}
          {tileOverlay()}
          {zoneOverlay()}
          {observationLocationsOverlay()}
        </MapView>
        <View style={Cs.mapButtonsContainer}>
          <View style={Cs.padding5Container}>
            <ButtonComponent onPressFunction={() => dispatch(toggleMaptype())} title={undefined}
              height={50} width={50} buttonStyle={Bs.mapIconButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={'layers'} iconType={'material-icons'} iconSize={36} contentColor={Colors.whiteText}
            />
          </View>
          <View style={Cs.padding5Container}>
            <ButtonComponent onPressFunction={() => centerMapAnim()} title={undefined}
              height={50} width={50} buttonStyle={Bs.mapIconButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={'my-location'} iconType={'material-icons'} iconSize={36} contentColor={Colors.whiteText}
            />
          </View>
        </View>
        {observation ?
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
            confirmationButton={changeObservationLocation}
            cancelButton={cancelEdit}
            mode={observationButtonsState}
            openModal={openModal}
            shiftToEditPage={shiftToEditPage}
          />
          : null
        }
        <MapModalComponent
          shiftToEditPage={shiftToEditPage} showSubmitDelete={showSubmitDelete}
          cancelObservation={cancelObservation} isVisible={modalVisibility}
          onBackButtonPress={closeModal} observationOptions={observationOptions} />
        <MessageComponent />
      </View>
    </>
  )
}

export default MapComponent