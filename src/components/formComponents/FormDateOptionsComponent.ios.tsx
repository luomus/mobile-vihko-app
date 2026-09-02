import React, { useState, useEffect, useRef } from 'react'
import { Modal, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { DispatchType, RootState, setMessageState } from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import Os from '../../styles/OtherStyles'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { parseDateFromDocumentToUI, parseDateFromDocumentToFullISO, parseDateFromDateObjectToDocument, sameDay } from '../../helpers/dateHelper'
import Colors from '../../styles/Colors'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props {
  title: string,
  objectTitle: string,
  parentObjectTitle: string,
  keyboardType:
  'default' |
  'email-address' |
  'numeric' |
  'phone-pad' |
  'visible-password' |
  'ascii-capable' |
  'numbers-and-punctuation' |
  'url' |
  'number-pad' |
  'name-phone-pad' |
  'decimal-pad' |
  'twitter' |
  'web-search' |
  undefined,
  defaultValue: string,
  isArrayItem: boolean,
  parentCallback: ((childValue: any) => void) | undefined,
}

const FormDateOptionsComponent = (props: Props) => {
  const { register, setValue, watch } = useFormContext()
  const [currentValue, setCurrentValue] = useState<string>(props.defaultValue)
  const [currentDate, setCurrentDate] = useState<string>(props.defaultValue)
  const [currentTime, setCurrentTime] = useState<string>(props.defaultValue)
  const [selected, setSelected] = useState<boolean>(false)
  const [differentDay, setDifferentDay] = useState<boolean>(true)
  const [modalVisibility, setModalVisibility] = useState<boolean>(false)
  const hasCorrectedFutureDateRef = useRef<boolean>(false)

  const date = new Date()
  const dateBegin = watch('gatheringEvent_dateBegin')
  const dateEnd = watch('gatheringEvent_dateEnd')

  const observationEvent = useSelector((state: RootState) => state.observationEvent)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  useEffect(() => {
    register(props.objectTitle)

    if (currentValue && currentValue !== '') {
      setValue(props.objectTitle, currentValue)
      setSelected(true)
    }

    //when observing in the same day as when the event was started, do not give option to pick date
    if (sameDay(observationEvent.events[observationEvent.events.length - 1]?.gatheringEvent?.dateBegin, parseDateFromDateObjectToDocument(date))) {
      setDifferentDay(false)
    }
  }, [])

  //every time date and time change, combine them so both values are updated
  useEffect(() => {
    let combinedDate

    if (currentTime && currentDate) {
      combinedDate = currentDate?.substring(0, 10) + 'T' + currentTime?.substring(11, 16)
    } else {
      return
    }

    if (Date.parse(combinedDate) > date.getTime()) {
      combinedDate = parseDateFromDateObjectToDocument(date)
      // iOS fixes future date on first attempt
      if (hasCorrectedFutureDateRef.current) {
        onInvalidDate(t('time cannot be in the future'))
      } else {
        hasCorrectedFutureDateRef.current = true
      }
    }

    if (props.objectTitle.includes('dateEnd') && Date.parse(dateBegin) > Date.parse(combinedDate)) {
      combinedDate = dateBegin
      onInvalidDate(t('ended before starting'))
    }

    if (props.objectTitle.includes('dateBegin') && Date.parse(combinedDate) > Date.parse(dateEnd)) {
      combinedDate = dateEnd
      onInvalidDate(t('started after ending'))
    }

    setValue(props.objectTitle, combinedDate)

    if (combinedDate !== '') {
      setCurrentValue(combinedDate)
    }
  }, [currentDate, currentTime])

  const onLockIntoCurrentDate = () => {
    setCurrentValue(parseDateFromDateObjectToDocument(date))
    onChangeDate({ type: 'set', nativeEvent: { timestamp: 1, utcOffset: 1 } }, date)
    onChangeTime({ type: 'set', nativeEvent: { timestamp: 1, utcOffset: 1 } }, date)
    setValue(props.objectTitle, parseDateFromDateObjectToDocument(date))
    setSelected(true)
  }

  const onChangeDate = (event: DateTimePickerEvent, date: Date | undefined) => {
    if (date !== undefined) {
      setCurrentDate(parseDateFromDateObjectToDocument(date))
    }
  }

  const onChangeTime = (event: DateTimePickerEvent, date: Date | undefined) => {

    //when date picker is not shown, set current date to be the same as current event's
    if ((date !== undefined) && !differentDay) {
      setCurrentDate(observationEvent.events[observationEvent.events.length - 1].gatheringEvent.dateBegin)
    }

    if (date !== undefined) {
      setCurrentTime(parseDateFromDateObjectToDocument(date))
    }

    if (date !== undefined) {
      setSelected(true)

      // if user cancels when choosing time of dateBegin, do not add any date
    } else {
      setSelected(false)
      setValue(props.objectTitle, '')
    }
  }

  const clearDateAndTime = () => {
    setSelected(false)
    setValue(props.objectTitle, '')
  }

  const onInvalidDate = (message: string) => {
      dispatch(setMessageState({
        type: 'err',
        messageContent: message,
        backdropOpacity: 0.3
      }))
    }

  return (
    <View style={Cs.formInputContainer}>
      <Text>{props.title}</Text>
      {!selected ?
        <View style={Cs.datePickerOptionsContainer}>
          <ButtonComponent onPressFunction={() => onLockIntoCurrentDate()}
            title={t('timestamp')} height={40} width={120} buttonStyle={Bs.timeButton}
            gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
            textStyle={Ts.buttonText} iconName={'schedule'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
          />
          <ButtonComponent onPressFunction={() => setModalVisibility(true)}
            title={t('choose time')} height={40} width={120} buttonStyle={Bs.timeButton}
            gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={'restore'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
          />
        </View>
        :
        <View style={Cs.datePickerContainer}>
          <TextInput
            style={Os.dateOptionsPicker}
            value={parseDateFromDocumentToUI(currentValue)}
            editable={false}
          />
          <ButtonComponent onPressFunction={() => clearDateAndTime()}
            title={undefined} height={40} width={45} buttonStyle={Bs.iconButton}
            gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={'delete'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
          />
        </View>
      }
      <Modal visible={modalVisibility} onRequestClose={() => { setModalVisibility(false) }}>
        <TouchableWithoutFeedback onPress={() => { setModalVisibility(false) }}>
          <View style={Cs.transparentModalContainer}>
            <TouchableWithoutFeedback>
              <View style={Cs.iOSDatePickerContainer}>
                {
                  differentDay ?
                    <View style={Cs.padding5Container}>
                      <DateTimePicker
                        value={currentValue ? new Date(parseDateFromDocumentToFullISO(currentValue)) : date}
                        mode='time'
                        onChange={onChangeTime}
                      />
                    </View>
                    : null
                }
                <View style={Cs.padding5Container}>
                  <DateTimePicker
                    value={currentValue ? new Date(parseDateFromDocumentToFullISO(currentValue)) : date}
                    mode='time'
                    onChange={onChangeTime}
                  />
                </View>
                <ButtonComponent onPressFunction={() => setModalVisibility(false)}
                  title={t('save')} height={40} width={120} buttonStyle={Bs.textAndIconButton}
                  gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                  textStyle={Ts.buttonText} iconName={'edit'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default FormDateOptionsComponent