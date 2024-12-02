//this file defines which fields of schema are shown in different forms

export const singleObservationFields = [
  'identifications_0_taxon',
  'count',
  'gatheringEvent_legPublic',
  'secureLevel',
  'gatheringEvent_dateBegin',
  'gatheringEvent_dateEnd',
  'atlasCode',
  'notes',
  'images'
]

export const singleObservationFieldOrder = [
  'identifications_0_taxon',
  'count',
  'unitGathering_geometry_radius',
  'gatheringEvent_legPublic',
  'secureLevel',
  'gatheringEvent_dateBegin',
  'gatheringEvent_dateEnd',
  'atlasCode',
  'notes',
  'images'
]

export const overrideSingleObservationFields = {
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
}

export const additionalSingleObservationFields = {
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
}

export const MHL932ObservationEventFields = [
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

export const MHL932Fields = [
  'identifications_0_taxonVerbatim',
  'count',
  'recordBasis',
  'notes',
  'images'
]

export const overrideMHL932Fields = {
  'identifications_0_taxonVerbatim': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      filters: {
        taxonSet: 'MX.taxonSetBiomonCompleteListOdonata'
      },
      valueField: 'identifications_0_taxonVerbatim',
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
        'shownName': 'identifications_0_taxonVerbatim',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  },
  'count': {
    field: 'countSelectorField'
  }
}

export const overrideMHL932ObservationEventFields = {
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
}

export const MHL932ObservationEventFieldOrder = [
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

export const MHL1040ObservationEventFields = [
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
  'keywords'
]

export const overrideMHL1040Fields = {
  'identifications_0_taxonVerbatim': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      filters: {
        taxonSet: 'MX.taxonSetBiomonCompleteListButterflies'
      },
      valueField: 'identifications_0_taxonVerbatim',
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
        'shownName': 'identifications_0_taxonVerbatim',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  },
  'count': {
    field: 'countSelectorField'
  }
}

export const MHL1040Fields = [
  'identifications_0_taxonVerbatim',
  'count',
  'recordBasis',
  'lifeStage',
  'notes',
  'images'
]

export const overrideMHL1040ObservationEventFields = {
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
}

export const MHL1040ObservationEventFieldOrder = [
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

export const MHL1042ObservationEventFields = [
  'secureLevel',
  'gatheringEvent_completeList_completeListType',
  'gatheringEvent_dateBegin',
  'gatheringEvent_timeStart',
  'gatheringEvent_dateEnd',
  'gatheringEvent_timeEnd',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_notes',
]

export const overrideMHL1042Fields = {
  'identifications_0_taxonVerbatim': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      filters: {
        taxonSet: 'MX.taxonSetBiomonCompleteListLargeFlowers'
      },
      valueField: 'identifications_0_taxonVerbatim',
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
        'shownName': 'identifications_0_taxonVerbatim',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  }
}

export const MHL1042Fields = [
  'identifications_0_taxonVerbatim',
  'recordBasis',
  'plantLifeStage',
  'wild',
  'taxonConfidence',
  'images',
  'count',
  'notes'
]

export const overrideMHL1042ObservationEventFields = {
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
}

export const MHL1042ObservationEventFieldOrder = [
  'secureLevel',
  'gatheringEvent_completeList_completeListType',
  'gatheringEvent_dateBegin',
  'gatheringEvent_timeStart',
  'gatheringEvent_dateEnd',
  'gatheringEvent_timeEnd',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_notes',
]

export const MHL1043ObservationEventFields = [
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
  'keywords'
]

export const overrideMHL1043Fields = {
  'identifications_0_taxonVerbatim': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      filters: {
        taxonSet: 'MX.taxonSetBiomonCompleteListMoths'
      },
      valueField: 'identifications_0_taxonVerbatim',
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
        'shownName': 'identifications_0_taxonVerbatim',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  },
  'count': {
    field: 'countSelectorField'
  }
}

export const MHL1043Fields = [
  'identifications_0_taxonVerbatim',
  'count',
  'recordBasis',
  'notes',
  'images'
]

export const overrideMHL1043ObservationEventFields = {
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
}

export const MHL1043ObservationEventFieldOrder = [
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

export const MHL1044ObservationEventFields = [
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
  'keywords'
]

export const overrideMHL1044Fields = {
  'identifications_0_taxonVerbatim': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      filters: {
        taxonSet: 'MX.taxonSetBiomonCompleteListBombus'
      },
      valueField: 'identifications_0_taxonVerbatim',
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
        'shownName': 'identifications_0_taxonVerbatim',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  },
  'count': {
    field: 'countSelectorField'
  }
}

export const MHL1044Fields = [
  'identifications_0_taxonVerbatim',
  'count',
  'recordBasis',
  'sex',
  'notes',
  'images'
]

