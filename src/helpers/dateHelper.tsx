import moment from 'moment'

//creates a date string in format 'yyyy-MM-ddTHH:mm'
export const setDateForDocument = () => {
  const date = new Date()

  return moment(date).format(moment.HTML5_FMT.DATETIME_LOCAL)
}

//parses date from format 'yyyy-MM-ddTHH:mm' to 'dd.MM.yyyy HH.mm'
export const parseDateForUI = (date: string, type?: string | undefined) => {
  if (date) {
    if (type === 'date')
      return moment(date, 'YYYY-MM-DDTHH:mm').format('DD.MM.YYYY')
    else if (type === 'time')
      return moment(date, 'YYYY-MM-DDTHH:mm').format('HH.mm')
    else
      return moment(date, 'YYYY-MM-DDTHH:mm').format('DD.MM.YYYY HH.mm')
  } else {
    return ''
  }
}

//parses date from format 'dd.MM.yyyy HH.mm' to 'yyyy-MM-ddTHH:mm'
export const parseDateForDocument = (date: string) => {
  if (date) {
    return moment(date, 'DD.MM.YYYY HH.mm').format('YYYY-MM-DDTHH:mm')
  } else {
    return ''
  }
}

//parses date from format 'dd.MM.yyyy HH.mm' to 'yyyy-MM-ddTHH:mm'
export const parseFromLocalToISO = (date: string, type?: string | undefined) => {
  if (date) {
    if (type === 'date')
      return moment(date, moment.HTML5_FMT.DATE).format()
    else if (type === 'time')
      return moment(date, moment.HTML5_FMT.TIME).format()
    else
      return moment(date, moment.HTML5_FMT.DATETIME_LOCAL).format()
  } else {
    return ''
  }
}

//parses date from format 'yyyy-MM-ddTHH:mm:ss.sssZ' to 'yyyy-MM-ddTHH:mm'
export const parseDateFromISOToDocument = (dateObject: Date, type?: string | undefined) => {
  if (dateObject) {
    const date = dateObject.toISOString()

    if (type === 'date')
      return moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DD')
    else if (type === 'time')
      return moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm')
    else
      return moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DDTHH:mm')
  } else {
    return ''
  }
}

//checks whether two 'yyyy-MM-ddTHH.mm' formated dates are from same day
export const sameDay = (dateOne: string, dateTwo: string) => {

  if (dateOne.substring(0, 9) === dateTwo.substring(0, 9)) {
    return true
  } else {
    return false
  }
}