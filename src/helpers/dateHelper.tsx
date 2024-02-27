import moment from 'moment'

//creates a date string in format 'yyyy-MM-ddTHH:mm'
export const setDateForDocument = () => {
  const date = new Date()

  return moment(date).format(moment.HTML5_FMT.DATETIME_LOCAL)
}

//parses date from format 'yyyy-MM-ddTHH:mm' to 'dd.MM.yyyy HH.mm'
export const parseDateFromDocumentToUI = (date: string, type?: string | undefined) => {
  if (date === '') {
    return ''
  } else if (type === 'date')
    return moment(date, 'YYYY-MM-DDTHH:mm').format('DD.MM.YYYY')
  else if (type === 'time')
    return moment(date, 'YYYY-MM-DDTHH:mm').format('HH.mm')
  else
    return moment(date, 'YYYY-MM-DDTHH:mm').format('DD.MM.YYYY HH.mm')
}

//parses date from format 'dd.MM.yyyy HH.mm' to 'yyyy-MM-ddTHH:mm'
export const parseDateFromDocumentToFullISO = (date: string, type?: string | undefined) => {
  if (type === 'date')
    return moment(date, moment.HTML5_FMT.DATE).format()
  else if (type === 'time')
    return moment(date, moment.HTML5_FMT.TIME).format()
  else
    return moment(date, moment.HTML5_FMT.DATETIME_LOCAL).format()
}

//parses date from format 'yyyy-MM-ddTHH:mm:ss.sssZ' to 'yyyy-MM-ddTHH:mm'
export const parseDateFromDateObjectToDocument = (dateObject: Date, type?: string | undefined) => {
  const date = dateObject.toISOString()

  if (type === 'date')
    return moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DD')
  else if (type === 'time')
    return moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm')
  else
    return moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DDTHH:mm')
}

export const parseFromWarehouseToUI = (date: string) => {
  return moment(date, 'YYYY-MM-DD').format('DD.MM.YYYY')
}

//checks whether two 'yyyy-MM-ddTHH.mm' formated dates are from same day
export const sameDay = (dateOne: string, dateTwo: string) => {
  if (dateOne.substring(0, 10) === dateTwo.substring(0, 10)) {
    return true
  } else {
    return false
  }
}