export const overrideMHL1044ObservationEventFields = {
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
}

export const MHL1044ObservationEventFieldOrder = [
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

export const MHL1045ObservationEventFields = [
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
  'keywords'
]

export const overrideMHL1045Fields = {
  'identifications_0_taxonVerbatim': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      filters: {
        taxonSet: 'MX.taxonSetBiomonCompleteListAmphibiaReptilia'
      },
      valueField: 'identifications_0_taxonVerbatim',
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
        'shownName': 'identifications_0_taxonVerbatim',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  },
  'count': {
    field: 'countSelectorField'
  }
}

export const MHL1045Fields = [
  'identifications_0_taxonVerbatim',
  'count',
  'recordBasis',
  'notes',
  'images'
]

export const overrideMHL1045ObservationEventFields = {
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
}

export const MHL1045ObservationEventFieldOrder = [
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

export const MHL1046ObservationEventFields = [
  'secureLevel',
  'gatheringEvent_completeList_completeListType',
  'gatheringEvent_dateBegin',
  'gatheringEvent_timeStart',
  'gatheringEvent_dateEnd',
  'gatheringEvent_timeEnd',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_notes',
]

export const overrideMHL1046Fields = {
  'identifications_0_taxonVerbatim': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      filters: {
        taxonSet: 'MX.taxonSetBiomonCompleteListSubarcticPlants'
      },
      valueField: 'identifications_0_taxonVerbatim',
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
        'shownName': 'identifications_0_taxonVerbatim',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  }
}

export const MHL1046Fields = [
  'identifications_0_taxonVerbatim',
  'recordBasis',
  'plantLifeStage',
  'taxonConfidence',
  'images',
  'count'
]

export const overrideMHL1046ObservationEventFields = {
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
}

export const MHL1046ObservationEventFieldOrder = [
  'secureLevel',
  'gatheringEvent_completeList_completeListType',
  'gatheringEvent_dateBegin',
  'gatheringEvent_timeStart',
  'gatheringEvent_dateEnd',
  'gatheringEvent_timeEnd',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_notes',
]

export const MHL1047ObservationEventFields = [
  'secureLevel',
  'gatheringEvent_completeList_completeListType',
  'gatheringEvent_dateBegin',
  'gatheringEvent_timeStart',
  'gatheringEvent_dateEnd',
  'gatheringEvent_timeEnd',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_notes',
]

export const overrideMHL1047Fields = {
  'identifications_0_taxonVerbatim': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      filters: {
        taxonSet: 'MX.taxonSetBiomonCompleteListMacrolichens'
      },
      valueField: 'identifications_0_taxonVerbatim',
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
        'shownName': 'identifications_0_taxonVerbatim',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  }
}

export const MHL1047Fields = [
  'identifications_0_taxonVerbatim',
  'recordBasis',
  'substrateClassification',
  'taxonConfidence',
  'images',
  'count'
]

export const overrideMHL1047ObservationEventFields = {
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
}

export const MHL1047ObservationEventFieldOrder = [
  'secureLevel',
  'gatheringEvent_completeList_completeListType',
  'gatheringEvent_dateBegin',
  'gatheringEvent_timeStart',
  'gatheringEvent_dateEnd',
  'gatheringEvent_timeEnd',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_notes',
]

export const MHL1048ObservationEventFields = [
  'secureLevel',
  'gatheringEvent_completeList_completeListType',
  'gatheringEvent_dateBegin',
  'gatheringEvent_timeStart',
  'gatheringEvent_dateEnd',
  'gatheringEvent_timeEnd',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_notes',
]

export const overrideMHL1048Fields = {
  'identifications_0_taxonVerbatim': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      filters: {
        taxonSet: 'MX.taxonSetBiomonCompleteListBracketFungi'
      },
      valueField: 'identifications_0_taxonVerbatim',
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
        'shownName': 'identifications_0_taxonVerbatim',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  }
}

export const MHL1048Fields = [
  'identifications_0_taxonVerbatim',
  'recordBasis',
  'substrateClassification',
  'substrateNotes',
  'taxonConfidence',
  'notes',
  'images',
  'count'
]

export const overrideMHL1048ObservationEventFields = {
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
}

export const MHL1048ObservationEventFieldOrder = [
  'secureLevel',
  'gatheringEvent_completeList_completeListType',
  'gatheringEvent_dateBegin',
  'gatheringEvent_timeStart',
  'gatheringEvent_dateEnd',
  'gatheringEvent_timeEnd',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_notes',
]

export const MHL1062ObservationEventFields = [
  'secureLevel',
  'gatheringEvent_completeList_completeListType',
  'gatheringEvent_dateBegin',
  'gatheringEvent_timeStart',
  'gatheringEvent_dateEnd',
  'gatheringEvent_timeEnd',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_notes',
]

