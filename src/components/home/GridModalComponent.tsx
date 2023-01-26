import React, { useEffect, useState } from 'react'
import { Linking, View, Text, ActivityIndicator, Platform } from 'react-native'
import MapView, { MapType, Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Region, UrlTile, WMSTile } from 'react-native-maps'
import { Icon } from 'react-native-elements'
import { LocationObject } from 'expo-location'
import Modal from 'react-native-modal'
import Checkbox from 'expo-checkbox'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  rootState,
  DispatchType,
  setGrid,
  setRegion,
  setFirstLocation,
  updateLocation,
  setTracking
} from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Os from '../../styles/OtherStyles'
import Colors from '../../styles/Colors'
import { convertWGS84ToYKJ, getCurrentLocation, YKJCoordinateIntoWGS84Grid } from '../../helpers/geolocationHelper'
import { gridUrl, mapUrl, resultServiceUrl } from '../../config/urls'
import { getGridName } from '../../services/atlasService'
import storageService from '../../services/storageService'

type Props = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  onBeginObservationEvent: (tracking: boolean) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  showError: (error: string) => void
}

const GridModalComponent = (props: Props) => {

  const [ownLocation, setOwnLocation] = useState<[number, number]>([373, 777])
  const [gridName, setGridName] = useState<string>('')
  const [gridCoords, setGridCoords] = useState<[number, number]>([373, 777])
  const [northing, setNorthing] = useState<string>('000')
  const [easting, setEasting] = useState<string>('000')
  const [loading, setLoading] = useState<boolean>(false)

  const [centered, setCentered] = useState(true)
  const [firstZoom, setFirstZoom] = useState<'zoomed' | 'zooming' | 'not'>('not')
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapType, setMapType] = useState<MapType>('terrain')
  const [visibleRegion, setVisibleRegion] = useState<Region>() // for the iPhone 8 bug

  const position = useSelector((state: rootState) => state.position)
  const region = useSelector((state: rootState) => state.region)
  const tracking = useSelector((state: rootState) => state.tracking)

  const { t } = useTranslation()

  const dispatch: DispatchType = useDispatch()

  const setLocation = async (reloadModal: boolean) => {
    let location: LocationObject
    try {
      if (reloadModal) setLoading(true)
      location = await getCurrentLocation(false, 6)
      dispatch(updateLocation(location))
    } catch (err) {
      props.setModalVisibility(false)
      props.showError(`${t('unable to get current location')}: ${err}`)
      if (reloadModal) setLoading(false)
      return
    }

    const ykjLocation = convertWGS84ToYKJ([location.coords.longitude, location.coords.latitude])

    setOwnLocation(ykjLocation)
    setEasting(ykjLocation[0].toString().slice(0, 3))
    setNorthing(ykjLocation[1].toString().slice(0, 3))

    try {
      const gridDetails = await getGridName(ykjLocation[1].toString().slice(0, 3) + ':' + ykjLocation[0].toString().slice(0, 3))
      setGridName(gridDetails.name)
      setGridCoords([parseInt(ykjLocation[1].toString().slice(0, 3)), parseInt(ykjLocation[0].toString().slice(0, 3))])
    } catch (err) {
      props.showError(`${t('failed to fetch grid name')}: ${err}`)
    }

    if (reloadModal) setLoading(false)
  }

  useEffect(() => {
    if (props.modalVisibility) {
      setLocation(true)
    }
  }, [props.modalVisibility])

  const handleStartEvent = async () => {
    const n = parseInt(northing)
    const e = parseInt(easting)

    if (n < 661 || n > 777 || e < 306 || e > 373) {
      props.setModalVisibility(false)
      props.showError(t('current location out of ykj bounds'))
      return
    }

    const gridDetails = await getGridName(n + ':' + e)

    props.setModalVisibility(false)

    if (e === Math.trunc(ownLocation[0] / 10000) && n === Math.trunc(ownLocation[1] / 10000)) {
      dispatch(setGrid({
        n: n,
        e: e,
        geometry: YKJCoordinateIntoWGS84Grid(gridCoords[0], gridCoords[1]),
        name: gridDetails.name,
        pauseGridCheck: false
      }))
    } else {
      dispatch(setGrid({
        n: n,
        e: e,
        geometry: YKJCoordinateIntoWGS84Grid(gridCoords[0], gridCoords[1]),
        name: gridDetails.name,
        pauseGridCheck: true
      }))
    }

    props.onBeginObservationEvent(tracking)
  }

  useEffect(() => {
    if (centered && position && mapLoaded) {
      if (firstZoom === 'zoomed') {
        followUser()
      } else if (firstZoom === 'not') {
        zoomFromFinlandToLocation()
      }
    }
  })

  //reference for mapView
  let mapView: MapView | null = null

  //animates map to given region
  const moveToRegion = (region: Region | null) => {
    if (region && mapView && mapLoaded) {
      mapView.animateToRegion(region, 500)
    }
  }

  //gets user region and moves map to them
  const followUser = () => moveToRegion(getRegionFromCoords())

  const zoomFromFinlandToLocation = () => {
    if (!position) {
      setFirstZoom('zoomed')
      return
    }

    setFirstZoom('zooming')

    const initialRegion = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.01000000000000000,
      longitudeDelta: 0.01000000000000000
    }

    dispatch(setRegion(initialRegion))
    moveToRegion(initialRegion)
    dispatch(setFirstLocation([position.coords.latitude, position.coords.longitude]))

    setTimeout(() => {
      setFirstZoom('zoomed')
    }, 1000)
  }

  const locationOverlay = () => (position !== null ?
    <Marker
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
        tvParallaxProperties={undefined}
      />
    </Marker>
    : null
  )

  const getRegionFromCoords = () => {
    if (!position) return null

    const reg: Region = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta
    }

    return reg
  }

  const onMapLoaded = () => setMapLoaded(true)

  const gridOverlay = () => (
    <>
      <WMSTile
        urlTemplate={gridUrl}
        tileSize={256}
        opacity={1}
        zIndex={5}
      />
    </>
  )

  const tileOverlay = () => (mapType === 'terrain' ?
    <UrlTile
      urlTemplate={mapUrl}
      zIndex={-1}
    />
    : null
  )

  const toggleMapType = () => setMapType(mapType === 'terrain' ? 'satellite' : 'terrain')

  const centerMapAnim = async () => {
    await setLocation(false)
    if (!centered) { setCentered(true) }
    followUser()
  }

  const stopCentering = () => {
    if (centered) { setCentered(false) }
  }

  return (
    <Modal isVisible={props.modalVisibility} backdropOpacity={10} onBackButtonPress={() => { props.setModalVisibility(false) }}
      onBackdropPress={() => { props.setModalVisibility(false) }}>
      <View style={Cs.modalContainer}>
        <View style={{ alignSelf: 'flex-start' }}>
          {loading ?
            <ActivityIndicator size={25} color={Colors.primary5} /> :
            <>
              <View style={Cs.gridModalElementContainer}>
                <Text>
                  {`${t('your current location is')} ${ownLocation[1].toString().slice(0, 3)}:${ownLocation[0].toString().slice(0, 3)}, ${gridName}.\n\n`}
                  <Text
                    style={{ color: Colors.linkText }}
                    onPress={() => Linking.openURL(resultServiceUrl + `${ownLocation[1].toString().slice(0, 3)}:${ownLocation[0].toString().slice(0, 3)}`)}>
                    {t('link to result service')}
                  </Text>
                </Text>
              </View>
              <View style={Cs.locateMeMapContainer}>
                <MapView
                  ref={map => { mapView = map }}
                  initialRegion={region}
                  provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                  maxZoomLevel={18.9}
                  minZoomLevel={5}
                  mapType={mapType === 'terrain' ? 'terrain' : mapType}
                  pitchEnabled={false}
                  rotateEnabled={false}
                  moveOnMarkerPress={false}
                  style={Os.gridModalMapViewStyle}
                  onMapReady={onMapLoaded}
                  onPanDrag={() => stopCentering()}
                  onRegionChangeComplete={(region) => {
                    setVisibleRegion(region) // for the iPhone 8 bug
                  }}
                >
                  {locationOverlay()}
                  {tileOverlay()}
                  {gridOverlay()}
                  {visibleRegion && Platform.OS === 'ios' &&
                    <Marker coordinate={visibleRegion}>
                      <View />
                    </Marker>
                  }
                </MapView>
                <View style={Cs.mapButtonsContainer}>
                  <View style={Cs.padding5Container}>
                    <ButtonComponent testID="toggle-map-type-btn" onPressFunction={() => toggleMapType()} title={undefined}
                      height={50} width={50} buttonStyle={Bs.mapIconButton}
                      gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                      textStyle={Ts.buttonText} iconName={'layers'} iconType={'material-icons'} iconSize={36} contentColor={Colors.whiteText}
                    />
                  </View>
                  <View style={Cs.padding5Container}>
                    <ButtonComponent testID="center-map-btn" onPressFunction={() => centerMapAnim()} title={undefined}
                      height={50} width={50} buttonStyle={Bs.mapIconButton}
                      gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                      textStyle={Ts.buttonText} iconName={'my-location'} iconType={'material-icons'} iconSize={36} contentColor={Colors.whiteText}
                    />
                  </View>
                </View>
              </View>
              <View style={Cs.modalStartButtonContainer}>
                <View style={Cs.padding5Container}>
                  <ButtonComponent testID="center-map-btn" onPressFunction={async () => await centerMapAnim()} title={t('locate me')}
                    height={40} width={160} buttonStyle={Bs.locateMeButton}
                    gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                    textStyle={Ts.buttonText} iconName={'person-pin'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                <Checkbox
                  value={tracking}
                  onValueChange={async (value: boolean) => {
                    dispatch(setTracking(value))
                    await storageService.save('tracking', value)
                  }}
                  style={{ padding: 5 }}
                  color={tracking ? Colors.primary5 : undefined}
                />
                <Text style={{ color: Colors.neutral7, padding: 5 }}>{t('path tracking')}</Text>
              </View>
              <View style={Cs.modalStartButtonContainer}>
                <View style={Cs.padding5Container}>
                  <ButtonComponent disabled={loading} onPressFunction={async () => await handleStartEvent()} title={t('start')}
                    height={40} width={120} buttonStyle={Bs.beginButton}
                    gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                    textStyle={Ts.buttonText} iconName={'play-arrow'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
                  />
                </View>
                <View style={Cs.padding5Container}>
                  <ButtonComponent onPressFunction={() => props.setModalVisibility(false)} title={t('cancel')}
                    height={40} width={120} buttonStyle={Bs.beginButton}
                    gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                    textStyle={Ts.buttonText} iconName={'cancel'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
                  />
                </View>
              </View>
            </>
          }
        </View>
      </View>
    </Modal>
  )
}

export default GridModalComponent