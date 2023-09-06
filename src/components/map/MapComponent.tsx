import React, { useState, useEffect, useRef } from 'react'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import MapView, { MapType, Marker, UrlTile, Region, LatLng, Geojson, WMSTile, PROVIDER_GOOGLE } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { LineString, MultiLineString } from 'geojson'
import {
  convertGC2FC,
  convertLatLngToPoint,
  convertPointToLatLng,
  wrapGeometryInFC,
  pathToLineStringConstructor
} from '../../helpers/geoJSONHelper'
import {
  rootState,
  DispatchType,
  setObservationLocation,
  clearObservationLocation,
  setObservationId,
  clearObservationId,
  deleteObservation,
  setRegion,
  setEditing,
  setFirstLocation,
  setMessageState
} from '../../stores'
import LoadingComponent from '../general/LoadingComponent'
import ExtendedNavBarComponent from '../general/ExtendedNavBarComponent'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import Cs from '../../styles/ContainerStyles'
import Os from '../../styles/OtherStyles'
import ObservationButtonsComponent from './ObservationButtonsComponent'
import { forms } from '../../config/fields'
import { mapUrl as urlTemplate, gridUrl as gridTemplate } from '../../config/urls'
import MessageComponent from '../general/MessageComponent'
import MapModalComponent from './MapModalComponent'
import AtlasModalComponent from './AtlasModalComponent'
import GridWarningComponent from '../general/GridWarningComponent'
import { captureException } from '../../helpers/sentry'
import useInterval from '../../helpers/useInterval'
import useChange from '../../helpers/useChange'

type Props = {
  onPressHome: () => void,
  onPressObservation: (isNew: boolean, rules?: Record<string, any>, defaults?: Record<string, any>, sourcePage?: string) => void,
  onPressEditing: (sourcePage?: string) => void,
  onPressFinishObservationEvent: (sourcePage: string) => void,
  onPop: () => void,
  onPressList: () => void
}

