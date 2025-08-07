import React, { useState, useEffect } from 'react'
import { Text, TextInput, View } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DispatchType, RootState, setMessageState } from '../../stores'
import Os from '../../styles/OtherStyles'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import ButtonComponent from '../general/ButtonComponent'
import { parseDateFromDocumentToUI, parseDateFromDocumentToFullISO, parseDateFromDateObjectToDocument } from '../../helpers/dateHelper'
import Colors from '../../styles/Colors'
import { ErrorMessage } from '@hookform/error-message'

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
  pickerType: string | undefined,
  validation?: Record<string, any>
}

const FormDatePickerComponent = (props: Props) => {
  const { register, setValue, formState, watch } = useFormContext()
  const [currentValue, setCurrentValue] = useState<string>(props.defaultValue)
  const [currentDate, setCurrentDate] = useState<string>(props.defaultValue)
  const [currentTime, setCurrentTime] = useState<string>(props.defaultValue)
  const [showDate, setShowDate] = useState<boolean>(false)
  const [showTime, setShowTime] = useState<boolean>(false)
  const date = new Date()
  const dateBegin = watch('gatheringEvent_dateBegin')
  const dateEnd = watch('gatheringEvent_dateEnd')
  const timeStart = watch('gatheringEvent_timeStart')
  const timeEnd = watch('gatheringEvent_timeEnd')

  const singleObservation = useSelector((state: RootState) => state.singleObservation)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  useEffect(() => {
    if (props.validation) {
      register(props.objectTitle, props.validation)
    } else {
      register(props.objectTitle)
    }

    if (singleObservation && props.objectTitle.includes('dateEnd') && !props.defaultValue) {
      clearDatePicker()
    } else if (!currentValue || currentValue === '') {
      initDatePicker()
    } else {
      setValue(props.objectTitle, currentValue)
    }
  }, [])

  useEffect(() => {
    let combinedDate

    if (!props.pickerType) {
      combinedDate = currentDate.substring(0, 10) + 'T' + currentTime.substring(11, 16)
    } else if (props.pickerType === 'date') {
      combinedDate = currentDate
    } else {
      combinedDate = currentTime
    }

    if (combinedDate === 'T') { // missing current date and time
      combinedDate = ''
    } else if (combinedDate.charAt(combinedDate.length - 1) === 'T') { // missing current time
      combinedDate = combinedDate + date.getHours() + ':' + date.getMinutes()
    } else if (props.objectTitle.includes('dateEnd') && Date.parse(dateBegin) > Date.parse(combinedDate)) { // dateEnd is earlier than dateBegin
      combinedDate = dateBegin
      onInvalidDate(t('ended before starting'))
    } else if (props.objectTitle.includes('dateBegin') && Date.parse(combinedDate) > Date.parse(dateEnd)) { // dateBegin is later than dateEnd
      combinedDate = dateEnd
      onInvalidDate(t('started after ending'))
    } else if (props.objectTitle.includes('time') && Date.parse(dateBegin) === Date.parse(dateEnd)) {
      if (props.objectTitle.includes('End') && Date.parse(dateBegin + 'T' + timeStart) > Date.parse(dateEnd + 'T' + combinedDate)) { // timeEnd is earlier than timeStart
        combinedDate = timeStart
        onInvalidDate(t('ended before starting'))
      } else if (props.objectTitle.includes('Start') && Date.parse(dateBegin + 'T' + combinedDate) > Date.parse(dateEnd + 'T' + timeEnd)) { // timeStart is later than timeEnd
        combinedDate = timeEnd
        onInvalidDate(t('started after ending'))
      }
    }

    setValue(props.objectTitle, combinedDate)

    if (combinedDate !== '') {
      setCurrentValue(combinedDate)
    }
  }, [currentDate, currentTime])

  const initDatePicker = () => {
    setCurrentValue(parseDateFromDateObjectToDocument(date, props.pickerType))
    setCurrentDate(parseDateFromDateObjectToDocument(date, props.pickerType))
    setCurrentTime(parseDateFromDateObjectToDocument(date, props.pickerType))
    setValue(props.objectTitle, parseDateFromDateObjectToDocument(date, props.pickerType))
  }

  const clearDatePicker = () => {
    setCurrentValue('')
    setValue(props.objectTitle, '')
  }

  const onChangeDate = (event: DateTimePickerEvent, date: Date | undefined) => {
    setShowDate(false)
    if (props.pickerType !== 'date') {
      setShowTime(true)
    }
    if (date !== undefined) {
      setCurrentDate(parseDateFromDateObjectToDocument(date, props.pickerType))
    }
  }

  const onChangeTime = (event: DateTimePickerEvent, date: Date | undefined) => {
    setShowTime(false)
    if (date !== undefined) {
      setCurrentTime(parseDateFromDateObjectToDocument(date, props.pickerType))
    }
  }

  const onInvalidDate = (message: string) => {
    dispatch(setMessageState({
      type: 'err',
      messageContent: message,
      backdropOpacity: 0.3
    }))
  }

  const onOpenDatePicker = () => {
    if (currentValue === '') {
      initDatePicker()
    }

    if (props.pickerType === 'time') {
      setShowTime(true)
    } else {
      setShowDate(true)
    }
  }

  const createParseableTime = () => {
    if (props.pickerType === 'time') {
      return ((props.objectTitle.includes('timeStart') ? dateBegin : dateEnd) + 'T' + currentValue)
    }

    return currentValue
  }

  const errorMessageTranslation = (errorMessage: string): React.JSX.Element => {
    const errorTranslation = t(errorMessage)
    return <Text style={Ts.redText}>{errorTranslation}</Text>
  }


  return (
    <View style={Cs.formInputContainer}>
      <View style={Cs.rowContainer}>
        <Text>{props.title}</Text>
        {
          props.validation?.required ?
            <Text style={Ts.redText}> *</Text>
            : null
        }
      </View>
      <ErrorMessage
        errors={formState.errors}
        name={props.objectTitle}
        render={({ message }) => <Text style={Ts.redText}><>{errorMessageTranslation(message)}</></Text>}
      />
      <View style={Cs.datePickerContainer}>
        <TextInput
          style={Os.datePicker}
          value={currentValue !== '' ? parseDateFromDocumentToUI(createParseableTime(), props.pickerType) : ''}
          editable={false}
        />
        <ButtonComponent onPressFunction={() => onOpenDatePicker()}
          title={undefined} height={40} width={45} buttonStyle={Bs.datePickerButton}
          gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
          textStyle={Ts.buttonText} iconName={'edit'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
        />
        <ButtonComponent onPressFunction={() => clearDatePicker()}
          title={undefined} height={40} width={45} buttonStyle={Bs.datePickerButton}
          gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
          textStyle={Ts.buttonText} iconName={'delete'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
        />
      </View>
      {showDate && (
        <View>
          <DateTimePicker
            value={currentValue !== '' ? new Date(parseDateFromDocumentToFullISO(currentValue, props.pickerType)) : date}
            mode='date'
            onChange={onChangeDate}
            minimumDate={props.objectTitle.includes('dateEnd')
              ? (dateBegin ? new Date(parseDateFromDocumentToFullISO(dateBegin, props.pickerType)) : undefined)
              : undefined}
            maximumDate={props.objectTitle.includes('dateBegin')
              ? (dateEnd ? new Date(parseDateFromDocumentToFullISO(dateEnd, props.pickerType)) : undefined)
              : undefined}
          />
        </View>
      )}
      {showTime && (
        <View>
          <DateTimePicker
            value={currentValue !== '' ? new Date(parseDateFromDocumentToFullISO(createParseableTime())) : date}
            mode='time'
            onChange={onChangeTime}
          // minimumDate and maximumDate aren't available for Android time mode
          />
        </View>
      )}
    </View>
  )
}

export default FormDatePickerComponent