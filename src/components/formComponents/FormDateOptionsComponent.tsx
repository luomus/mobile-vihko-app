import React, { useState, useEffect } from 'react'
import { Text, TextInput, View } from 'react-native'
import { useSelector } from 'react-redux'
import { rootState } from '../../stores'
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
  const [showDate, setShowDate] = useState<boolean>(false)
  const [showTime, setShowTime] = useState<boolean>(false)
  const [differentDay, setDifferentDay] = useState<boolean>(true)
  const date = new Date()
  const dateBegin = watch('gatheringEvent_dateBegin')
  const dateEnd = watch('gatheringEvent_dateEnd')

  const observationEvent = useSelector((state: rootState) => state.observationEvent)

  const { t } = useTranslation()

  useEffect(() => {
    register(props.objectTitle)

    if (currentValue && currentValue !== '') {
      setValue(props.objectTitle, currentValue)
      setSelected(true)
    }

    //when observing in the same day as when the event was started, do not give option to pick date
    if (sameDay(observationEvent.events[observationEvent.events.length - 1].gatheringEvent.dateBegin, parseDateFromDateObjectToDocument(date))) {
      setDifferentDay(false)
    }
  }, [])

  //every time date and time change, combine them so both values are updated
  useEffect(() => {
    let combinedDate

    if (currentTime && currentDate) {
      combinedDate = currentDate.substring(0, 10) + 'T' + currentTime.substring(11, 16)
    } else {
      return
    }

    //check if dateEnd time is set to be before dateBegin
    //if so, set dateEnd to be equal with dateBegin
    if (props.objectTitle.includes('dateEnd') && Date.parse(dateBegin) > Date.parse(combinedDate)) {
      combinedDate = dateBegin
    }
    //check if dateBegin time is set to be after dateEnd
    //if so, set dateBegin to be equal with dateEnd
    if (props.objectTitle.includes('dateBegin') && Date.parse(combinedDate) > Date.parse(dateEnd)) {
      combinedDate = dateEnd
    }

    //set new value to register
    setValue(props.objectTitle, combinedDate)

    //set combined date as current value (which is shown to user)
    combinedDate !== '' ? setCurrentValue(combinedDate) : null
  }, [currentDate, currentTime])

  const onLockIntoCurrentDate = () => {
    setCurrentValue(parseDateFromDateObjectToDocument(date))
    onChangeDate({ type: 'set', nativeEvent: {} }, date)
    onChangeTime({ type: 'set', nativeEvent: {} }, date)
    setValue(props.objectTitle, parseDateFromDateObjectToDocument(date))
    setSelected(true)
  }

  const onChangeDate = (event: DateTimePickerEvent, date: Date | undefined) => {
    setShowDate(false)
    setShowTime(true)
    date !== undefined ? setCurrentDate(parseDateFromDateObjectToDocument(date)) : null
  }

  const onChangeTime = (event: DateTimePickerEvent, date: Date | undefined) => {

    setShowTime(false)

    //when date picker is not shown, set current date to be the same as current event's
    if ((date !== undefined) && !differentDay) {
      setCurrentDate(observationEvent.events[observationEvent.events.length - 1].gatheringEvent.dateBegin)
    }

    date !== undefined ? setCurrentTime(parseDateFromDateObjectToDocument(date)) : null

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

  return (
    <View style={Cs.formInputContainer}>
      <Text>{props.title}</Text>
      {!selected ?
        <View style={Cs.datePickerContainer}>
          <View style={Cs.padding5Container}>
            <ButtonComponent onPressFunction={() => onLockIntoCurrentDate()}
              title={t('timestamp')} height={40} width={120} buttonStyle={Bs.timeButton}
              gradientColorStart={Colors.primaryButton1} gradientColorEnd={Colors.primaryButton2} shadowColor={Colors.primaryShadow}
              textStyle={Ts.buttonText} iconName={'schedule'} iconType={'material-icons'} iconSize={22} contentColor={Colors.whiteText}
            />
          </View>
          <View style={Cs.padding5Container}>
            <ButtonComponent onPressFunction={() => { differentDay ? setShowDate(true) : setShowTime(true) }}
              title={t('choose time')} height={40} width={120} buttonStyle={Bs.timeButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'restore'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
          </View>
        </View>
        :
        <View style={Cs.datePickerContainer}>
          <TextInput
            style={Os.datePicker}
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
      {showDate && (
        <View>
          <DateTimePicker
            value={currentValue ? new Date(parseDateFromDocumentToFullISO(currentValue)) : date}
            mode='time'
            onChange={onChangeTime}
          />
          <DateTimePicker
            value={currentValue ? new Date(parseDateFromDocumentToFullISO(currentValue)) : date}
            mode='date'
            onChange={onChangeDate}
          />
        </View>
      )}
      {showTime && (
        <View>
          <DateTimePicker
            value={currentValue ? new Date(parseDateFromDocumentToFullISO(currentValue)) : date}
            mode='time'
            onChange={onChangeTime}
          />
        </View>
      )}
    </View>
  )
}

export default FormDateOptionsComponent