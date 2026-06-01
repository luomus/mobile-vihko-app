import React from 'react'
import { Text, View } from 'react-native'
import uuid from 'react-native-uuid'

interface Converter {
  (autocompleteResult: Record<string, any>, query: string): {autocompleteResult: Record<string, any>, element: React.JSX.Element}
}

const scientificNameOrTaxonIdCoverter = (autocompleteResult: Record<string, any>, query: string) => {
  autocompleteResult.shownName = autocompleteResult.matchingName

  return {
    autocompleteResult,
    element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
      {renderScientificName(autocompleteResult.matchingName, query)}
    </View>
  }
}

const speciesCodeConverter = (autocompleteResult: Record<string, any>, query: string) => {
  autocompleteResult.shownName = autocompleteResult.matchingName

  return {
    autocompleteResult,
    element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
      <Text>{renderOtherName(autocompleteResult.matchingName, query)}{' - '}{renderScientificName(autocompleteResult.scientificName, query)}</Text>
    </View>
  }
}

const primaryVernacularNameConverter = (autocompleteResult: Record<string, any>, query: string) => {
  //if there is no vernacular name in users language
  if (!autocompleteResult.vernacularName) {
    autocompleteResult.shownName = autocompleteResult.scientificName

    return {
      autocompleteResult,
      element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
        <Text>{renderScientificName(autocompleteResult.scientificName, query)}{' ('}{renderOtherName(autocompleteResult.matchingName, query)}{') - '}{renderScientificName(autocompleteResult.scientificName, query)}</Text>
      </View>
    }
  }

  //if else use vernacular name as usual
  autocompleteResult.shownName = autocompleteResult.vernacularName

  return {
    autocompleteResult,
    element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
      <Text>{renderOtherName(autocompleteResult.vernacularName, query) }{' - '}{renderScientificName(autocompleteResult.scientificName, query)}</Text>
    </View>
  }
}

const otherVernacularNameConverter = (autocompleteResult: Record<string, any>, query: string) => {
  //if there is no vernacular name in users language
  if (!autocompleteResult.vernacularName) {

    autocompleteResult.shownName = autocompleteResult.scientificName

    return {
      autocompleteResult,
      element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
        <Text>{renderScientificName(autocompleteResult.scientificName, query)}{' ('}{renderOtherName(autocompleteResult.matchingName, query)}{') - '}{renderScientificName(autocompleteResult.scientificName, query)}</Text>
      </View>
    }
  }

  //else replace secondary vernacular in matching name with user language vernacular name and render it
  autocompleteResult.shownName = autocompleteResult.vernacularName

  return {
    autocompleteResult,
    element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
      <Text>{renderOtherName(autocompleteResult.matchingName, query)}{'('}{renderOtherName(autocompleteResult.vernacularName, query) }{') - '}{renderScientificName(autocompleteResult.scientificName, query)}</Text>
    </View>
  }
}

const synonymScientificNameConverter = (autocompleteResult: Record<string, any>, query: string) => {
  autocompleteResult.shownName = autocompleteResult.scientificName

  return {
    autocompleteResult,
    element: <View style={{ paddingTop: 10, paddingBottom: 10 }}>
      <Text>{renderScientificName(autocompleteResult.scientificName, query)}{' ('}{renderOtherName(autocompleteResult.matchingName, query)}{')'}</Text>
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

export const convert = (autocompleteResult: Record<string, any>, query: string) => {
  const converter = getConverter(autocompleteResult.nameType)
  return converter(autocompleteResult, query)
}

const renderScientificName = (scientificName: string, query: string) => {
  return (
    <Text style={{ fontStyle: 'italic', fontSize: 15 }}><>{addBolding(scientificName, query, true)}</></Text>
  )
}

const renderOtherName = (otherName: string, query: string) => {
  return (
    <Text><>{addBolding(otherName, query, false)}</></Text>
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

  const text: React.JSX.Element[] = []
  let start = 0

  if (query !== '') {
    splitQuery.forEach(query => {
      const nameSlice = tempName.slice(start)
      const startIndex = nameSlice.toLowerCase().indexOf(query)
      const endIndex = startIndex + query.length

      if (startIndex !== -1) {
        start += endIndex

        if (startIndex === 0) {
          text.push(<Text key={uuid.v4().toString()} style={{ fontWeight: 'bold', fontSize: 15 }}>{nameSlice.slice(startIndex, endIndex)}</Text>)
        } else {
          text.push(<Text key={uuid.v4().toString()} style={{ fontSize: 15 }}>{nameSlice.slice(0, startIndex)}</Text>)
          text.push(<Text key={uuid.v4().toString()} style={{ fontWeight: 'bold', fontSize: 15 }}>{nameSlice.slice(startIndex, endIndex)}</Text>)
        }
      }
    })
  }

  if (start !== tempName.length) {
    text.push(<Text key={uuid.v4().toString()} style={{ fontSize: 15 }}>{tempName.slice(start)}</Text>)
  }

  return text
}