const MapComponent = (props: Props) => {

  const [atlasModalVisibility, setAtlasModalVisibility] = useState(false)
  const [centered, setCentered] = useState(true)
  const [delay, setDelay] = useState<number>(1000)
  const [initialized, setInitialized] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [mapModalVisibility, setMapModalVisibility] = useState(false)
  const [mapType, setMapType] = useState<MapType>('terrain')
  const [observationButtonsState, setObservationButtonsState] = useState('')
  const [observationOptions, setObservationOptions] = useState<Record<string, any>[]>([])

  const editing = useSelector((state: rootState) => state.editing)
  const grid = useSelector((state: rootState) => state.grid)
  const observation = useSelector((state: rootState) => state.observation)
  const observationEvent = useSelector((state: rootState) => state.observationEvent)
  const observationZone = useSelector((state: rootState) => state.observationZone)
  const path = useSelector((state: rootState) => state.path)
  const position = useSelector((state: rootState) => state.position)
  const region = useSelector((state: rootState) => state.region)
  const schema = useSelector((state: rootState) => state.schema)
  const tracking = useSelector((state: rootState) => state.tracking)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  const mapViewRef = useRef<MapView | null>(null)

  useInterval(() => {
    if (centered) followUser()
  }, initialized ? delay : null)

  //performs the zoom from initial region to user location
  useChange(() => {
    if (!position) {
      setInitialized(true)
      return
    }

    const coords: LatLng = { ...position.coords }
    const initialRegion = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.01000000000000000,
      longitudeDelta: 0.01000000000000000
    }

    dispatch(setRegion(initialRegion))
    moveToRegion(initialRegion)
    dispatch(setFirstLocation([coords.latitude, coords.longitude]))

    setInitialized(true)

    setTimeout(() => {
      setDelay(5000)
    }, 1500)
  }, [mapViewRef.current])

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

  //animates map to given region
  const moveToRegion = (region: Region | null) => {
    if (region && mapViewRef) {
      mapViewRef?.current?.animateToRegion(region, 500)
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
        latitudeDelta: region.latitudeDelta > 0.01000000000000000 ? 0.010000000000000000 : region.latitudeDelta,
        longitudeDelta: region.longitudeDelta > 0.01000000000000000 ? 0.010000000000000000 : region.longitudeDelta
      }

      return reg
    }

    return null
  }

  //centers the map on user and sets the centering flag to true
  const centerMapAnim = () => {
    if (!centered) { setCentered(true) }
    followUser()
  }

  //releases mapcenter from userlocation on moving the map or tapping one of the
  //markers
  const stopCentering = () => {
    if (centered) { setCentered(false) }
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
    props.onPressEditing()
  }

  const showSubmitDelete = (eventId: string, unitId: string) => {
    setMapModalVisibility(false)
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
    } catch (error: any) {
      captureException(error)
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

  //sets observation ids and shifts screen to observation edit page, parameter
  //in onPressEditing will tell edit page that observation is being modified
  //from map, enabling return to correct screen when editing is finished
  const shiftToEditPage = (eventId: string, unitId: string) => {
    setMapModalVisibility(false)
    cancelObservation()
    dispatch(setObservationId({
      eventId,
      unitId
    }))
    props.onPressEditing('map')
  }

  //preparations for opening the edit observation modal
  const openMapModal = (units: Array<Record<string, any>>, eventId: string): void => {
    dispatch(setObservationId({ eventId: eventId, unitId: null }))
    cancelObservation()
    stopCentering()
    //gets the list of nearby observations and saves them to a state, so they can be rendered in the modal
    setObservationOptions(units)
    setMapModalVisibility(true)
  }

  //preparations for closing the edit modal
  const closeMapModal = (): void => {
    setMapModalVisibility(false)
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
        type={'material-icons'}
        name={'my-location'}
        size={50}
      />
    </Marker>
    : null
  )

  //draws user path to map
  const pathOverlay = () => {
    if (path[path.length - 1]?.length >= 1 && position) {
      const pathToDraw = path.map((subpath, index) => {
        if (index === path.length - 1) {
          return subpath.concat([[
            position.coords.longitude,
            position.coords.latitude,
            0.0,
            0.0,
            false
          ]])
        }

        return subpath
      })

      const pathPolygon: LineString | MultiLineString | undefined = pathToLineStringConstructor(pathToDraw)

      return pathPolygon ?
        <Geojson
          geojson={wrapGeometryInFC(pathPolygon)}
          strokeWidth={5}
          strokeColor={Colors.pathColor}
          zIndex={2}
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
    const zone = observationZone.zones.find(z =>
      observationZone.currentZoneId !== 'empty' &&
      z.id === observationZone.currentZoneId &&
      z.geometry !== null
    )

    return (zone && zone.geometry ?
      <Geojson
        geojson={convertGC2FC(zone.geometry)}
        fillColor="#f002"
        strokeColor="#f00"
        strokeWidth={1}
        zIndex={1}
      />
      : null
    )
  }

  //if topomap is selected draws its tiles on map
  const tileOverlay = () => (mapType === 'terrain' ?
    <UrlTile
      urlTemplate={urlTemplate}
      zIndex={-1}
    />
    : null
  )

  const gridOverlay = () => {
    return (
      <>
        <WMSTile
          urlTemplate={gridTemplate}
          tileSize={256}
          opacity={1}
          zIndex={5}
        />
      </>
    )
  }

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
      if (!unit.unitGathering?.geometry) {
        return
      }

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

  const toggleMapType = () => {
    mapType === 'terrain' ? setMapType('satellite') : setMapType('terrain')
  }

  if (loading) {
    return (
      <LoadingComponent text={'loading'} />
    )
  } else {
    return (
      <>
        <ExtendedNavBarComponent onPressMap={undefined} onPressList={props.onPressList}
          onPressFinishObservationEvent={props.onPressFinishObservationEvent} setLoading={setLoading}
          observationButtonsState={observationButtonsState} />
        <View style={Cs.mapContainer}>
          <MapView
            testID='map-view'
            ref={mapViewRef}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            onPanDrag={() => stopCentering()}
            onLongPress={(event) => markObservation(event.nativeEvent.coordinate)}
            onRegionChangeComplete={(region) => {
              onRegionChangeComplete(region)
            }}
            maxZoomLevel={18.9}
            minZoomLevel={5}
            mapType={mapType === 'terrain' ? 'none' : mapType}
            pitchEnabled={false}
            rotateEnabled={false}
            moveOnMarkerPress={false}
            style={Os.mapViewStyle}
          >
            {locationOverlay()}
            {targetOverlay()}
            {pathOverlay()}
            {tileOverlay()}
            {schema.formID === forms.birdAtlas ? gridOverlay() : null}
            {zoneOverlay()}
            {observationLocationsOverlay()}
          </MapView>
          {schema.formID === forms.birdAtlas ?
            <View style={Cs.gridTitleContainer}>
              <ButtonComponent onPressFunction={() => setAtlasModalVisibility(true)} title={grid?.n + ':' + grid?.e}
                height={35} width={100} buttonStyle={Bs.tileDetailsButton}
                gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                textStyle={Ts.boldButtonText} iconName={'help'} iconType={'material-icons'} iconSize={20} contentColor={Colors.whiteText}
              />
            </View>
            : null
          }
          {schema.formID === forms.birdAtlas && grid?.pauseGridCheck ?
            <GridWarningComponent />
            : null
          }
          <View style={Cs.mapButtonsContainer}>
            <ButtonComponent testID='toggle-map-type-btn' onPressFunction={() => toggleMapType()} title={undefined}
              height={50} width={50} buttonStyle={Bs.mapIconButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={'layers'} iconType={'material-icons'} iconSize={36} contentColor={Colors.whiteText}
            />
            <ButtonComponent testID='center-map-btn' onPressFunction={() => centerMapAnim()} title={undefined}
              height={50} width={50} buttonStyle={Bs.mapIconButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={'my-location'} iconType={'material-icons'} iconSize={36} contentColor={Colors.whiteText}
            />
          </View>
          {observation ?
            observationButtonsState === 'newObservation' &&
            <ObservationButtonsComponent
              confirmationButton={props.onPressObservation}
              cancelButton={cancelObservation}
              mode={observationButtonsState}
              openModal={openMapModal}
              shiftToEditPage={shiftToEditPage}
            />
            ||
            observationButtonsState === 'changeLocation' &&
            <ObservationButtonsComponent
              confirmationButton={changeObservationLocation}
              cancelButton={cancelEdit}
              mode={observationButtonsState}
              openModal={openMapModal}
              shiftToEditPage={shiftToEditPage}
            />
            : null
          }
          <MapModalComponent
            shiftToEditPage={shiftToEditPage} showSubmitDelete={showSubmitDelete}
            cancelObservation={cancelObservation} isVisible={mapModalVisibility}
            onBackButtonPress={closeMapModal} observationOptions={observationOptions} />
          <MessageComponent />
          <AtlasModalComponent isVisible={atlasModalVisibility} onBackButtonPress={() => { setAtlasModalVisibility(false) }} />
        </View>
      </>
    )
  }
}

export default MapComponent