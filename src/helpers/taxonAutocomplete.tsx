import React from 'react'
import { Text, View } from 'react-native'
import uuid from 'react-native-uuid'


interface Converter {
  (data: Record<string, any>, uery: string): {data: Record<string, any>, element: JSX.Element}
}

const scientificNameOrTaxonIdCoverter = (data: Record<string, any>, query: string) => {
  data.shownName = data.payload.matchingName

  return {
    data,
    element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
      {renderScientificName(data.payload.matchingName, query)}
    </View>
  }
}

const speciesCodeConverter = (data: Record<string, any>, query: string) => {
  data.shownName = data.payload.matchingName

  return {
    data,
    element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
      <Text>{renderOtherName(data.payload.matchingName, query)}{' - '}{renderScientificName(data.payload.scientificName, query)}</Text>
    </View>
  }
}

const primaryVernacularNameConverter = (data: Record<string, any>, query: string) => {
  //if there is no vernacular name in users language
  if (!data.payload.vernacularName) {
    data.shownName = data.payload.scientificName

    return {
      data,
      element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
        <Text>{renderScientificName(data.payload.scientificName, query)}{' ('}{renderOtherName(data.payload.matchingName, query)}{') - '}{renderScientificName(data.payload.scientificName, query)}</Text>
      </View>
    }
  }

  //if else use vernacular name as usual
  data.shownName = data.payload.vernacularName

  return {
    data,
    element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
      <Text>{renderOtherName(data.payload.vernacularName, query) }{' - '}{renderScientificName(data.payload.scientificName, query)}</Text>
    </View>
  }
}

const otherVernacularNameConverter = (data: Record<string, any>, query: string) => {
  //if there is no vernacular name in users language
  if (!data.payload.vernacularName) {

    data.shownName = data.payload.scientificName

    return {
      data,
      element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
        <Text>{renderScientificName(data.payload.scientificName, query)}{' ('}{renderOtherName(data.payload.matchingName, query)}{') - '}{renderScientificName(data.payload.scientificName, query)}</Text>
      </View>
    }
  }

  //else replace secondary vernacular in matching name with user language vernacular name and render it
  data.shownName = data.payload.vernacularName

  return {
    data,
    element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
      <Text>{renderOtherName(data.payload.matchingName, query)}{'('}{renderOtherName(data.payload.vernacularName, query) }{') - '}{renderScientificName(data.payload.scientificName, query)}</Text>
    </View>
  }
}

const synonymScientificNameConverter = (data: Record<string, any>, query: string) => {
  data.shownName = data.payload.scientificName

  return {
    data,
    element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
      <Text>{renderScientificName(data.payload.scientificName, query)}{' ('}{renderOtherName(data.payload.matchingName, query)}{')'}</Text>
    </View>
  }
}

const NAME_TYPE_TO_CONVERTER: Record<string, Converter> = {
  'MX.scientificName': scientificNameOrTaxonIdCoverter,
  'MX.euringCode': speciesCodeConverter,
  'MX.birdlifeCode': speciesCodeConverter,
  'MX.vernacularName': primaryVernacularNameConverter,
  'MX.alternativeVernacularName': otherVernacularNameConverter,
  'MX.obsoleteVernacularName': otherVernacularNameConverter,
  'MX.tradeName': otherVernacularNameConverter
}

const getConverter = (nameType: string) => {
  const converter = NAME_TYPE_TO_CONVERTER[nameType]

  if (converter) {
    return converter
  }

  return synonymScientificNameConverter
}

export const convert = (data: Record<string, any>, query: string) => {
  const converter = getConverter(data.payload.nameType)

  return converter(data, query)
}

const renderScientificName = (scientificName: string, query: string) => {
  return (
    <Text style={{ fontStyle: 'italic', fontSize: 15 }}>{addBolding(scientificName, query, true)}</Text>
  )
}

const renderOtherName = (otherName: string, query: string) => {
  return (
    <Text>{addBolding(otherName, query, false)}</Text>
  )
}

const addBolding = (name: string, query: string, isScientific: boolean) => {
  const splitQuery = query.trim().split(/\s+/)
  let tempName: string

  if (isScientific) {
    tempName = name.charAt(0).toUpperCase() + name.slice(1)
  } else {
    tempName = name
  }

  const text: Element[] = []
  let start = 0

  if (query !== '') {
    splitQuery.forEach(query => {
      const nameSlice = tempName.slice(start)
      const startIndex = nameSlice.toLowerCase().indexOf(query)
      const endIndex = startIndex + query.length

      if (startIndex !== -1) {
        start += endIndex

        if (startIndex === 0) {
          text.push(<Text style={{ fontWeight: 'bold', fontSize: 15 }}>{nameSlice.slice(startIndex, endIndex)}</Text>)
        } else {
          text.push(<Text style={{ fontSize: 15 }}>{nameSlice.slice(0, startIndex)}</Text>)
          text.push(<Text style={{ fontWeight: 'bold', fontSize: 15 }}>{nameSlice.slice(startIndex, endIndex)}</Text>)
        }
      }
    })
  }

  if (start !== tempName.length) {
    text.push(<Text style={{ fontSize: 15 }}>{tempName.slice(start)}</Text>)
  }

  return text
}