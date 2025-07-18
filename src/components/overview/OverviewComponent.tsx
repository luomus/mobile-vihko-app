import React, { useState, useEffect } from 'react'
import { ActionSheetIOS, FlatList, ListRenderItem, Platform, Text, View } from 'react-native'
import { useBackHandler } from '@react-native-community/hooks'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Bs from '../../styles/ButtonStyles'
import Colors from '../../styles/Colors'
import { useDispatch, useSelector } from 'react-redux'
import i18n from '../../languages/i18n'
import { biomonForms, forms } from '../../config/fields'
import {
  RootState,
  DispatchType,
  uploadObservationEvent,
  setMessageState,
  deleteObservation,
  deleteObservationEvent,
  logoutUser,
  switchSchema,
  resetReducer,
  setObservationId,
  setObservationEventId,
  setSingleObservation
} from '../../stores'
import { useTranslation } from 'react-i18next'
import ObservationInfoComponent from './ObservationInfoComponent'
import SendEventModalComponent from '../general/SendEventModalComponent'
import MessageComponent from '../general/MessageComponent'
import { parseDateFromDocumentToUI } from '../../helpers/dateHelper'
import LoadingComponent from '../general/LoadingComponent'
import ButtonComponent from '../general/ButtonComponent'
import storageService from '../../services/storageService'
import { log } from '../../helpers/logger'
import { captureException } from '../../helpers/sentry'
import SchemaObjectComponent from './SchemaObjectComponent'

type Props = {
  id: string,
  onPressHome: () => void,
  onPressObservation: (sourcePage?: string) => void,
  onPressObservationEvent: (sourcePage: string) => void,
  onPressSingleObservation: (rules?: Record<string, any>, defaults?: Record<string, any>, sourcePage?: string) => void,
  onLogout: () => void,
  isFocused: () => boolean,
  children?: JSX.Element | JSX.Element[]
}

