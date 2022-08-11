//this file defines which fields of schema are shown in different forms

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
  'unitGathering_dateBegin',
  'taxonConfidence',
  'wild',
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
      validation: {
        required: {
          value: true,
          message: 'must not be empty'
        },
        minLength: {
          value: 2,
          message: 'must be at least 2 letters'
        },
      },
      transform: {
        'key': 'unitFact_autocompleteSelectedTaxonID',
        'shownName': 'identifications_0_taxon',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  },
  'images': {
    field: 'imagesKeywords',
    params: {
      keywords: [
        'species',
        'habitat',
      ],
      fi: [
        'laji',
        'habitaatti',
      ],
      sv: [
        'arten',
        'habitaten',
      ],
      en: [
        'species',
        'habitat',
      ]
    }
  },
  'unitGathering_dateBegin': {
    field: 'inputTitleOverridden',
    title: [
      'Aika',
      'Tid',
      'Time'
    ]
  }
}

export const overrideJX519ObservationEventFields = {
  'secureLevel': {
    field: 'inputTitleOverridden',
    title: [
      'Paikan karkeistus',
      'Plats skyddning',
      'Location roughening'
    ]
  },
  'gatherings_0_locality': {
    field: 'inputTitleOverridden',
    title: [
      'Paikannimet (kunta tallentuu automaattisesti)',
      'Ortnamn (kommunen sparar automatiskt)',
      'Locality names (municipality is saved automatically)'
    ]
  },
}

export const additionalJX519Fields = {
  'unitGathering_geometry_radius': {
    title: [
      'Tarkkuus (m)',
      'Noggrannhet (m)',
      'Accuracy (m)'
    ],
    type: 'integer',
    isArray: false,
    typeOfArray: '',
    isEnum: false,
    enumDict: {},
    defaultValue: undefined,
    blacklist: null
  }
}

export const JX519FieldOrder = [
  'identifications_0_taxon',
  'count',
  'unitGathering_geometry_radius',
  'unitGathering_dateBegin',
  'taxonConfidence',
  'wild',
  'atlasCode',
  'notes',
  'images'
]

export const MHL117ObservationEventFields = [
  'gatheringEvent_legPublic',
  'secureLevel',
  'gatheringEvent_dateBegin',
  'gatheringEvent_timeStart',
  'gatheringEvent_dateEnd',
  'gatheringEvent_timeEnd',
  'gatheringEvent_completeList_completeListType',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_weather',
  'gatherings_0_notes',
  'keywords',
]

export const MHL117Fields = [
  'identifications_0_taxon',
  'atlasCode',
  'count',
  'notes',
  'images'
]

export const overrideMHL117Fields = {
  'identifications_0_taxon': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      valueField: 'identifications_0_taxon',
      validation: {
        required: {
          value: true,
          message: 'must not be empty'
        },
        minLength: {
          value: 2,
          message: 'must be at least 2 letters'
        },
      },
      transform: {
        'key': 'unitFact_autocompleteSelectedTaxonID',
        'shownName': 'identifications_0_taxon',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  },
  'atlasCode': {
    field: 'atlasCodeField'
  }
}

export const overrideMHL117ObservationEventFields = {
  'secureLevel': {
    field: 'inputTitleOverridden',
    title: [
      'Paikan karkeistus',
      'Plats skyddning',
      'Location roughening'
    ]
  },
  'gatheringEvent_completeList_completeListType': {
    field: 'completeListField',
    params: {
      validation: {
        validate: (value: string) => value !== 'empty' || 'must choose list type'
      }
    }
  },
  'gatherings_0_locality': {
    field: 'inputTitleOverridden',
    title: [
      'Paikannimet (kunta tallentuu automaattisesti)',
      'Ortnamn (kommunen sparar automatiskt)',
      'Locality names (municipality is saved automatically)'
    ]
  },
}

export const additionalMHL117Fields = {
  'unitGathering_geometry_radius': {
    title: [
      'Tarkkuus (m)',
      'Noggrannhet (m)',
      'Accuracy (m)'
    ],
    type: 'integer',
    isArray: false,
    typeOfArray: '',
    isEnum: false,
    enumDict: {},
    defaultValue: undefined,
    blacklist: null
  }
}

export const MHL117FieldOrder = [
  'identifications_0_taxon',
  'atlasCode',
  'count',
  'unitGathering_geometry_radius',
  'notes',
  'images'
]

export const MHL117ObservationEventFieldOrder = [
  'gatheringEvent_legPublic',
  'secureLevel',
  'gatheringEvent_completeList_completeListType',
  'gatheringEvent_dateBegin',
  'gatheringEvent_timeStart',
  'gatheringEvent_dateEnd',
  'gatheringEvent_timeEnd',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_weather',
  'gatherings_0_notes',
  'keywords',
]

export const JX652ObservationEventFields = [
  'gatheringEvent_legPublic',
  'secureLevel',
  'gatheringEvent_dateBegin',
  'gatheringEvent_dateEnd',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_notes',
  'keywords',
]

export const JX652Fields = [
  'identifications_0_taxon',
  'substrateSpecies',
  'substrateNotes',
  'unitGathering_dateBegin',
  'taxonConfidence',
  'notes',
  'images'
]

//special cases that must be handled differently than schema parsing usually does
export const overrideJX652Fields = {
  'identifications_0_taxon': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      filters: {
        informalTaxonGroup: 'MVL.233,MVL.321'
      },
      valueField: 'identifications_0_taxon',
      validation: {
        required: {
          value: true,
          message: 'must not be empty'
        },
        minLength: {
          value: 2,
          message: 'must be at least 2 letters'
        },
      },
      transform: {
        'key': 'unitFact_autocompleteSelectedTaxonID',
        'shownName': 'identifications_0_taxon',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  },
  'substrateSpecies': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      valueField: 'substrateSpecies',
      transform: {
        'key': 'substrateSpecies'
      }
    }
  },
  'images': {
    field: 'imagesKeywords',
    params: {
      keywords: [
        'species',
        'habitat',
      ],
      fi: [
        'laji',
        'habitaatti',
      ],
      sv: [
        'arten',
        'habitaten',
      ],
      en: [
        'species',
        'habitat',
      ]
    }
  }
}

export const overrideJX652ObservationEventFields = {
  'secureLevel': {
    field: 'inputTitleOverridden',
    title: [
      'Paikan karkeistus',
      'Plats skyddning',
      'Location roughening'
    ]
  },
  'gatherings_0_locality': {
    field: 'inputTitleOverridden',
    title: [
      'Paikannimet (kunta tallentuu automaattisesti)',
      'Ortnamn (kommunen sparar automatiskt)',
      'Locality names (municipality is saved automatically)'
    ]
  },
}

export const observationEventFields = [
  'gatheringEvent_legPublic',
  'secureLevel',
  'gatheringEvent_dateBegin',
  'gatheringEvent_dateEnd',
  'gatherings_0_notes',
  'keywords',
]

export const lolifeObservationTypes: Record<string, string> = {
  lifeStage: 'flying squirrel',
  indirectObservationType: 'indirect observation type',
  nestType: 'nest'
}

export const overrideObservationEventFields = {
  'secureLevel': {
    field: 'inputTitleOverridden',
    title: [
      'Paikan karkeistus',
      'Plats skyddning',
      'Location roughening'
    ]
  },
}

export const forms: Record<string, any> = {
  tripForm: 'JX.519',
  birdAtlas: 'MHL.117',
  fungiAtlas: 'JX.652',
  lolife: 'MHL.45'
}

export const useUiSchemaFields = ['MHL.45']