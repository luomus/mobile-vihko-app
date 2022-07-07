import moment from 'moment'

//creates a date string in format 'yyyy-MM-ddTHH:mm'
export const setDateForDocument = () => {
  const date = new Date()

  return moment(date).format(moment.HTML5_FMT.DATETIME_LOCAL)
}

//parses date from format 'yyyy-MM-ddTHH:mm' to 'dd.MM.yyyy HH.mm'
export const parseDateForUI = (date: string) => {
  if (date) {
    return moment(date).format('DD.MM.YYYY HH.mm')
  } else {
    return ''
  }
}

//parses date from format 'dd.MM.yyyy HH.mm' to 'yyyy-MM-ddTHH:mm'
export const parseDateForDocument = (date: string) => {
  if (date) {
    return moment(date).format('YYYY-MM-DDTHH:mm')
  } else {
    return ''
  }
}

//parses date from format 'dd.MM.yyyy HH.mm' to 'yyyy-MM-ddTHH:mm'
export const parseFromLocalToISO = (date: string) => {
  if (date) {
    return moment(date, moment.HTML5_FMT.DATETIME_LOCAL).format()
  } else {
    return ''
  }
}

//parses date from format 'yyyy-MM-ddTHH:mm:ss.sssZ' to 'yyyy-MM-ddTHH:mm'
export const parseDateFromISOToDocument = (dateObject: Date) => {
  if (dateObject) {
    const date = dateObject.toISOString()

    return moment(date).format('YYYY-MM-DDTHH:mm')
  } else {
    return ''
  }
}