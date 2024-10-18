import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { LatLng } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import { convertLatLngToPoint } from '../../../helpers/geoJSONHelper'
import {
  RootState,
  DispatchType,
  clearObservationLocation,
  deleteObservation,
  setEditing,
  setMessageState,
  setObservationId,
  setObservationLocation
} from '../../../stores'
import ExtendedNavBarComponent from '../../general/ExtendedNavBarComponent'
import MessageComponent from '../../general/MessageComponent'
import MapModalComponent from '../MapModalComponent'
import ObservationButtonsComponent from '../ObservationButtonsComponent'
import Bs from '../../../styles/ButtonStyles'
import Cs from '../../../styles/ContainerStyles'
import Ts from '../../../styles/TextStyles'
import Colors from '../../../styles/Colors'
import { useTranslation } from 'react-i18next'
import ButtonComponent from '../../general/ButtonComponent'
import { captureException } from '../../../helpers/sentry'
import LoadingComponent from '../../general/LoadingComponent'

type Props = {
  onPressHome: () => void,
  onPressObservation: (rules?: Record<string, any>, defaults?: Record<string, any>, sourcePage?: string) => void,
  onPressEditing: (sourcePage?: string) => void,
  onPressFinishObservationEvent: (sourcePage: string) => void,
  onPop: () => void,
  onPressList: () => void
}

const MapComponent = (props: Props) => {

  const [loading, setLoading] = useState<boolean>(false)
  const [mapModalVisibility, setMapModalVisibility] = useState(false)
  const [observationButtonsState, setObservationButtonsState] = useState('')
  const [observationOptions, setObservationOptions] = useState<Record<string, any>[]>([])

  const editing = useSelector((state: RootState) => state.editing)
  const observation = useSelector((state: RootState) => state.observation)
  const observationEventId = useSelector((state: RootState) => state.observationEventId)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  useEffect(() => {
    if (editing.started) {
      setObservationButtonsState('changeLocation')
    } else {
      setObservationButtonsState('newObservation')
    }
  }, [editing])

  const markObservationToPredeterminedPoint = () => {
    markObservation({
      'latitude': 60.17102521395383,
      'longitude': 24.931066744029522
    })
    // markObservation({
    //   'latitude': 60.172393204816956,
    //   'longitude': 24.93204776197672
    // })
  }

  const markObservation = (coordinate: LatLng) => {
    const point = convertLatLngToPoint(coordinate)
    dispatch(setObservationLocation(point))
  }

  const changeObservationLocation = () => {
    dispatch(setEditing({
      started: true,
      locChanged: true,
      originalLocation: editing.originalLocation,
      originalSourcePage: editing.originalSourcePage
    }))
    props.onPressEditing()
  }

  const cancelObservation = () => {
    dispatch(clearObservationLocation())
  }

  const shiftToEditPage = (unitId: string) => {
    setMapModalVisibility(false)
    cancelObservation()
    dispatch(setObservationId(unitId))
    props.onPressEditing('map')
  }

  const showSubmitDelete = (unitId: string) => {
    setMapModalVisibility(false)
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('remove observation?'),
      onOk: () => submitDelete(unitId),
      okLabel: t('delete')
    }))
  }

  const cancelEdit = () => {
    dispatch(setEditing({
      started: false,
      locChanged: false,
      originalLocation: editing.originalLocation,
      originalSourcePage: editing.originalSourcePage
    }))
    props.onPressEditing()
  }

  const submitDelete = async (unitId: string) => {
    try {
      await dispatch(deleteObservation({ eventId: observationEventId, unitId })).unwrap()
    } catch (error: any) {
      captureException(error)
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message
      }))
    }
  }

  const openMapModal = (units: Array<Record<string, any>>): void => {
    cancelObservation()
    //gets the list of nearby observations and saves them to a state, so they can be rendered in the modal
    setObservationOptions(units)
    setMapModalVisibility(true)
  }

  const closeMapModal = (): void => {
    setMapModalVisibility(false)
  }

  if (loading) {
    return (
      <LoadingComponent text={'loading'} />
    )
  } else {
    return (
      <>
        <ExtendedNavBarComponent onPressHome={props.onPressHome} onPressMap={undefined} onPressList={props.onPressList}
          onPressFinishObservationEvent={props.onPressFinishObservationEvent} setLoading={setLoading}
          observationButtonsState={observationButtonsState} />
        <View style={Cs.mapContainer} testID={'extendedNavBar'}>
          <ButtonComponent onPressFunction={() => markObservationToPredeterminedPoint()} title={'Merkitse piste'}
            height={40} width={120} buttonStyle={Bs.observationButton}
            gradientColorStart={Colors.primaryButton1}
            gradientColorEnd={Colors.primaryButton2}
            shadowColor={Colors.primaryShadow}
            textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={22}
            contentColor={Colors.whiteText}
          />
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
        </View>
      </>
    )
  }
}

export default MapComponent