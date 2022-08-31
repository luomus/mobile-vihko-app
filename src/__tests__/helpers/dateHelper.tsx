import moment from 'moment'
import { parseDateFromDocumentToUI, parseDateFromDateObjectToDocument, parseDateFromDocumentToFullISO, sameDay, setDateForDocument } from "../../helpers/dateHelper"

describe('setDateForDocument', () => {
  it('returns a date in ISO format', () => {
    const currentDate = setDateForDocument()
    expect(currentDate).toEqual(moment(currentDate).format(moment.HTML5_FMT.DATETIME_LOCAL))
  })
})

describe('parseDateFromDocumentToUI', () => {
  it('returns the given date a readable format', () => {
    const date = '2022-08-29T14:12'
    const type = 'date'
    const parsedDate = parseDateFromDocumentToUI(date, type)
    expect(parsedDate).toEqual('29.08.2022')
  })

  it('returns the given time in a readable format', () => {
    const time = '2022-08-29T14:12'
    const type = 'time'
    const parsedTime = parseDateFromDocumentToUI(time, type)
    expect(parsedTime).toEqual('14.12')
  })

  it('returns the given date and time in a readable format', () => {
    const date = '2022-08-29T14:12'
    const parsedDate = parseDateFromDocumentToUI(date)
    expect(parsedDate).toEqual('29.08.2022 14.12')
  })

  it('returns an empty string if input is not a valid date', () => {
    const date = 'foo'
    const parsedDate = parseDateFromDocumentToUI(date)
    expect(parsedDate).toEqual('Invalid date')
  })
})

describe('parseDateFromDocumentToFullISO', () => {
  it('returns the given date in the ISO format', () => {
    const date = '2022-08-29T14:12'
    const type = 'date'
    const parsedDate = parseDateFromDocumentToFullISO(date, type)
    expect(parsedDate).toEqual('2022-08-29T00:00:00+03:00')
  })

  it('returns the given time in the ISO format', () => {
    const date = new Date()
    let isoDate = date.toISOString()
    isoDate = isoDate.substring(0, isoDate.lastIndexOf('T') + 1)
    isoDate += '14:12'
    const type = 'time'
    const parsedTime = parseDateFromDocumentToFullISO(isoDate, type)
    expect(parsedTime).toEqual('2022-08-31T20:12:00+03:00')
  })

  it('returns the given date and time in the ISO format', () => {
    const date = '2022-08-29T14:12'
    const parsedDate = parseDateFromDocumentToFullISO(date)
    expect(parsedDate).toEqual('2022-08-29T14:12:00+03:00')
  })

  it('returns an empty string if input is not a valid date', () => {
    const date = 'foo'
    const parsedDate = parseDateFromDocumentToFullISO(date)
    expect(parsedDate).toEqual('Invalid date')
  })
})

describe('parseDateFromDateObjectToDocument', () => {
  it('parses the given date from a Date object to document', () => {
    const date = new Date(2022, 7, 29, 14, 12, 9, 427)
    const type = 'date'
    const parsedDate = parseDateFromDateObjectToDocument(date, type)
    expect(parsedDate).toEqual('2022-08-29')
  })

  it('parses the given time from Date object to document', () => {
    const date = new Date(2022, 7, 29, 14, 12, 9, 427)
    const type = 'time'
    const parsedDate = parseDateFromDateObjectToDocument(date, type)
    expect(parsedDate).toEqual('14:12')
  })

  it('parses the given date from Date object to document', () => {
    const date = new Date(2022, 7, 29, 14, 12, 9, 427)
    const parsedDate = parseDateFromDateObjectToDocument(date)
    expect(parsedDate).toEqual('2022-08-29T14:12')
  })
})

describe('sameDay', () => {
  it('returns true when the dates are from the same day', () => {
    const firstDate = '2022-08-29T14:12'
    const secondDate = '2022-08-29T15:06'
    expect(sameDay(firstDate, secondDate)).toBeTruthy()
  })
  
  it('returns false when the dates are from different days', () => {
    const firstDate = '2022-08-27T14:12'
    const secondDate = '2022-08-29T15:06'
    expect(sameDay(firstDate, secondDate)).toBeFalsy()
  })
})