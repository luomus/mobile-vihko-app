import React, { useEffect, useRef, useState } from 'react'
import { Linking, View, Text, ActivityIndicator, Platform } from 'react-native'
import MapView, { LatLng, MapType, Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Region, UrlTile, WMSTile } from 'react-native-maps'
import { Icon } from 'react-native-elements'
import { LocationObject } from 'expo-location'
import Modal from 'react-native-modal'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  rootState,
  DispatchType,
  setGrid,
  setRegion,
  setFirstLocation,
  updateLocation,
  setTracking,
  setMessageState
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
import MessageComponent from '../general/MessageComponent'
import useInterval from '../../helpers/useInterval'

type Props = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  onBeginObservationEvent: (tracking: boolean) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const GridModalComponent = (props: Props) => {

  const [delay, setDelay] = useState<number>(1000)
  const [easting, setEasting] = useState<string>('000')
  const [gridCoords, setGridCoords] = useState<[number, number]>([373, 777])
  const [gridName, setGridName] = useState<string>('')
  const [initialized, setInitialized] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [northing, setNorthing] = useState<string>('000')
  const [ownLocation, setOwnLocation] = useState<[number, number]>([373, 777])

  const [centered, setCentered] = useState(true)
  const [mapType, setMapType] = useState<MapType>('terrain')
  const [visibleRegion, setVisibleRegion] = useState<Region>() // for the iPhone 8 bug

  const position = useSelector((state: rootState) => state.position)
  const region = useSelector((state: rootState) => state.region)

  const { t } = useTranslation()

  const dispatch: DispatchType = useDispatch()

  const miniMapRef = useRef<MapView | null>(null)

  useEffect(() => {
    if (props.modalVisibility) {
      setLocation(true)
    } else {
      setInitialized(false)
    }
  }, [props.modalVisibility])

  useInterval(() => {
    if (centered) followUser()
  }, initialized ? delay : null)

  const setLocation = async (reloadModal: boolean) => {
    let location: LocationObject
    try {
      if (reloadModal) setLoading(true)
      location = await getCurrentLocation(false, 5)
      dispatch(updateLocation(location))
    } catch (error: any) {
      if (reloadModal) setLoading(false)
      showError(error.message)
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
    } catch (error: any) {
      showError(`${t('failed to fetch grid name')}: ${error}`)
    }

    if (reloadModal) setLoading(false)

    //run initRegion after the location has been set (map should be loaded by then)
    initRegion(location)
  }

  const initRegion = (positionParam: LocationObject) => {
    if (!positionParam) {
      setInitialized(true)
      return
    }

    const coords: LatLng = { ...positionParam.coords }
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
  }

  const handleStartEvent = async () => {
    const n = parseInt(northing)
    const e = parseInt(easting)

    if (n < 661 || n > 777 || e < 306 || e > 373) {
      props.setModalVisibility(false)
      showError(t('current location out of ykj bounds'))
      return
    }

    const gridDetails = await getGridName(n + ':' + e)

    if (e === Math.trunc(ownLocation[0] / 10000) && n === Math.trunc(ownLocation[1] / 10000)) {
      dispatch(setGrid({
        n: n,
        e: e,
        geometry: YKJCoordinateIntoWGS84Grid(gridCoords[0], gridCoords[1]),
        name: gridDetails.name,
        pauseGridCheck: false,
        outsideBorders: 'false'
      }))
    } else {
      dispatch(setGrid({
        n: n,
        e: e,
        geometry: YKJCoordinateIntoWGS84Grid(gridCoords[0], gridCoords[1]),
        name: gridDetails.name,
        pauseGridCheck: true,
        outsideBorders: 'false'
      }))
    }

    setTracking(true)
    await storageService.save('tracking', true)

    props.setModalVisibility(false)
    props.onBeginObservationEvent(true)
  }

  //animates map to given region
  const moveToRegion = (region: Region | null) => {
    if (region && miniMapRef) {
      miniMapRef?.current?.animateToRegion(region, 500)
    }
  }

  //gets user region and moves map to them
  const followUser = () => moveToRegion(getRegionFromCoords())

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
    if (!centered) { setCentered(true) }
    followUser()
  }

  const stopCentering = () => {
    if (centered) { setCentered(false) }
  }

  //updates region reducer once map has stopped moving
  const onRegionChangeComplete = (region: Region) => {
    dispatch(setRegion(region))
  }

  const showError = (error: string) => {
    dispatch(setMessageState({
      type: 'err',
      messageContent: error,
      onOk: () => props.setModalVisibility(false)
    }))
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
                  ref={miniMapRef}
                  initialRegion={region}
                  provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                  maxZoomLevel={18.9}
                  minZoomLevel={5}
                  mapType={mapType === 'terrain' ? 'terrain' : mapType}
                  pitchEnabled={false}
                  rotateEnabled={false}
                  moveOnMarkerPress={false}
                  style={Os.gridModalMapViewStyle}
                  onPanDrag={() => stopCentering()}
                  onRegionChangeComplete={(region) => {
                    onRegionChangeComplete(region)
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
              </View>
              <View style={Cs.modalStartButtonContainer}>
                <ButtonComponent testID='center-map-btn' onPressFunction={async () => await centerMapAnim()} title={t('locate me')}
                  height={40} width={160} buttonStyle={Bs.locateMeButton}
                  gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                  textStyle={Ts.buttonText} iconName={'person-pin'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
                />
              </View>
              <View style={Cs.modalStartButtonContainer}>
                <ButtonComponent disabled={loading} onPressFunction={async () => await handleStartEvent()} title={t('start')}
                  height={40} width={120} buttonStyle={Bs.beginButton}
                  gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                  textStyle={Ts.buttonText} iconName={'play-arrow'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
                />
                <ButtonComponent onPressFunction={() => props.setModalVisibility(false)} title={t('cancel')}
                  height={40} width={120} buttonStyle={Bs.beginButton}
                  gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                  textStyle={Ts.buttonText} iconName={'cancel'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
                />
              </View>
            </>
          }
        </View>
      </View>
      <MessageComponent />
    </Modal>
  )
}

export default GridModalComponent