export const overrideMHL1062Fields = {
  'identifications_0_taxonVerbatim': {
    field: 'autocomplete',
    params: {
      target: 'taxon',
      filters: {
        taxonSet: 'MX.taxonSetBiomonCompleteListPracticalFungi'
      },
      valueField: 'identifications_0_taxonVerbatim',
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
        'shownName': 'identifications_0_taxonVerbatim',
        'payload_informalTaxonGroups': 'informalTaxonGroups'
      }
    }
  }
}

export const MHL1062Fields = [
  'identifications_0_taxonVerbatim',
  'taxonConfidence',
  'notes',
  'images'
]

export const overrideMHL1062ObservationEventFields = {
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
}

export const MHL1062ObservationEventFieldOrder = [
  'secureLevel',
  'gatheringEvent_completeList_completeListType',
  'gatheringEvent_dateBegin',
  'gatheringEvent_timeStart',
  'gatheringEvent_dateEnd',
  'gatheringEvent_timeEnd',
  'gatherings_0_locality',
  'gatherings_0_localityDescription',
  'gatherings_0_notes',
]

export const observationEventFields = [
  'gatheringEvent_legPublic',
  'secureLevel',
  'gatheringEvent_dateBegin',
  'gatheringEvent_dateEnd',
  'keywords',
  'notes',
  'gatheringEvent_gatheringFact_lolifeSiteClassification',
  'gatheringEvent_nextMonitoringYear',
  'gatheringEvent_namedPlaceNotes'
]

export const lolifeObservationTypes: Record<string, string> = {
  alive: 'flying squirrel',
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
  'gatheringEvent_dateBegin': {
    field: 'dateBegin',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  },
  'gatheringEvent_dateEnd': {
    field: 'dateEnd',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must enter time'
        },
      }
    }
  }
}

export const atlasCodeAbbreviations: { [key: string]: any } = {
  '': '',
  'MY.atlasCodeEnum1': '1 Ei pesi',
  'MY.atlasCodeEnum2': '2 Laulu ym. 1 pv',
  'MY.atlasCodeEnum3': '3 Naaras/Pari 1 pv',
  'MY.atlasCodeEnum4': '4 Laulu ym. yli 1 pv',
  'MY.atlasCodeEnum5': '5 Naaras/Pari yli pv',
  'MY.atlasCodeEnum6': '6 Viittaa pesintään',
  'MY.atlasCodeEnum61': '61 Käy pesäpaikalla',
  'MY.atlasCodeEnum62': '62 Rakentaa pesää',
  'MY.atlasCodeEnum63': '63 Varoittelee poikasista',
  'MY.atlasCodeEnum64': '64 Houkuttelee pois',
  'MY.atlasCodeEnum65': '65 Hyökkäilee',
  'MY.atlasCodeEnum66': '66 Pesää rakennettu',
  'MY.atlasCodeEnum7': '7 Epäsuorasti pesintä',
  'MY.atlasCodeEnum71': '71 Pesitty pesä',
  'MY.atlasCodeEnum72': '72 Käy pesässä',
  'MY.atlasCodeEnum73': '73 Maastopoikaset',
  'MY.atlasCodeEnum74': '74 Kantaa ruokaa/ulosteita',
  'MY.atlasCodeEnum75': '75 Hautova emo',
  'MY.atlasCodeEnum8': '8 Todistettu pesintä',
  'MY.atlasCodeEnum81': '81 Kuultu pesäpoikaset',
  'MY.atlasCodeEnum82': '82 Pesässä munia/poikasia'
}

export const forms: Record<string, any> = {
  tripForm: 'JX.519',
  birdAtlas: 'MHL.117',
  fungiAtlas: 'JX.652',
  dragonflyForm: 'MHL.932',
  butterflyForm: 'MHL.1040',
  largeFlowersForm: 'MHL.1042',
  mothForm: 'MHL.1043',
  bumblebeeForm: 'MHL.1044',
  herpForm: 'MHL.1045',
  subarcticForm: 'MHL.1046',
  macrolichenForm: 'MHL.1047',
  bracketFungiForm: 'MHL.1048',
  practicalFungiForm: 'MHL.1062',
  lolife: 'MHL.45'
}

export const biomonForms: Record<string, any> = {
  dragonflyForm: 'MHL.932',
  butterflyForm: 'MHL.1040',
  largeFlowersForm: 'MHL.1042',
  mothForm: 'MHL.1043',
  bumblebeeForm: 'MHL.1044',
  herpForm: 'MHL.1045',
  subarcticForm: 'MHL.1046',
  macrolichenForm: 'MHL.1047',
  bracketFungiForm: 'MHL.1048',
  practicalFungiForm: 'MHL.1062'
}

export const useUiSchemaFields = ['MHL.45']