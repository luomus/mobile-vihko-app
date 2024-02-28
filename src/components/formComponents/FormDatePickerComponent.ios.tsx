import React, { useState, useEffect } from 'react'
import { Text, TextInput, View } from 'react-native'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux'
import { rootState } from '../../stores'
import Os from '../../styles/OtherStyles'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import ButtonComponent from '../general/ButtonComponent'
import { parseDateFromDocumentToUI, parseDateFromDocumentToFullISO, parseDateFromDateObjectToDocument } from '../../helpers/dateHelper'
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
  pickerType: string | undefined
}

const FormDatePickerComponent = (props: Props) => {
  const { register, setValue, watch } = useFormContext()
  const [currentValue, setCurrentValue] = useState<string>(props.defaultValue)
  const [currentDate, setCurrentDate] = useState<string>(props.defaultValue)
  const [currentTime, setCurrentTime] = useState<string>(props.defaultValue)
  const [modalVisibility, setModalVisibility] = useState<boolean>(false)

  const date = new Date()
  const dateBegin = watch('gatheringEvent_dateBegin')
  const dateEnd = watch('gatheringEvent_dateEnd')
  const timeStart = watch('gatheringEvent_timeStart')
  const timeEnd = watch('gatheringEvent_timeEnd')

  const singleObservation = useSelector((state: rootState) => state.singleObservation)

  const { t } = useTranslation()

  useEffect(() => {
    register(props.objectTitle)

    if (singleObservation && props.objectTitle.includes('dateEnd') && !props.defaultValue) {
      setCurrentValue('')
      setValue(props.objectTitle, '')
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
    } else if (props.objectTitle.includes('dateBegin') && Date.parse(combinedDate) > Date.parse(dateEnd)) { // dateBegin is later than dateEnd
      combinedDate = dateEnd
    } else if (props.objectTitle.includes('time') && Date.parse(dateBegin) === Date.parse(dateEnd)) {
      if (props.objectTitle.includes('End') && Date.parse(dateBegin + 'T' + timeStart) > Date.parse(dateEnd + 'T' + combinedDate)) { // timeEnd is earlier than timeStart
        combinedDate = timeStart
      } else if (props.objectTitle.includes('Start') && Date.parse(dateBegin + 'T' + combinedDate) > Date.parse(dateEnd + 'T' + timeEnd)) { // timeStart is later than timeEnd
        combinedDate = timeEnd
      }
    }

    setValue(props.objectTitle, combinedDate)

    combinedDate !== '' ? setCurrentValue(combinedDate) : null
  }, [currentDate, currentTime])

  const initDatePicker = () => {
    setCurrentValue(parseDateFromDateObjectToDocument(date, props.pickerType))
    setCurrentDate(parseDateFromDateObjectToDocument(date, props.pickerType))
    setCurrentTime(parseDateFromDateObjectToDocument(date, props.pickerType))
    setValue(props.objectTitle, parseDateFromDateObjectToDocument(date, props.pickerType))
  }

  const onChangeDate = (event: DateTimePickerEvent, date: Date | undefined) => {
    date !== undefined ? setCurrentDate(parseDateFromDateObjectToDocument(date, props.pickerType)) : null
  }

  const onChangeTime = (event: DateTimePickerEvent, date: Date | undefined) => {
    date !== undefined ? setCurrentTime(parseDateFromDateObjectToDocument(date, props.pickerType)) : null
  }

  const createParseableTime = () => {
    if (props.pickerType === 'time') {
      return ((props.objectTitle.includes('timeStart') ? dateBegin : dateEnd) + 'T' + currentValue)
    }

    return currentValue
  }

  const initModal = () => {
    if (currentValue === '') {
      initDatePicker()
    }
    setModalVisibility(true)
  }

  return (
    <View style={Cs.formInputContainer}>
      <Text>{props.title}</Text>
      <View style={Cs.datePickerContainer}>
        <TextInput
          style={Os.datePicker}
          value={currentValue !== '' ? parseDateFromDocumentToUI(createParseableTime(), props.pickerType) : ''}
          editable={false}
        />
        <ButtonComponent onPressFunction={() => initModal()}
          title={undefined} height={40} width={45} buttonStyle={Bs.neutralIconButton}
          gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
          textStyle={Ts.buttonText} iconName={'edit'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText} noMargin
        />
      </View>
      <Modal isVisible={modalVisibility} onBackButtonPress={() => setModalVisibility(false)}>
        <View style={Cs.iOSDatePickerContainer}>
          {
            props.pickerType === 'time' ? null :
              <View style={Cs.padding5Container}>
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
          }
          {
            props.pickerType === 'date' ? null :
              <View style={Cs.padding5Container}>
                <DateTimePicker
                  value={currentValue ? new Date(parseDateFromDocumentToFullISO(createParseableTime())) : date}
                  mode='time'
                  onChange={onChangeTime}
                />
              </View>
          }
          <ButtonComponent onPressFunction={() => setModalVisibility(false)}
            title={t('save')} height={40} width={120} buttonStyle={Bs.textAndIconButton}
            gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={'edit'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
          />
        </View>
      </Modal>
    </View>
  )
}

export default FormDatePickerComponent