import React, { useState, useEffect } from 'react'
import { Text, TextInput, View } from 'react-native'
import Os from '../../styles/OtherStyles'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import DateTimePicker from '@react-native-community/datetimepicker'
import ButtonComponent from '../general/ButtonComponent'
import { parseDateForUI, parseFromLocalToISO, parseDateFromISOToDocument } from '../../helpers/dateHelper'
import Colors from '../../styles/Colors'
import { useFormContext } from 'react-hook-form'

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
  parentCallback: Function | undefined,
}

const FormDatePickerComponent = (props: Props) => {
  const { register, setValue, watch } = useFormContext()
  const [currentValue, setCurrentValue] = useState<string>(props.defaultValue)
  const [currentDate, setCurrentDate] = useState<string>(props.defaultValue)
  const [currentTime, setCurrentTime] = useState<string>(props.defaultValue)
  const [showDate, setShowDate] = useState<boolean>(false)
  const [showTime, setShowTime] = useState<boolean>(false)
  const date = new Date()
  const dateBegin = watch('gatheringEvent_dateBegin')
  const dateEnd = watch('gatheringEvent_dateEnd')

  useEffect(() => {
    register(props.objectTitle)

    if (!currentValue || currentValue === '') {
      setCurrentValue(parseDateFromISOToDocument(date))
      onChangeDate(undefined, date)
      onChangeTime(undefined, date)
      setValue(props.objectTitle, parseDateFromISOToDocument(date))
    } else {
      setValue(props.objectTitle, currentValue)
    }
  }, [])

  //every time date and time change, combine them so both values are updated
  useEffect(() => {
    let combinedDate = currentDate.substring(0, 11) + currentTime.substring(11, 16)
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

  const onChangeDate = (event: Event | undefined, date: Date | undefined) => {
    setShowDate(false)
    setShowTime(true)
    date !== undefined ? setCurrentDate(parseDateFromISOToDocument(date)) : null
  }

  const onChangeTime = (event: Event | undefined, date: Date | undefined) => {
    setShowTime(false)
    date !== undefined ? setCurrentTime(parseDateFromISOToDocument(date)) : null
  }

  return (
    <View style={Cs.formInputContainer}>
      <Text>{props.title}</Text>
      <View style={Cs.eventDateContainer}>
        <TextInput
          style={Os.datePicker}
          value={parseDateForUI(currentValue)}
          editable={false}
        />
        <ButtonComponent onPressFunction={() => setShowDate(true)}
          title={undefined} height={40} width={45} buttonStyle={Bs.neutralIconButton}
          gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
          textStyle={Ts.buttonText} iconName={'edit'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
        />
      </View>
      {showDate && (
        <View>
          <DateTimePicker
            value={currentValue ? new Date(parseFromLocalToISO(currentValue)) : date}
            mode='date'
            onChange={onChangeDate}
            minimumDate={props.objectTitle.includes('dateEnd')
              ? (dateBegin ? new Date(parseFromLocalToISO(dateBegin)) : undefined)
              : undefined}
            maximumDate={props.objectTitle.includes('dateBegin')
              ? (dateEnd ? new Date(parseFromLocalToISO(dateEnd)) : undefined)
              : undefined}
          />
        </View>
      )}
      {showTime && (
        <View>
          <DateTimePicker
            value={currentValue ? new Date(parseFromLocalToISO(currentValue)) : date}
            mode='time'
            onChange={onChangeTime}
          />
        </View>
      )}
    </View>
  )
}

export default FormDatePickerComponent