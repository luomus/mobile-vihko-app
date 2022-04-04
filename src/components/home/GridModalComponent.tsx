import React, { useEffect, useState } from 'react'
import { Linking, View, Text, TextInput, ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  DispatchType,
  setGrid
} from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Os from '../../styles/OtherStyles'
import Colors from '../../styles/Colors'
import { convertWGS84ToYKJ, getCurrentLocation, YKJCoordinateIntoWGS84Grid } from '../../helpers/geolocationHelper'
import { gridPreview } from '../../config/urls'
import { getGridName } from '../../services/atlasService'

type Props = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  onBeginObservationEvent: (zoneUsed: boolean) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  showError: (error: string) => void
}

const GridModalComponent = (props: Props) => {

  const { t } = useTranslation()
  const dispatch: DispatchType = useDispatch()
  const [ownLocation, setOwnLocation] = useState<[number, number]>([373, 777])
  const [gridName, setGridName] = useState<string>('')
  const [gridCoords, setGridCoords] = useState<[number, number]>([373, 777])
  const [northing, setNorthing] = useState<string>('000')
  const [easting, setEasting] = useState<string>('000')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const setLocation = async () => {
      let location
      try {
        setLoading(true)
        location = await getCurrentLocation()
      } catch (err) {
        props.setModalVisibility(false)
        props.showError(`${t('unable to get current location')}: ${err}`)
        setLoading(false)
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

      setLoading(false)
    }

    if (props.modalVisibility) {
      setLocation()
    }
  }, [props.modalVisibility])

  const handleStartEvent = () => {
    const n = parseInt(northing)
    const e = parseInt(easting)

    if (n < 661 || n > 777 || e < 306 || e > 373) {
      props.setModalVisibility(false)
      props.showError(t('current location out of ykj bounds'))
      return
    }

    props.setModalVisibility(false)

    if (e === Math.trunc(ownLocation[0] / 10000) && n === Math.trunc(ownLocation[1] / 10000)) {
      dispatch(setGrid({
        n: n,
        e: e,
        geometry: YKJCoordinateIntoWGS84Grid(gridCoords[0], gridCoords[1]),
        pauseGridCheck: false
      }))
    } else {
      dispatch(setGrid({
        n: n,
        e: e,
        geometry: YKJCoordinateIntoWGS84Grid(gridCoords[0], gridCoords[1]),
        pauseGridCheck: true
      }))
    }

    props.onBeginObservationEvent(false)
  }

  return (
    <Modal isVisible={props.modalVisibility} backdropOpacity={10} onBackButtonPress={() => { props.setModalVisibility(false) }}
      onBackdropPress={() => { props.setModalVisibility(false) }}>
      <View style={Cs.modalContainer}>
        <View style={{ alignSelf: 'flex-start' }}>
          <Text style={Ts.homeScreenTitle}>
            {t('new trip')}
          </Text>
          {loading ?
            <ActivityIndicator size={25} color={Colors.primary5} /> :
            <>
              <View style={Cs.gridModalElementContainer}>
                <Text>
                  {`${t('your current location is')} ${ownLocation[1].toString().slice(0, 3)}:${ownLocation[0].toString().slice(0, 3)}, ${gridName}.\n\n`}
                  <Text
                    style={{ color: Colors.linkText }}
                    onPress={() => Linking.openURL(gridPreview + `${ownLocation[1].toString().slice(0, 3)}:${ownLocation[0].toString().slice(0, 3)}`)}>
                    {t('link to grid')}
                  </Text>
                  {`\n\n${t('grid selection instructions')}`}
                </Text>
              </View>
              <View style={Cs.gridModalElementContainer}>
                <TextInput
                  style={Os.coordinateInput}
                  keyboardType='numeric'
                  value={northing}
                  onChangeText={setNorthing}
                />
                <TextInput
                  style={Os.coordinateInput}
                  keyboardType='numeric'
                  value={easting}
                  onChangeText={setEasting}
                />
              </View>
              <View style={Cs.modalStartButtonContainer}>
                <View style={Cs.padding5Container}>
                  <ButtonComponent disabled={loading} onPressFunction={() => handleStartEvent()} title={t('beginObservation')}
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