import React, { useState, useEffect } from 'react'
import { Modal, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../stores'
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

  const date = new Date()
  const dateBegin = watch('gatheringEvent_dateBegin')
  const dateEnd = watch('gatheringEvent_dateEnd')

  const observationEvent = useSelector((state: RootState) => state.observationEvent)

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
    onChangeDate({ type: 'set', nativeEvent: { timestamp: 1, utcOffset: 1 } }, date)
    onChangeTime({ type: 'set', nativeEvent: { timestamp: 1, utcOffset: 1 } }, date)
    setValue(props.objectTitle, parseDateFromDateObjectToDocument(date))
    setSelected(true)
  }

  const onChangeDate = (event: DateTimePickerEvent, date: Date | undefined) => {
    date !== undefined ? setCurrentDate(parseDateFromDateObjectToDocument(date)) : null
  }

  const onChangeTime = (event: DateTimePickerEvent, date: Date | undefined) => {

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