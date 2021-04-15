import React, { useState, useEffect } from 'react'
import { Text, TextInput, View } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import { useSelector } from 'react-redux'
import { rootState } from '../../stores'
import Os from '../../styles/OtherStyles'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import DateTimePicker from '@react-native-community/datetimepicker'
import { parseDateForUI, parseFromLocalToISO, parseDateFromISOToDocument, sameDay } from '../../helpers/dateHelper'
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
  parentCallback: Function | undefined,
}

const FormDateOptionsComponent = (props: Props) => {
  const { register, setValue, watch } = useFormContext()
  const [currentValue, setCurrentValue] = useState<string>(props.defaultValue)
  const [currentDate, setCurrentDate] = useState<string>(props.defaultValue)
  const [currentTime, setCurrentTime] = useState<string>(props.defaultValue)
  const [selected, setSelected] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [showDate, setShowDate] = useState<boolean>(true)
  const date = new Date()
  const dateBegin = watch('gatheringEvent_dateBegin')
  const dateEnd = watch('gatheringEvent_dateEnd')

  const observationEvent = useSelector((state: rootState) => state.observationEvent)

  const { t } = useTranslation()

  useEffect(() => {
    if (currentValue && currentValue !== '') {
      setValue(props.objectTitle, currentValue)
      setSelected(true)
    }

    //when observing in the same day as when the event was started, do not give option to pick date
    if (sameDay(observationEvent.events[observationEvent.events.length - 1].gatheringEvent.dateBegin, parseDateFromISOToDocument(date))) {
      setShowDate(false)
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

  const onLockIntoCurrentDate = () => {
    setCurrentValue(parseDateFromISOToDocument(date))
    onChangeDate(undefined, date)
    onChangeTime(undefined, date)
    setValue(props.objectTitle, parseDateFromISOToDocument(date))
    setSelected(true)
  }

  const onChangeDate = (event: Event | undefined, date: Date | undefined) => {
    setShow(false)
    date !== undefined ? setCurrentDate(parseDateFromISOToDocument(date)) : null
  }

  const onChangeTime = (event: Event | undefined, date: Date | undefined) => {

    setShow(false)

    //when date picker is not shown, set current date to be the same as current event's
    if ((date !== undefined) && !showDate) {
      setCurrentDate(observationEvent.events[observationEvent.events.length - 1].gatheringEvent.dateBegin)
    }

    date !== undefined ? setCurrentTime(parseDateFromISOToDocument(date)) : null

    if (date !== undefined) {
      setSelected(true)

      // if user cancels when choosing time of dateBegin, do not add any date
    } else {
      setSelected(false)
      setValue(props.objectTitle, '')
    }
  }

  return (
    <View style={Cs.formInputContainer}>
      <Text>{props.title}</Text>
      {!selected ?
        <View style={Cs.eventDateContainer}>
          <Button
            buttonStyle={Bs.timestampButton}
            title={' ' + t('timestamp')}
            icon={<Icon name={'schedule'} color='white' size={22} />}
            iconContainerStyle={{ paddingLeft: 5 }}
            onPress={() => onLockIntoCurrentDate()}>
          </Button>
          <Button
            buttonStyle={Bs.chooseTimeButton}
            title={' ' + t('choose time')}
            icon={<Icon name={'restore'} color='white' size={22} />}
            onPress={() => setShow(true)}>
          </Button>
        </View>
        :
        <View style={Cs.eventDateContainer}>
          <TextInput
            style={Os.datePicker}
            value={parseDateForUI(currentValue)}
            editable={false}
            ref={register({ name: props.objectTitle })}
          />
          <Button
            buttonStyle={Bs.negativeIconButton}
            icon={<Icon name={'delete'} color='white' size={22} />}
            onPress={() => {
              setSelected(false)
              setValue(props.objectTitle, '')
            }}>
          </Button>
        </View>
      }
      {show && showDate && (
        <View>
          <DateTimePicker
            value={currentValue ? new Date(parseFromLocalToISO(currentValue)) : date}
            mode='time'
            onChange={onChangeTime}
          />
          <DateTimePicker
            value={currentValue ? new Date(parseFromLocalToISO(currentValue)) : date}
            mode='date'
            onChange={onChangeDate}
          />
        </View>
      )}
      {show && !showDate && (
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

export default FormDateOptionsComponent