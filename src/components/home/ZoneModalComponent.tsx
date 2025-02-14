import React, { useEffect, useState } from 'react'
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import Checkbox from 'expo-checkbox'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  RootState,
  DispatchType,
  setCurrentObservationZone,
  initObservationZones,
  setTracking,
  switchSchema,
  setMessageState,
  updateLocation
} from '../../stores'
import storageService from '../../services/storageService'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import i18n from '../../languages/i18n'
import ZoneFilterPickerComponent from './ZoneFilterPickerComponent'
import { getCurrentLocation } from '../../helpers/geolocationHelper'
import { captureException } from '../../helpers/sentry'
import { forms } from '../../config/fields'
import MessageComponent from '../general/MessageComponent'

type Props = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  onBeginObservationEvent: (tracking: boolean) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const ZoneModalComponent = (props: Props) => {

  const [shown, setShown] = useState<boolean>(false)
  const [options, setOptions] = useState<{ key: string, label: string }[]>([])
  const [initializing, setInitializing] = useState<boolean>(true)
  const [namedPlaceLabels, setNamedPlaceLabels] = useState<
    {
      tagSuitable: string | undefined,
      siteClassification: string | undefined,
      namedPlaceNotes: string | undefined
    }
  >()
  const [namedPlaceState, setNamedPlaceState] = useState<
    {
      label: string | undefined,
      tagSuitable: string | undefined,
      siteClassification: string | undefined,
      namedPlaceNotes: string | undefined
    }
  >()

  const observationZone = useSelector((state: RootState) => state.observationZone)
  const schema = useSelector((state: RootState) => state.schema)
  const tracking = useSelector((state: RootState) => state.tracking)

  const { t } = useTranslation()

  const dispatch: DispatchType = useDispatch()

  useEffect(() => {
    setInitializing(true)

    const initLocation = async () => {
      if (props.modalVisibility) {
        try {
          const location = await getCurrentLocation(false, 5)
          dispatch(updateLocation(location))
        } catch (error: any) {
          showError(error.message)
        }
      }
    }

    initLocation()

    const initZones = async () => {
      await refreshZonesList()
    }

    const initLolifeSchema = async () => {
      await dispatch(switchSchema({ formID: forms.lolife, lang: i18n.language })).unwrap()
      setInitializing(false)
    }

    if (props.modalVisibility === true && observationZone.zones.length < 1) {
      initZones()
    }

    if (props.modalVisibility === true) {
      if (schema.formID !== forms.lolife || schema[i18n.language] === null) {
        initLolifeSchema()
      } else {
        setInitializing(false)
      }
    }
  }, [props.modalVisibility])

  useEffect(() => {
    setOptions(createZonesList())

  }, [i18n.language, observationZone.zones])

  useEffect(() => {
    if (!initializing) {
      const tagSuitable = undefined
      const siteClassification = schema[i18n.language]?.schema?.properties?.gatheringEvent?.properties?.gatheringFact?.properties?.lolifeSiteClassification?.title
      const namedPlaceNotes = schema[i18n.language]?.schema?.properties?.gatheringEvent?.properties?.namedPlaceNotes?.title

      setNamedPlaceLabels({
        tagSuitable,
        siteClassification,
        namedPlaceNotes
      })

      setInitializing(true)
    }
  }, [initializing])

  useEffect(() => {
    if (!initializing) return

    const currentZone = observationZone.zones.find(zone => zone.id === observationZone.currentZoneId)
    const lolifeSiteClassificationEnum = schema[i18n.language]?.schema?.properties?.gatheringEvent?.properties?.gatheringFact?.properties?.lolifeSiteClassification?.oneOf

    const label = currentZone?.label
    const tagSuitable = undefined
    const namedPlaceNotes = currentZone?.prepopulatedDocument?.gatheringEvent?.namedPlaceNotes
    const siteClassification = lolifeSiteClassificationEnum
      ? lolifeSiteClassificationEnum.find((classification: { const: string, value: string }) =>
        classification.const === currentZone?.prepopulatedDocument?.gatheringEvent?.gatheringFact?.lolifeSiteClassification)?.title
      : undefined

    setNamedPlaceState({
      label,
      tagSuitable,
      namedPlaceNotes,
      siteClassification
    })
  }, [i18n.language, observationZone.currentZoneId, initializing])

  const createZonesList = () => {
    if (observationZone.zones.length <= 0) {
      return [{
        key: undefined,
        label: ''
      }]
    } else {
      return observationZone.zones.map((region: Record<string, any>) => {
        return {
          key: region.id,
          label: region.name === '' ? t('no zone') : region.name
        }
      })
    }
  }

  const refreshZonesList = async () => {
    try {
      props.setLoading(true)
      await dispatch(initObservationZones()).unwrap()
    } catch (error: any) {
      captureException(error)
      showError(error.message)
    } finally {
      props.setLoading(false)
    }
  }

  const handleStartEvent = () => {
    props.setModalVisibility(false)
    props.onBeginObservationEvent(tracking)
  }

  const showError = (error: string) => {
    dispatch(setMessageState({
      type: 'err',
      messageContent: error
    }))
  }

  return (
    <Modal visible={props.modalVisibility} onRequestClose={() => { props.setModalVisibility(false) }}>
      <TouchableWithoutFeedback onPress={() => { props.setModalVisibility(false) }}>
        <View style={Cs.newModalContainer}>
          <TouchableWithoutFeedback>
            <View style={Cs.zoneModalContainer}>
              <Text style={Ts.homeScreenTitle}>
                {t('new observation event')}
              </Text>
              <Text style={Ts.zonePickerDescription}>
                {t('zone picker description')}
              </Text>
              {
                namedPlaceLabels?.tagSuitable && namedPlaceState?.tagSuitable ?
                  <>
                    <Text style={Ts.zonePickerLabel}>{namedPlaceLabels.tagSuitable}</Text>
                    <Text style={Ts.zonePickerDescription}>{namedPlaceState.tagSuitable}</Text>
                  </>
                  : null
              }
              {
                namedPlaceLabels?.siteClassification && namedPlaceState?.siteClassification ?
                  <>
                    <Text style={Ts.zonePickerLabel}>{namedPlaceLabels.siteClassification}</Text>
                    <Text style={Ts.zonePickerDescription}>{namedPlaceState?.siteClassification}</Text>
                  </>
                  : null
              }
              {
                namedPlaceLabels?.namedPlaceNotes && namedPlaceState?.namedPlaceNotes ?
                  <>
                    <Text style={Ts.zonePickerLabel}>{namedPlaceLabels.namedPlaceNotes}</Text>
                    <Text style={Ts.zonePickerDescription}>{namedPlaceState.namedPlaceNotes}</Text>
                  </>
                  : null
              }
              <View style={Cs.zoneEventLauncherContainer}>
                <View style={Cs.zonePickerContainer}>
                  <TouchableOpacity onPress={() => setShown(true)}>
                    <Text style={{ alignSelf: 'flex-start', fontSize: 16, padding: 8 }}>{options.find((option) => option.key === observationZone.currentZoneId)?.label}</Text>
                  </TouchableOpacity>
                  <ZoneFilterPickerComponent
                    visible={shown}
                    onSelect={(key: string) => {
                      dispatch(setCurrentObservationZone(key))
                      setShown(false)
                    }}
                    onCancel={() => setShown(false)}
                    options={options}
                    selectedOption={observationZone.currentZoneId}
                    placeholderText={t('choose observation zone')}
                  />
                </View>
                <ButtonComponent onPressFunction={() => refreshZonesList()} title={undefined}
                  height={40} width={40} buttonStyle={Bs.refreshButton}
                  gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                  textStyle={Ts.buttonText} iconName={'refresh'} iconType={'material-community'} iconSize={22} contentColor={Colors.darkText}
                />
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
                <ButtonComponent onPressFunction={() => handleStartEvent()} title={t('start')}
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
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      <MessageComponent />
    </Modal>
  )
}

export default ZoneModalComponent