const OverviewComponent = (props: Props) => {

  const [sending, setSending] = useState<boolean>(false)
  const [modalVisibility, setModalVisibility] = useState<boolean>(false)
  const [event, setEvent] = useState<Record<string, any> | null>(null)
  const [observations, setObservations] = useState<Record<string, any>[] | null>(null)
  const [eventSchema, setEventSchema] = useState<Record<string, any> | null>(null)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  const credentials = useSelector((state: RootState) => state.credentials)
  const observationEvent = useSelector((state: RootState) => state.observationEvent)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  useEffect(() => {
    const searchedEvent: Record<string, any> | null = observationEvent.events.find(e => e.id === props.id) || null
    let searchedObservations: Record<string, any>[] = searchedEvent?.gatherings[0]?.units || null

    setEvent(searchedEvent)

    if (searchedEvent && (searchedEvent.formID === forms.birdAtlas || Object.values(biomonForms).includes(searchedEvent.formID))) {
      const filteredObservations: Record<string, any>[] = []
      searchedObservations.forEach((observation) => {
        if (searchedEvent.formID === forms.birdAtlas && (!(observation.id.includes('complete_list') && !observation.atlasCode && !observation.count)) ||
          Object.values(biomonForms).includes(searchedEvent.formID) && (!(observation.id.includes('complete_list') && !observation.count))) {
          filteredObservations.push(observation)
        }
      })
      searchedObservations = filteredObservations
    }

    setObservations(searchedObservations)

    dispatch(setSingleObservation(searchedEvent?.singleObservation ? true : false))

    const lang = i18n.language

    const initEventSchema = async () => {
      if (searchedEvent === null) { return }
      const fetchedSchema = await storageService.fetch(`${searchedEvent.formID}${lang.charAt(0).toUpperCase() + lang.slice(1)}`)
      setEventSchema(fetchedSchema)
      await dispatch(switchSchema({ formID: searchedEvent.formID, lang })).unwrap()
      dispatch(setObservationEventId(searchedEvent?.id))
    }

    initEventSchema()
  }, [observationEvent])

  const showDeleteObservation = (eventId: string, unitId: string) => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('remove observation?'),
      cancelLabel: t('do not delete'),
      okLabel: t('delete'),
      onOk: () => handleDeleteObservation(eventId, unitId)
    }))
  }

  const handleDeleteObservation = async (eventId: string, unitId: string) => {
    try {
      await dispatch(deleteObservation({ eventId, unitId })).unwrap()
    } catch (error: any) {
      captureException(error)
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message
      }))
    }
  }

  const showDeleteObservationEvent = (eventId: string) => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('remove observation event?'),
      cancelLabel: t('do not delete'),
      okLabel: t('delete'),
      onOk: () => handleDeleteObservationEvent(eventId)
    }))
  }

  const handleDeleteObservationEvent = async (eventId: string) => {
    try {
      await dispatch(deleteObservationEvent({ eventId })).unwrap()
      props.onPressHome()
    } catch (error: any) {
      captureException(error)
      dispatch(setMessageState({
        type: 'err',
        messageContent: error.message
      }))
    }
  }

  const sendDocument = async (isPublic: boolean) => {
    setModalVisibility(false)
    setSending(true)
    try {
      if (!event) {
        throw {
          severity: 'low',
          message: `${i18n.t('failed to load credentials from local')}`
        }
      }
      await dispatch(uploadObservationEvent({ event, lang: i18n.language, isPublic })).unwrap()
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        props.onPressHome()
        setSending(false)
      }, 2000)
    } catch (error: any) {
      captureException(error)
      if (error.severity === 'low') {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => {
            setShowSuccess(true)
            setTimeout(() => {
              setShowSuccess(false)
              props.onPressHome()
              setSending(false)
            }, 2000)
          }
        }))
        //log user out from the app if the token has expired
      } else {
        dispatch(setMessageState({
          type: 'err',
          messageContent: error.message,
          onOk: () => {
            props.onLogout()
            dispatch(logoutUser()).unwrap()
            dispatch(resetReducer())
            setSending(false)
          }
        }))
      }
    }
  }

  const handleBugReport = () => {
    dispatch(setMessageState({
      type: 'conf',
      messageContent: t('bug report description'),
      cancelLabel: t('do not submit'),
      okLabel: t('submit'),
      onOk: () => {
        log.error({
          location: '/components/overview/OverviewComponent.tsx handleBugReport()',
          error: 'Bug Report',
          data: event,
          user_id: credentials.user?.id
        })
      }
    }))
  }

  const displayDateBegin = () => {
    if (event?.gatheringEvent?.timeStart) {
      return parseDateFromDocumentToUI(event.gatheringEvent.dateBegin + 'T' + event.gatheringEvent.timeStart)
    } else {
      return parseDateFromDocumentToUI(event?.gatheringEvent.dateBegin)
    }
  }

  const displayDateEnd = () => {
    if (event?.gatheringEvent?.timeStart) {
      return parseDateFromDocumentToUI(event.gatheringEvent.dateEnd + 'T' + event.gatheringEvent.timeEnd)
    } else {
      return parseDateFromDocumentToUI(event?.gatheringEvent.dateEnd)
    }
  }

  //override back button to point to home screen in all cases
  useBackHandler(() => {
    if (props.isFocused()) {
      props.onPressHome()
      return true
    }
    return false
  })

  const onPressOptionsIOS = async () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [t('send private'), t('cancel')],
        cancelButtonIndex: 1
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          await sendDocument(false)
        }
      }
    )

  const renderObservation: ListRenderItem<Record<string, any>> = ({ item }) => {

    if (!event || !eventSchema) return null

    return (
      <View key={item.id}>
        <ObservationInfoComponent
          event={event}
          observation={item}
          eventSchema={eventSchema}
          editButton={
            <ButtonComponent
              onPressFunction={
                () => {
                  dispatch(setObservationId(item.id))
                  dispatch(setObservationEventId(event.id))
                  event.singleObservation
                    ? props.onPressSingleObservation(undefined, undefined, 'overview')
                    : props.onPressObservation('overview')
                }}
              title={t('edit')} height={40} width={120} buttonStyle={Bs.textAndIconButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={'edit'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
            />
          }
          removeButton={
            <ButtonComponent
              onPressFunction={
                () => {
                  event.singleObservation
                    ? showDeleteObservationEvent(event.id)
                    : showDeleteObservation(event.id, item.id)
                }}
              title={t('remove')} height={40} width={120} buttonStyle={Bs.textAndIconButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'delete'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
          }
        />
        <View style={{ padding: 5 }}></View>
      </View>
    )
  }

  const ListHeader = () => {
    if (event) {
      return (
        <View style={Cs.overviewContentContainer}>
          <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row' }}>
            <ButtonComponent onPressFunction={() => handleBugReport()} title={t('bug report')}
              height={40} width={140} buttonStyle={Bs.eventOptionsButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'bug-report'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
          </View>
          {event.singleObservation ? null :
            <>
              <Text style={Ts.overviewHeader}>{t('observation event')}</Text>
              <View style={{ backgroundColor: Colors.neutral5, width: '100%', borderRadius: 5 }}>
                <View style={Cs.overviewTextContainer}>
                  {event.gatherings[0].locality ?
                    <SchemaObjectComponent title={t('locality')} value={event.gatherings[0].locality} />
                    : null
                  }
                  {event.gatherings[0].locality ?
                    <SchemaObjectComponent title={t('locality description')} value={event.gatherings[0].localityDescription} />
                    : null
                  }
                  <SchemaObjectComponent title={t('date begin')} value={displayDateBegin()} />
                  <SchemaObjectComponent title={t('date end')} value={displayDateEnd()} />
                </View>
                <View style={Cs.overviewButtonsContainer}>
                  <ButtonComponent
                    onPressFunction={() => {
                      dispatch(setObservationEventId(event.id))
                      props.onPressObservationEvent('overview')
                    }}
                    title={t('edit')} height={40} width={120} buttonStyle={Bs.eventOptionsButton}
                    gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
                    textStyle={Ts.buttonText} iconName={'edit'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
                  />
                  <ButtonComponent onPressFunction={() => showDeleteObservationEvent(event.id)} title={t('delete')}
                    height={40} width={120} buttonStyle={Bs.eventOptionsButton}
                    gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                    textStyle={Ts.buttonText} iconName={'delete'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
                  />
                </View>
              </View>
            </>
          }
          <Text style={Ts.overviewHeader}>{event.singleObservation ? t('single observation') : t('observations')}</Text>
        </View>
      )
    } else {
      return <></>
    }
  }

  if (sending) {
    return (
      <LoadingComponent text={showSuccess ? t('post success') : t('sending')} completed={showSuccess} />
    )
  } else if (!event || !observations || !eventSchema) {
    return (
      <LoadingComponent text={t('loading')} />
    )
  } else {
    return (
      <>
        <View style={Cs.formSaveButtonContainer}>
          <ButtonComponent onPressFunction={async () => { Platform.OS === 'ios' ? await onPressOptionsIOS() : setModalVisibility(true) }}
            title={undefined} height={40} width={40} buttonStyle={Bs.mapIconButton}
            gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={'more-vert'} iconType={'material-icons'} iconSize={26} contentColor={Colors.darkText}
          />
          <ButtonComponent onPressFunction={() => props.onPressHome()}
            title={t('cancel')} height={40} width={90} buttonStyle={Bs.editObservationButton}
            gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={22} contentColor={Colors.darkText}
          />
          <ButtonComponent
            onPressFunction={async () => { await sendDocument(true) }}
            testID={'saveButton'}
            title={t('send public')} height={40} width={160} buttonStyle={Bs.editObservationButton}
            gradientColorStart={Colors.successButton1} gradientColorEnd={Colors.successButton2} shadowColor={Colors.successShadow}
            textStyle={Ts.buttonText} iconName={undefined} iconType={undefined} iconSize={22} contentColor={Colors.whiteText}
          />
        </View>
        <FlatList
          data={observations}
          renderItem={renderObservation}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={<Text>{t('no observations')}</Text>}
          style={Cs.overviewBaseContainer}
        />
        {props.children}
        <SendEventModalComponent modalVisibility={modalVisibility} setModalVisibility={setModalVisibility}
          onSendPrivate={async () => await sendDocument(false)}
          onCancel={() => setModalVisibility(false)} cancelTitle={t('cancel')}
          setConfirmationModalVisibility={undefined} eventId={event.id} />
        <MessageComponent />
      </>
    )
  }
}

export default OverviewComponent