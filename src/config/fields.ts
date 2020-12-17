//this file defines which fields of schema are shown in different forms

export const observationEventFields = [
  'gatheringEvent_legPublic',
  'secureLevel',
  'gatheringEvent_dateBegin',
  'gatheringEvent_dateEnd',
  'gatherings_0_notes',
  'keywords',
]

export const JX519ObservationEventFields = [
  'gatheringEvent_legPublic',
  'secureLevel',
  'gatheringEvent_dateBegin',
  'gatheringEvent_dateEnd',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_weather',
  'gatherings_0_notes',
  'keywords',
]

export const JX519Fields = [
  'identifications_0_taxon',
  'count',
  'atlasCode',
  'notes',
  'images'
]

//special cases that must be handled differently than schema parsing usually does
export const overrideJX519Fields = {
  'identifications_0_taxon': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      valueField: 'identifications_0_taxon',
      transform: {
        'key': 'unitFact_autocompleteSelectedTaxonID',
        'value': 'identifications_0_taxon',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  }
}

export const availableForms = ['JX.652', 'JX.519']
