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
    field: 'atlasCodeField',
    params: {
      validation: {
        required: {
          value: true,
          message: 'must not be empty'
        },
      },
    }
  },
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

export const birdList = [
  {
    'key': 'MX.26277',
    'nameFI': 'kyhmyjoutsen',
    'nameSV': 'knölsvan',
    'nameEN': 'Mute Swan',
    'nameSCI': 'Cygnus olor'
  },
  {
    'key': 'MX.26280',
    'nameFI': 'laulujoutsen',
    'nameSV': 'sångsvan',
    'nameEN': 'Whooper Swan',
    'nameSCI': 'Cygnus cygnus'
  },
  {
    'key': 'MX.26287',
    'nameFI': 'metsähanhi',
    'nameSV': 'sädgås',
    'nameEN': 'Bean Goose',
    'nameSCI': 'Anser fabalis'
  },
  {
    'key': 'MX.26290',
    'nameFI': 'kiljuhanhi',
    'nameSV': 'fjällgås',
    'nameEN': 'Lesser White-fronted Goose',
    'nameSCI': 'Anser erythropus'
  },
  {
    'key': 'MX.26291',
    'nameFI': 'merihanhi',
    'nameSV': 'grågås',
    'nameEN': 'Greylag Goose',
    'nameSCI': 'Anser anser'
  },
  {
    'key': 'MX.26293',
    'nameFI': 'lumihanhi',
    'nameSV': 'snögås',
    'nameEN': 'Snow Goose',
    'nameSCI': 'Anser caerulescens'
  },
  {
    'key': 'MX.26298',
    'nameFI': 'kanadanhanhi',
    'nameSV': 'kanadagås',
    'nameEN': 'Canada Goose',
    'nameSCI': 'Branta canadensis'
  },
  {
    'key': 'MX.26299',
    'nameFI': 'valkoposkihanhi',
    'nameSV': 'vitkindad gås',
    'nameEN': 'Barnacle Goose',
    'nameSCI': 'Branta leucopsis'
  },
  {
    'key': 'MX.26427',
    'nameFI': 'alli',
    'nameSV': 'alfågel',
    'nameEN': 'Long-tailed Duck',
    'nameSCI': 'Clangula hyemalis'
  },
  {
    'key': 'MX.26419',
    'nameFI': 'haahka',
    'nameSV': 'ejder',
    'nameEN': 'Common Eider',
    'nameSCI': 'Somateria mollissima'
  },
  {
    'key': 'MX.26429',
    'nameFI': 'mustalintu',
    'nameSV': 'sjöorre',
    'nameEN': 'Common Scoter',
    'nameSCI': 'Melanitta nigra'
  },
  {
    'key': 'MX.26431',
    'nameFI': 'pilkkasiipi',
    'nameSV': 'svärta',
    'nameEN': 'Velvet Scoter',
    'nameSCI': 'Melanitta fusca'
  },
  {
    'key': 'MX.26435',
    'nameFI': 'telkkä',
    'nameSV': 'knipa',
    'nameEN': 'Common Goldeneye',
    'nameSCI': 'Bucephala clangula'
  },
  {
    'key': 'MX.26438',
    'nameFI': 'uivelo',
    'nameSV': 'salskrake',
    'nameEN': 'Smew',
    'nameSCI': 'Mergellus albellus'
  },
  {
    'key': 'MX.26440',
    'nameFI': 'tukkakoskelo',
    'nameSV': 'småskrake',
    'nameEN': 'Red-breasted Merganser',
    'nameSCI': 'Mergus serrator'
  },
  {
    'key': 'MX.26442',
    'nameFI': 'isokoskelo',
    'nameSV': 'storskrake',
    'nameEN': 'Common Merganser',
    'nameSCI': 'Mergus merganser'
  },
  {
    'key': 'MX.26323',
    'nameFI': 'ristisorsa',
    'nameSV': 'gravand',
    'nameEN': 'Common Shelduck',
    'nameSCI': 'Tadorna tadorna'
  },
  {
    'key': 'MX.26407',
    'nameFI': 'punasotka',
    'nameSV': 'brunand',
    'nameEN': 'Common Pochard',
    'nameSCI': 'Aythya ferina'
  },
  {
    'key': 'MX.26415',
    'nameFI': 'tukkasotka',
    'nameSV': 'vigg',
    'nameEN': 'Tufted Duck',
    'nameSCI': 'Aythya fuligula'
  },
  {
    'key': 'MX.26416',
    'nameFI': 'lapasotka',
    'nameSV': 'bergand',
    'nameEN': 'Greater Scaup',
    'nameSCI': 'Aythya marila'
  },
  {
    'key': 'MX.26388',
    'nameFI': 'heinätavi',
    'nameSV': 'årta',
    'nameEN': 'Garganey',
    'nameSCI': 'Spatula querquedula'
  },
  {
    'key': 'MX.26394',
    'nameFI': 'lapasorsa',
    'nameSV': 'skedand',
    'nameEN': 'Northern Shoveler',
    'nameSCI': 'Spatula clypeata'
  },
  {
    'key': 'MX.26364',
    'nameFI': 'harmaasorsa',
    'nameSV': 'snatterand',
    'nameEN': 'Gadwall',
    'nameSCI': 'Mareca strepera'
  },
  {
    'key': 'MX.26360',
    'nameFI': 'haapana',
    'nameSV': 'bläsand',
    'nameEN': 'Eurasian Wigeon',
    'nameSCI': 'Mareca penelope'
  },
  {
    'key': 'MX.26366',
    'nameFI': 'tavi',
    'nameSV': 'kricka',
    'nameEN': 'Eurasian Teal',
    'nameSCI': 'Anas crecca'
  },
  {
    'key': 'MX.26373',
    'nameFI': 'sinisorsa',
    'nameSV': 'gräsand',
    'nameEN': 'Mallard',
    'nameSCI': 'Anas platyrhynchos'
  },
  {
    'key': 'MX.26382',
    'nameFI': 'jouhisorsa',
    'nameSV': 'stjärtand',
    'nameEN': 'Northern Pintail',
    'nameSCI': 'Anas acuta'
  },
  {
    'key': 'MX.27058',
    'nameFI': 'viiriäinen',
    'nameSV': 'vaktel',
    'nameEN': 'Common Quail',
    'nameSCI': 'Coturnix coturnix'
  },
  {
    'key': 'MX.27152',
    'nameFI': 'fasaani',
    'nameSV': 'fasan',
    'nameEN': 'Common Pheasant',
    'nameSCI': 'Phasianus colchicus'
  },
  {
    'key': 'MX.26931',
    'nameFI': 'pyy',
    'nameSV': 'järpe',
    'nameEN': 'Hazel Grouse',
    'nameSCI': 'Tetrastes bonasia'
  },
  {
    'key': 'MX.26921',
    'nameFI': 'riekko',
    'nameSV': 'dalripa',
    'nameEN': 'Willow Ptarmigan',
    'nameSCI': 'Lagopus lagopus'
  },
  {
    'key': 'MX.26922',
    'nameFI': 'kiiruna',
    'nameSV': 'fjällripa',
    'nameEN': 'Rock Ptarmigan',
    'nameSCI': 'Lagopus muta'
  },
  {
    'key': 'MX.26928',
    'nameFI': 'metso',
    'nameSV': 'tjäder',
    'nameEN': 'Western Capercaillie',
    'nameSCI': 'Tetrao urogallus'
  },
  {
    'key': 'MX.26926',
    'nameFI': 'teeri',
    'nameSV': 'orre',
    'nameEN': 'Black Grouse',
    'nameSCI': 'Lyrurus tetrix'
  },
  {
    'key': 'MX.27048',
    'nameFI': 'peltopyy',
    'nameSV': 'rapphöna',
    'nameEN': 'Grey Partridge',
    'nameSCI': 'Perdix perdix'
  },
  {
    'key': 'MX.25844',
    'nameFI': 'pikku-uikku',
    'nameSV': 'smådopping',
    'nameEN': 'Little Grebe',
    'nameSCI': 'Tachybaptus ruficollis'
  },
  {
    'key': 'MX.25859',
    'nameFI': 'härkälintu',
    'nameSV': 'gråhakedopping',
    'nameEN': 'Red-necked Grebe',
    'nameSCI': 'Podiceps grisegena'
  },
  {
    'key': 'MX.25860',
    'nameFI': 'silkkiuikku',
    'nameSV': 'skäggdopping',
    'nameEN': 'Great Crested Grebe',
    'nameSCI': 'Podiceps cristatus'
  },
  {
    'key': 'MX.25861',
    'nameFI': 'mustakurkku-uikku',
    'nameSV': 'svarthakedopping',
    'nameEN': 'Horned Grebe',
    'nameSCI': 'Podiceps auritus'
  },
  {
    'key': 'MX.200535',
    'nameFI': 'kesykyyhky',
    'nameSV': 'tamduva',
    'nameEN': 'Rock Dove (Feral Pigeon)',
    'nameSCI': 'Columba livia domestica'
  },
  {
    'key': 'MX.27908',
    'nameFI': 'uuttukyyhky',
    'nameSV': 'skogsduva',
    'nameEN': 'Stock Dove',
    'nameSCI': 'Columba oenas'
  },
  {
    'key': 'MX.27911',
    'nameFI': 'sepelkyyhky',
    'nameSV': 'ringduva',
    'nameEN': 'Common Wood Pigeon',
    'nameSCI': 'Columba palumbus'
  },
  {
    'key': 'MX.27955',
    'nameFI': 'turturikyyhky',
    'nameSV': 'turturduva',
    'nameEN': 'European Turtle Dove',
    'nameSCI': 'Streptopelia turtur'
  },
  {
    'key': 'MX.27960',
    'nameFI': 'turkinkyyhky',
    'nameSV': 'turkduva',
    'nameEN': 'Eurasian Collared Dove',
    'nameSCI': 'Streptopelia decaocto'
  },
  {
    'key': 'MX.29172',
    'nameFI': 'kehrääjä',
    'nameSV': 'nattskärra',
    'nameEN': 'European Nightjar',
    'nameSCI': 'Caprimulgus europaeus'
  },
  {
    'key': 'MX.29324',
    'nameFI': 'tervapääsky',
    'nameSV': 'tornseglare',
    'nameEN': 'Common Swift',
    'nameSCI': 'Apus apus'
  },
  {
    'key': 'MX.28715',
    'nameFI': 'käki',
    'nameSV': 'gök',
    'nameEN': 'Common Cuckoo',
    'nameSCI': 'Cuculus canorus'
  },
  {
    'key': 'MX.27276',
    'nameFI': 'luhtakana',
    'nameSV': 'vattenrall',
    'nameEN': 'Water Rail',
    'nameSCI': 'Rallus aquaticus'
  },
  {
    'key': 'MX.27328',
    'nameFI': 'ruisrääkkä',
    'nameSV': 'kornknarr',
    'nameEN': 'Corn Crake',
    'nameSCI': 'Crex crex'
  },
  {
    'key': 'MX.27345',
    'nameFI': 'luhtahuitti',
    'nameSV': 'småfläckig sumphöna',
    'nameEN': 'Spotted Crake',
    'nameSCI': 'Porzana porzana'
  },
  {
    'key': 'MX.27342',
    'nameFI': 'pikkuhuitti',
    'nameSV': 'mindre sumphöna',
    'nameEN': 'Little Crake',
    'nameSCI': 'Zapornia parva'
  },
  {
    'key': 'MX.27364',
    'nameFI': 'liejukana',
    'nameSV': 'rörhöna',
    'nameEN': 'Common Moorhen',
    'nameSCI': 'Gallinula chloropus'
  },
  {
    'key': 'MX.27381',
    'nameFI': 'nokikana',
    'nameSV': 'sothöna',
    'nameEN': 'Eurasian Coot',
    'nameSCI': 'Fulica atra'
  },
  {
    'key': 'MX.27214',
    'nameFI': 'kurki',
    'nameSV': 'trana',
    'nameEN': 'Common Crane',
    'nameSCI': 'Grus grus'
  },
  {
    'key': 'MX.25836',
    'nameFI': 'kaakkuri',
    'nameSV': 'smålom',
    'nameEN': 'Red-throated Loon',
    'nameSCI': 'Gavia stellata'
  },
  {
    'key': 'MX.25837',
    'nameFI': 'kuikka',
    'nameSV': 'storlom',
    'nameEN': 'Black-throated Loon',
    'nameSCI': 'Gavia arctica'
  },
  {
    'key': 'MX.26164',
    'nameFI': 'kaulushaikara',
    'nameSV': 'rördrom',
    'nameEN': 'Eurasian Bittern',
    'nameSCI': 'Botaurus stellaris'
  },
  {
    'key': 'MX.26094',
    'nameFI': 'harmaahaikara',
    'nameSV': 'gråhäger',
    'nameEN': 'Grey Heron',
    'nameSCI': 'Ardea cinerea'
  },
  {
    'key': 'MX.26105',
    'nameFI': 'jalohaikara',
    'nameSV': 'ägretthäger',
    'nameEN': 'Great Egret',
    'nameSCI': 'Ardea alba'
  },
  {
    'key': 'MX.27459',
    'nameFI': 'meriharakka',
    'nameSV': 'strandskata',
    'nameEN': 'Eurasian Oystercatcher',
    'nameSCI': 'Haematopus ostralegus'
  },
  {
    'key': 'MX.27553',
    'nameFI': 'kapustarinta',
    'nameSV': 'ljungpipare',
    'nameEN': 'European Golden Plover',
    'nameSCI': 'Pluvialis apricaria'
  },
  {
    'key': 'MX.27597',
    'nameFI': 'keräkurmitsa',
    'nameSV': 'fjällpipare',
    'nameEN': 'Eurasian Dotterel',
    'nameSCI': 'Eudromias morinellus'
  },
  {
    'key': 'MX.27559',
    'nameFI': 'tylli',
    'nameSV': 'större strandpipare',
    'nameEN': 'Common Ringed Plover',
    'nameSCI': 'Charadrius hiaticula'
  },
  {
    'key': 'MX.27562',
    'nameFI': 'pikkutylli',
    'nameSV': 'mindre strandpipare',
    'nameEN': 'Little Ringed Plover',
    'nameSCI': 'Charadrius dubius'
  },
  {
    'key': 'MX.27527',
    'nameFI': 'töyhtöhyyppä',
    'nameSV': 'tofsvipa',
    'nameEN': 'Northern Lapwing',
    'nameSCI': 'Vanellus vanellus'
  },
  {
    'key': 'MX.27610',
    'nameFI': 'pikkukuovi',
    'nameSV': 'småspov',
    'nameEN': 'Whimbrel',
    'nameSCI': 'Numenius phaeopus'
  },
  {
    'key': 'MX.27613',
    'nameFI': 'kuovi',
    'nameSV': 'storspov',
    'nameEN': 'Eurasian Curlew',
    'nameSCI': 'Numenius arquata'
  },
  {
    'key': 'MX.27603',
    'nameFI': 'mustapyrstökuiri',
    'nameSV': 'rödspov',
    'nameEN': 'Black-tailed Godwit',
    'nameSCI': 'Limosa limosa'
  },
  {
    'key': 'MX.27605',
    'nameFI': 'punakuiri',
    'nameSV': 'myrspov',
    'nameEN': 'Bar-tailed Godwit',
    'nameSCI': 'Limosa lapponica'
  },
  {
    'key': 'MX.27642',
    'nameFI': 'karikukko',
    'nameSV': 'roskarl',
    'nameEN': 'Ruddy Turnstone',
    'nameSCI': 'Arenaria interpres'
  },
  {
    'key': 'MX.27688',
    'nameFI': 'pikkusirri',
    'nameSV': 'småsnäppa',
    'nameEN': 'Little Stint',
    'nameSCI': 'Calidris minuta'
  },
  {
    'key': 'MX.27689',
    'nameFI': 'lapinsirri',
    'nameSV': 'mosnäppa',
    'nameEN': 'Temmincks Stint',
    'nameSCI': 'Calidris temminckii'
  },
  {
    'key': 'MX.27697',
    'nameFI': 'merisirri',
    'nameSV': 'skärsnäppa',
    'nameEN': 'Purple Sandpiper',
    'nameSCI': 'Calidris maritima'
  },
  {
    'key': 'MX.27699',
    'nameFI': 'suosirri',
    'nameSV': 'kärrsnäppa',
    'nameEN': 'Dunlin',
    'nameSCI': 'Calidris alpina'
  },
  {
    'key': 'MX.27704',
    'nameFI': 'jänkäsirriäinen',
    'nameSV': 'myrsnäppa',
    'nameEN': 'Broad-billed Sandpiper',
    'nameSCI': 'Calidris falcinellus'
  },
  {
    'key': 'MX.27710',
    'nameFI': 'suokukko',
    'nameSV': 'brushane',
    'nameEN': 'Ruff',
    'nameSCI': 'Calidris pugnax'
  },
  {
    'key': 'MX.27649',
    'nameFI': 'lehtokurppa',
    'nameSV': 'morkulla',
    'nameEN': 'Eurasian Woodcock',
    'nameSCI': 'Scolopax rusticola'
  },
  {
    'key': 'MX.27665',
    'nameFI': 'heinäkurppa',
    'nameSV': 'dubbelbeckasin',
    'nameEN': 'Great Snipe',
    'nameSCI': 'Gallinago media'
  },
  {
    'key': 'MX.27666',
    'nameFI': 'taivaanvuohi',
    'nameSV': 'enkelbeckasin',
    'nameEN': 'Common Snipe',
    'nameSCI': 'Gallinago gallinago'
  },
  {
    'key': 'MX.27674',
    'nameFI': 'jänkäkurppa',
    'nameSV': 'Dvärgbeckasin',
    'nameEN': 'Jack Snipe',
    'nameSCI': 'Lymnocryptes minimus'
  },
  {
    'key': 'MX.27632',
    'nameFI': 'rantakurvi',
    'nameSV': 'tereksnäppa',
    'nameEN': 'Terek Sandpiper',
    'nameSCI': 'Xenus cinereus'
  },
  {
    'key': 'MX.27634',
    'nameFI': 'rantasipi',
    'nameSV': 'drillsnäppa',
    'nameEN': 'Common Sandpiper',
    'nameSCI': 'Actitis hypoleucos'
  },
  {
    'key': 'MX.27619',
    'nameFI': 'mustaviklo',
    'nameSV': 'svartsnäppa',
    'nameEN': 'Spotted Redshank',
    'nameSCI': 'Tringa erythropus'
  },
  {
    'key': 'MX.27620',
    'nameFI': 'punajalkaviklo',
    'nameSV': 'rödbena',
    'nameEN': 'Common Redshank',
    'nameSCI': 'Tringa totanus'
  },
  {
    'key': 'MX.27621',
    'nameFI': 'lampiviklo',
    'nameSV': 'dammsnäppa',
    'nameEN': 'Marsh Sandpiper',
    'nameSCI': 'Tringa stagnatilis'
  },
  {
    'key': 'MX.27622',
    'nameFI': 'valkoviklo',
    'nameSV': 'gluttsnäppa',
    'nameEN': 'Common Greenshank',
    'nameSCI': 'Tringa nebularia'
  },
  {
    'key': 'MX.27626',
    'nameFI': 'metsäviklo',
    'nameSV': 'skogssnäppa',
    'nameEN': 'Green Sandpiper',
    'nameSCI': 'Tringa ochropus'
  },
  {
    'key': 'MX.27628',
    'nameFI': 'liro',
    'nameSV': 'grönbena',
    'nameEN': 'Wood Sandpiper',
    'nameSCI': 'Tringa glareola'
  },
  {
    'key': 'MX.27646',
    'nameFI': 'vesipääsky',
    'nameSV': 'smalnäbbad simsnäppa',
    'nameEN': 'Red-necked Phalarope',
    'nameSCI': 'Phalaropus lobatus'
  },
  {
    'key': 'MX.27855',
    'nameFI': 'riskilä',
    'nameSV': 'tobisgrissla',
    'nameEN': 'Black Guillemot',
    'nameSCI': 'Cepphus grylle'
  },
  {
    'key': 'MX.27850',
    'nameFI': 'ruokki',
    'nameSV': 'tordmule',
    'nameEN': 'Razorbill',
    'nameSCI': 'Alca torda'
  },
  {
    'key': 'MX.27853',
    'nameFI': 'etelänkiisla',
    'nameSV': 'sillgrissla',
    'nameEN': 'Common Murre',
    'nameSCI': 'Uria aalge'
  },
  {
    'key': 'MX.27730',
    'nameFI': 'merikihu',
    'nameSV': 'kustlabb',
    'nameEN': 'Parasitic Jaeger',
    'nameSCI': 'Stercorarius parasiticus'
  },
  {
    'key': 'MX.27731',
    'nameFI': 'tunturikihu',
    'nameSV': 'fjällabb',
    'nameEN': 'Long-tailed Jaeger',
    'nameSCI': 'Stercorarius longicaudus'
  },
  {
    'key': 'MX.27774',
    'nameFI': 'naurulokki',
    'nameSV': 'skrattmås',
    'nameEN': 'Black-headed Gull',
    'nameSCI': 'Chroicocephalus ridibundus'
  },
  {
    'key': 'MX.27777',
    'nameFI': 'pikkulokki',
    'nameSV': 'dvärgmås',
    'nameEN': 'Little Gull',
    'nameSCI': 'Hydrocoloeus minutus'
  },
  {
    'key': 'MX.27748',
    'nameFI': 'kalalokki',
    'nameSV': 'fiskmås',
    'nameEN': 'Mew Gull',
    'nameSCI': 'Larus canus'
  },
  {
    'key': 'MX.27750',
    'nameFI': 'harmaalokki',
    'nameSV': 'gråtrut',
    'nameEN': 'European Herring Gull',
    'nameSCI': 'Larus argentatus'
  },
  {
    'key': 'MX.27753',
    'nameFI': 'selkälokki',
    'nameSV': 'silltrut',
    'nameEN': 'Lesser Black-backed Gull',
    'nameSCI': 'Larus fuscus'
  },
  {
    'key': 'MX.27759',
    'nameFI': 'merilokki',
    'nameSV': 'havstrut',
    'nameEN': 'Great Black-backed Gull',
    'nameSCI': 'Larus marinus'
  },
  {
    'key': 'MX.27821',
    'nameFI': 'pikkutiira',
    'nameSV': 'småtärna',
    'nameEN': 'Little Tern',
    'nameSCI': 'Sternula albifrons'
  },
  {
    'key': 'MX.27797',
    'nameFI': 'räyskä',
    'nameSV': 'skräntärna',
    'nameEN': 'Caspian Tern',
    'nameSCI': 'Hydroprogne caspia'
  },
  {
    'key': 'MX.27791',
    'nameFI': 'mustatiira',
    'nameSV': 'svarttärna',
    'nameEN': 'Black Tern',
    'nameSCI': 'Chlidonias niger'
  },
  {
    'key': 'MX.27801',
    'nameFI': 'kalatiira',
    'nameSV': 'fisktärna',
    'nameEN': 'Common Tern',
    'nameSCI': 'Sterna hirundo'
  },
  {
    'key': 'MX.27802',
    'nameFI': 'lapintiira',
    'nameSV': 'silvertärna',
    'nameEN': 'Arctic Tern',
    'nameSCI': 'Sterna paradisaea'
  },
  {
    'key': 'MX.26472',
    'nameFI': 'sääksi',
    'nameSV': 'fiskgjuse',
    'nameEN': 'Osprey',
    'nameSCI': 'Pandion haliaetus'
  },
  {
    'key': 'MX.26488',
    'nameFI': 'mehiläishaukka',
    'nameSV': 'bivråk',
    'nameEN': 'European Honey Buzzard',
    'nameSCI': 'Pernis apivorus'
  },
  {
    'key': 'MX.26723',
    'nameFI': 'kiljukotka',
    'nameSV': 'större skrikörn',
    'nameEN': 'Greater Spotted Eagle',
    'nameSCI': 'Clanga clanga'
  },
  {
    'key': 'MX.26727',
    'nameFI': 'maakotka',
    'nameSV': 'kungsörn',
    'nameEN': 'Golden Eagle',
    'nameSCI': 'Aquila chrysaetos'
  },
  {
    'key': 'MX.26597',
    'nameFI': 'ruskosuohaukka',
    'nameSV': 'brun kärrhök',
    'nameEN': 'Western Marsh Harrier',
    'nameSCI': 'Circus aeruginosus'
  },
  {
    'key': 'MX.26592',
    'nameFI': 'sinisuohaukka',
    'nameSV': 'blå kärrhök',
    'nameEN': 'Hen Harrier',
    'nameSCI': 'Circus cyaneus'
  },
  {
    'key': 'MX.26596',
    'nameFI': 'niittysuohaukka',
    'nameSV': 'ängshök',
    'nameEN': 'Montagus Harrier',
    'nameSCI': 'Circus pygargus'
  },
  {
    'key': 'MX.26639',
    'nameFI': 'varpushaukka',
    'nameSV': 'sparvhök',
    'nameEN': 'Eurasian Sparrowhawk',
    'nameSCI': 'Accipiter nisus'
  },
  {
    'key': 'MX.26647',
    'nameFI': 'kanahaukka',
    'nameSV': 'duvhök',
    'nameEN': 'Northern Goshawk',
    'nameSCI': 'Accipiter gentilis'
  },
  {
    'key': 'MX.26530',
    'nameFI': 'merikotka',
    'nameSV': 'havsörn',
    'nameEN': 'White-tailed Sea Eagle',
    'nameSCI': 'Haliaeetus albicilla'
  },
  {
    'key': 'MX.26518',
    'nameFI': 'haarahaukka',
    'nameSV': 'brun glada',
    'nameEN': 'Black Kite',
    'nameSCI': 'Milvus migrans'
  },
  {
    'key': 'MX.26701',
    'nameFI': 'hiirihaukka',
    'nameSV': 'ormvråk',
    'nameEN': 'Common Buzzard',
    'nameSCI': 'Buteo buteo'
  },
  {
    'key': 'MX.26704',
    'nameFI': 'piekana',
    'nameSV': 'fjällvråk',
    'nameEN': 'Rough-legged Buzzard',
    'nameSCI': 'Buteo lagopus'
  },
  {
    'key': 'MX.29008',
    'nameFI': 'hiiripöllö',
    'nameSV': 'hökuggla',
    'nameEN': 'Northern Hawk-Owl',
    'nameSCI': 'Surnia ulula'
  },
  {
    'key': 'MX.29011',
    'nameFI': 'varpuspöllö',
    'nameSV': 'sparvuggla',
    'nameEN': 'Eurasian Pygmy Owl',
    'nameSCI': 'Glaucidium passerinum'
  },
  {
    'key': 'MX.29038',
    'nameFI': 'helmipöllö',
    'nameSV': 'pärluggla',
    'nameEN': 'Boreal Owl',
    'nameSCI': 'Aegolius funereus'
  },
  {
    'key': 'MX.29068',
    'nameFI': 'sarvipöllö',
    'nameSV': 'hornuggla',
    'nameEN': 'Long-eared Owl',
    'nameSCI': 'Asio otus'
  },
  {
    'key': 'MX.29072',
    'nameFI': 'suopöllö',
    'nameSV': 'jorduggla',
    'nameEN': 'Short-eared Owl',
    'nameSCI': 'Asio flammeus'
  },
  {
    'key': 'MX.28998',
    'nameFI': 'lehtopöllö',
    'nameSV': 'kattuggla',
    'nameEN': 'Tawny Owl',
    'nameSCI': 'Strix aluco'
  },
  {
    'key': 'MX.29003',
    'nameFI': 'viirupöllö',
    'nameSV': 'slaguggla',
    'nameEN': 'Ural Owl',
    'nameSCI': 'Strix uralensis'
  },
  {
    'key': 'MX.29004',
    'nameFI': 'lapinpöllö',
    'nameSV': 'lappuggla',
    'nameEN': 'Great Grey Owl',
    'nameSCI': 'Strix nebulosa'
  },
  {
    'key': 'MX.28965',
    'nameFI': 'huuhkaja',
    'nameSV': 'berguv',
    'nameEN': 'Eurasian Eagle-owl',
    'nameSCI': 'Bubo bubo'
  },
  {
    'key': 'MX.28987',
    'nameFI': 'tunturipöllö',
    'nameSV': 'fjälluggla',
    'nameEN': 'Snowy Owl',
    'nameSCI': 'Bubo scandiacus'
  },
  {
    'key': 'MX.30333',
    'nameFI': 'käenpiika',
    'nameSV': 'göktyta',
    'nameEN': 'Eurasian Wryneck',
    'nameSCI': 'Jynx torquilla'
  },
  {
    'key': 'MX.30530',
    'nameFI': 'harmaapäätikka',
    'nameSV': 'gråspett',
    'nameEN': 'Grey-headed Woodpecker',
    'nameSCI': 'Picus canus'
  },
  {
    'key': 'MX.30504',
    'nameFI': 'palokärki',
    'nameSV': 'spillkråka',
    'nameEN': 'Black Woodpecker',
    'nameSCI': 'Dryocopus martius'
  },
  {
    'key': 'MX.30428',
    'nameFI': 'pikkutikka',
    'nameSV': 'mindre hackspett',
    'nameEN': 'Lesser Spotted Woodpecker',
    'nameSCI': 'Dendrocopos minor'
  },
  {
    'key': 'MX.30438',
    'nameFI': 'valkoselkätikka',
    'nameSV': 'vitryggig hackspett',
    'nameEN': 'White-backed Woodpecker',
    'nameSCI': 'Dendrocopos leucotos'
  },
  {
    'key': 'MX.30443',
    'nameFI': 'käpytikka',
    'nameSV': 'större hackspett',
    'nameEN': 'Great Spotted Woodpecker',
    'nameSCI': 'Dendrocopos major'
  },
  {
    'key': 'MX.30453',
    'nameFI': 'pohjantikka',
    'nameSV': 'tretåig hackspett',
    'nameEN': 'Eurasian Three-toed Woodpecker',
    'nameSCI': 'Picoides tridactylus'
  },
  {
    'key': 'MX.29860',
    'nameFI': 'kuningaskalastaja',
    'nameSV': 'kungsfiskare',
    'nameEN': 'Common Kingfisher',
    'nameSCI': 'Alcedo atthis'
  },
  {
    'key': 'MX.26796',
    'nameFI': 'tuulihaukka',
    'nameSV': 'tornfalk',
    'nameEN': 'Common Kestrel',
    'nameSCI': 'Falco tinnunculus'
  },
  {
    'key': 'MX.26808',
    'nameFI': 'ampuhaukka',
    'nameSV': 'stenfalk',
    'nameEN': 'Merlin',
    'nameSCI': 'Falco columbarius'
  },
  {
    'key': 'MX.26811',
    'nameFI': 'nuolihaukka',
    'nameSV': 'lärkfalk',
    'nameEN': 'Eurasian Hobby',
    'nameSCI': 'Falco subbuteo'
  },
  {
    'key': 'MX.26825',
    'nameFI': 'tunturihaukka',
    'nameSV': 'jaktfalk',
    'nameEN': 'Gyrfalcon',
    'nameSCI': 'Falco rusticolus'
  },
  {
    'key': 'MX.26828',
    'nameFI': 'muuttohaukka',
    'nameSV': 'pilgrimsfalk',
    'nameEN': 'Peregrine Falcon',
    'nameSCI': 'Falco peregrinus'
  },
  {
    'key': 'MX.36871',
    'nameFI': 'kuhankeittäjä',
    'nameSV': 'sommargylling',
    'nameEN': 'Eurasian Golden Oriole',
    'nameSCI': 'Oriolus oriolus'
  },
  {
    'key': 'MX.32561',
    'nameFI': 'pikkulepinkäinen',
    'nameSV': 'törnskata',
    'nameEN': 'Red-backed Shrike',
    'nameSCI': 'Lanius collurio'
  },
  {
    'key': 'MX.32570',
    'nameFI': 'isolepinkäinen',
    'nameSV': 'varfågel',
    'nameEN': 'Great Grey Shrike',
    'nameSCI': 'Lanius excubitor'
  },
  {
    'key': 'MX.37095',
    'nameFI': 'kuukkeli',
    'nameSV': 'lavskrika',
    'nameEN': 'Siberian Jay',
    'nameSCI': 'Perisoreus infaustus'
  },
  {
    'key': 'MX.37090',
    'nameFI': 'närhi',
    'nameSV': 'nötskrika',
    'nameEN': 'Eurasian Jay',
    'nameSCI': 'Garrulus glandarius'
  },
  {
    'key': 'MX.37122',
    'nameFI': 'harakka',
    'nameSV': 'skata',
    'nameEN': 'Eurasian Magpie',
    'nameSCI': 'Pica pica'
  },
  {
    'key': 'MX.37135',
    'nameFI': 'pähkinähakki',
    'nameSV': 'nötkråka',
    'nameEN': 'Spotted Nutcracker',
    'nameSCI': 'Nucifraga caryocatactes'
  },
  {
    'key': 'MX.37142',
    'nameFI': 'naakka',
    'nameSV': 'kaja',
    'nameEN': 'Western Jackdaw',
    'nameSCI': 'Corvus monedula'
  },
  {
    'key': 'MX.37156',
    'nameFI': 'mustavaris',
    'nameSV': 'råka',
    'nameEN': 'Rook',
    'nameSCI': 'Corvus frugilegus'
  },
  {
    'key': 'MX.37178',
    'nameFI': 'korppi',
    'nameSV': 'korp',
    'nameEN': 'Northern Raven',
    'nameSCI': 'Corvus corax'
  },
  {
    'key': 'MX.73566',
    'nameFI': 'varis',
    'nameSV': 'kråka',
    'nameEN': 'Carrion Crow',
    'nameSCI': 'Corvus corone'
  },
  {
    'key': 'MX.32772',
    'nameFI': 'rautiainen',
    'nameSV': 'järnsparv',
    'nameEN': 'Dunnock',
    'nameSCI': 'Prunella modularis'
  },
  {
    'key': 'MX.36573',
    'nameFI': 'varpunen',
    'nameSV': 'gråsparv',
    'nameEN': 'House Sparrow',
    'nameSCI': 'Passer domesticus'
  },
  {
    'key': 'MX.36589',
    'nameFI': 'pikkuvarpunen',
    'nameSV': 'pilfink',
    'nameEN': 'Eurasian Tree Sparrow',
    'nameSCI': 'Passer montanus'
  },
  {
    'key': 'MX.32207',
    'nameFI': 'nummikirvinen',
    'nameSV': 'fältpiplärka',
    'nameEN': 'Tawny Pipit',
    'nameSCI': 'Anthus campestris'
  },
  {
    'key': 'MX.32213',
    'nameFI': 'niittykirvinen',
    'nameSV': 'ängspiplärka',
    'nameEN': 'Meadow Pipit',
    'nameSCI': 'Anthus pratensis'
  },
  {
    'key': 'MX.32214',
    'nameFI': 'metsäkirvinen',
    'nameSV': 'trädpiplärka',
    'nameEN': 'Tree Pipit',
    'nameSCI': 'Anthus trivialis'
  },
  {
    'key': 'MX.32217',
    'nameFI': 'lapinkirvinen',
    'nameSV': 'rödstrupig piplärka',
    'nameEN': 'Red-throated Pipit',
    'nameSCI': 'Anthus cervinus'
  },
  {
    'key': 'MX.32221',
    'nameFI': 'luotokirvinen',
    'nameSV': 'skärpiplärka',
    'nameEN': 'Eurasian Rock Pipit',
    'nameSCI': 'Anthus petrosus'
  },
  {
    'key': 'MX.32180',
    'nameFI': 'keltavästäräkki',
    'nameSV': 'gulärla',
    'nameEN': 'Western Yellow Wagtail',
    'nameSCI': 'Motacilla flava'
  },
  {
    'key': 'MX.32181',
    'nameFI': 'sitruunavästäräkki',
    'nameSV': 'citronärla',
    'nameEN': 'Citrine Wagtail',
    'nameSCI': 'Motacilla citreola'
  },
  {
    'key': 'MX.32182',
    'nameFI': 'virtavästäräkki',
    'nameSV': 'forsärla',
    'nameEN': 'Grey Wagtail',
    'nameSCI': 'Motacilla cinerea'
  },
  {
    'key': 'MX.32183',
    'nameFI': 'västäräkki',
    'nameSV': 'sädesärla',
    'nameEN': 'White Wagtail',
    'nameSCI': 'Motacilla alba'
  },
  {
    'key': 'MX.36237',
    'nameFI': 'peippo',
    'nameSV': 'bofink',
    'nameEN': 'Common Chaffinch',
    'nameSCI': 'Fringilla coelebs'
  },
  {
    'key': 'MX.36239',
    'nameFI': 'järripeippo',
    'nameSV': 'bergfink',
    'nameEN': 'Brambling',
    'nameSCI': 'Fringilla montifringilla'
  },
  {
    'key': 'MX.36368',
    'nameFI': 'nokkavarpunen',
    'nameSV': 'stenknäck',
    'nameEN': 'Hawfinch',
    'nameSCI': 'Coccothraustes coccothraustes'
  },
  {
    'key': 'MX.36331',
    'nameFI': 'punavarpunen',
    'nameSV': 'rosenfink',
    'nameEN': 'Common Rosefinch',
    'nameSCI': 'Erythrina erythrina'
  },
  {
    'key': 'MX.36351',
    'nameFI': 'taviokuurna',
    'nameSV': 'tallbit',
    'nameEN': 'Pine Grosbeak',
    'nameSCI': 'Pinicola enucleator'
  },
  {
    'key': 'MX.36366',
    'nameFI': 'punatulkku',
    'nameSV': 'domherre',
    'nameEN': 'Eurasian Bullfinch',
    'nameSCI': 'Pyrrhula pyrrhula'
  },
  {
    'key': 'MX.36283',
    'nameFI': 'viherpeippo',
    'nameSV': 'grönfink',
    'nameEN': 'European Greenfinch',
    'nameSCI': 'Chloris chloris'
  },
  {
    'key': 'MX.36309',
    'nameFI': 'vuorihemppo',
    'nameSV': 'Vinterhämpling',
    'nameEN': 'Twite',
    'nameSCI': 'Linaria flavirostris'
  },
  {
    'key': 'MX.36310',
    'nameFI': 'hemppo',
    'nameSV': 'hämpling',
    'nameEN': 'Common Linnet',
    'nameSCI': 'Linaria cannabina'
  },
  {
    'key': 'MX.36308',
    'nameFI': 'urpiainen',
    'nameSV': 'gråsiska',
    'nameEN': 'Common Redpoll',
    'nameSCI': 'Acanthis flammea'
  },
  {
    'key': 'MX.73545',
    'nameFI': 'tundraurpiainen',
    'nameSV': 'snösiska',
    'nameEN': 'Arctic Redpoll',
    'nameSCI': 'Acanthis hornemanni'
  },
  {
    'key': 'MX.36356',
    'nameFI': 'isokäpylintu',
    'nameSV': 'större korsnäbb',
    'nameEN': 'Parrot Crossbill',
    'nameSCI': 'Loxia pytyopsittacus'
  },
  {
    'key': 'MX.36358',
    'nameFI': 'pikkukäpylintu',
    'nameSV': 'mindre korsnäbb',
    'nameEN': 'Red Crossbill',
    'nameSCI': 'Loxia curvirostra'
  },
  {
    'key': 'MX.36359',
    'nameFI': 'kirjosiipikäpylintu',
    'nameSV': 'bändelkorsnäbb',
    'nameEN': 'Two-barred Crossbill',
    'nameSCI': 'Loxia leucoptera'
  },
  {
    'key': 'MX.36306',
    'nameFI': 'tikli',
    'nameSV': 'steglits',
    'nameEN': 'European Goldfinch',
    'nameSCI': 'Carduelis carduelis'
  },
  {
    'key': 'MX.36242',
    'nameFI': 'keltahemppo',
    'nameSV': 'gulhämpling',
    'nameEN': 'European Serin',
    'nameSCI': 'Serinus serinus'
  },
  {
    'key': 'MX.36287',
    'nameFI': 'vihervarpunen',
    'nameSV': 'grönsiska',
    'nameEN': 'Eurasian Siskin',
    'nameSCI': 'Spinus spinus'
  },
  {
    'key': 'MX.35185',
    'nameFI': 'lapinsirkku',
    'nameSV': 'lappsparv',
    'nameEN': 'Lapland Longspur',
    'nameSCI': 'Calcarius lapponicus'
  },
  {
    'key': 'MX.35189',
    'nameFI': 'pulmunen',
    'nameSV': 'snösparv',
    'nameEN': 'Snow Bunting',
    'nameSCI': 'Plectrophenax nivalis'
  },
  {
    'key': 'MX.35146',
    'nameFI': 'keltasirkku',
    'nameSV': 'gulsparv',
    'nameEN': 'Yellowhammer',
    'nameSCI': 'Emberiza citrinella'
  },
  {
    'key': 'MX.35154',
    'nameFI': 'peltosirkku',
    'nameSV': 'ortolansparv',
    'nameEN': 'Ortolan Bunting',
    'nameSCI': 'Emberiza hortulana'
  },
  {
    'key': 'MX.35165',
    'nameFI': 'pikkusirkku',
    'nameSV': 'dvärgsparv',
    'nameEN': 'Little Bunting',
    'nameSCI': 'Schoeniclus pusillus'
  },
  {
    'key': 'MX.35167',
    'nameFI': 'pohjansirkku',
    'nameSV': 'videsparv',
    'nameEN': 'Rustic Bunting',
    'nameSCI': 'Schoeniclus rusticus'
  },
  {
    'key': 'MX.35169',
    'nameFI': 'kultasirkku',
    'nameSV': 'gyllensparv',
    'nameEN': 'Yellow-breasted Bunting',
    'nameSCI': 'Schoeniclus aureolus'
  },
  {
    'key': 'MX.35182',
    'nameFI': 'pajusirkku',
    'nameSV': 'sävsparv',
    'nameEN': 'Common Reed Bunting',
    'nameSCI': 'Schoeniclus schoeniclus'
  },
  {
    'key': 'MX.34549',
    'nameFI': 'kuusitiainen',
    'nameSV': 'svartmes',
    'nameEN': 'Coal Tit',
    'nameSCI': 'Periparus ater'
  },
  {
    'key': 'MX.34553',
    'nameFI': 'töyhtötiainen',
    'nameSV': 'tofsmes',
    'nameEN': 'European Crested Tit',
    'nameSCI': 'Lophophanes cristatus'
  },
  {
    'key': 'MX.34535',
    'nameFI': 'hömötiainen',
    'nameSV': 'talltita',
    'nameEN': 'Willow Tit',
    'nameSCI': 'Poecile montanus'
  },
  {
    'key': 'MX.34542',
    'nameFI': 'lapintiainen',
    'nameSV': 'lappmes',
    'nameEN': 'Siberian Tit',
    'nameSCI': 'Poecile cinctus'
  },
  {
    'key': 'MX.34574',
    'nameFI': 'sinitiainen',
    'nameSV': 'blåmes',
    'nameEN': 'Eurasian Blue Tit',
    'nameSCI': 'Cyanistes caeruleus'
  },
  {
    'key': 'MX.34575',
    'nameFI': 'valkopäätiainen',
    'nameSV': 'azurmes',
    'nameEN': 'Azure Tit',
    'nameSCI': 'Cyanistes cyanus'
  },
  {
    'key': 'MX.34567',
    'nameFI': 'talitiainen',
    'nameSV': 'talgoxe',
    'nameEN': 'Great Tit',
    'nameSCI': 'Parus major'
  },
  {
    'key': 'MX.34517',
    'nameFI': 'pussitiainen',
    'nameSV': 'pungmes',
    'nameEN': 'Eurasian Penduline Tit',
    'nameSCI': 'Remiz pendulinus'
  },
  {
    'key': 'MX.32076',
    'nameFI': 'tunturikiuru',
    'nameSV': 'berglärka',
    'nameEN': 'Horned Lark',
    'nameSCI': 'Eremophila alpestris'
  },
  {
    'key': 'MX.32063',
    'nameFI': 'kangaskiuru',
    'nameSV': 'trädlärka',
    'nameEN': 'Woodlark',
    'nameSCI': 'Lullula arborea'
  },
  {
    'key': 'MX.32065',
    'nameFI': 'kiuru',
    'nameSV': 'sånglärka',
    'nameEN': 'Eurasian Skylark',
    'nameSCI': 'Alauda arvensis'
  },
  {
    'key': 'MX.33492',
    'nameFI': 'viiksitimali',
    'nameSV': 'skäggmes',
    'nameEN': 'Bearded Reedling',
    'nameSCI': 'Panurus biarmicus'
  },
  {
    'key': 'MX.33630',
    'nameFI': 'pensassirkkalintu',
    'nameSV': 'gräshoppsångare',
    'nameEN': 'Common Grasshopper Warbler',
    'nameSCI': 'Locustella naevia'
  },
  {
    'key': 'MX.33634',
    'nameFI': 'viitasirkkalintu',
    'nameSV': 'flodsångare',
    'nameEN': 'River Warbler',
    'nameSCI': 'Locustella fluviatilis'
  },
  {
    'key': 'MX.33635',
    'nameFI': 'ruokosirkkalintu',
    'nameSV': 'vassångare',
    'nameEN': 'Savis Warbler',
    'nameSCI': 'Locustella luscinioides'
  },
  {
    'key': 'MX.33676',
    'nameFI': 'kultarinta',
    'nameSV': 'härmsångare',
    'nameEN': 'Icterine Warbler',
    'nameSCI': 'Hippolais icterina'
  },
  {
    'key': 'MX.33641',
    'nameFI': 'ruokokerttunen',
    'nameSV': 'sävsångare',
    'nameEN': 'Sedge Warbler',
    'nameSCI': 'Acrocephalus schoenobaenus'
  },
  {
    'key': 'MX.33646',
    'nameFI': 'rytikerttunen',
    'nameSV': 'rörsångare',
    'nameEN': 'Common Reed Warbler',
    'nameSCI': 'Acrocephalus scirpaceus'
  },
  {
    'key': 'MX.33649',
    'nameFI': 'luhtakerttunen',
    'nameSV': 'kärrsångare',
    'nameEN': 'Marsh Warbler',
    'nameSCI': 'Acrocephalus palustris'
  },
  {
    'key': 'MX.33650',
    'nameFI': 'viitakerttunen',
    'nameSV': 'busksångare',
    'nameEN': 'Blyths Reed Warbler',
    'nameSCI': 'Acrocephalus dumetorum'
  },
  {
    'key': 'MX.33651',
    'nameFI': 'rastaskerttunen',
    'nameSV': 'trastsångare',
    'nameEN': 'Great Reed Warbler',
    'nameSCI': 'Acrocephalus arundinaceus'
  },
  {
    'key': 'MX.32163',
    'nameFI': 'räystäspääsky',
    'nameSV': 'hussvala',
    'nameEN': 'Common House Martin',
    'nameSCI': 'Delichon urbicum'
  },
  {
    'key': 'MX.32132',
    'nameFI': 'haarapääsky',
    'nameSV': 'ladusvala',
    'nameEN': 'Barn Swallow',
    'nameSCI': 'Hirundo rustica'
  },
  {
    'key': 'MX.32120',
    'nameFI': 'törmäpääsky',
    'nameSV': 'backsvala',
    'nameEN': 'Sand Martin',
    'nameSCI': 'Riparia riparia'
  },
  {
    'key': 'MX.33878',
    'nameFI': 'sirittäjä',
    'nameSV': 'grönsångare',
    'nameEN': 'Wood Warbler',
    'nameSCI': 'Rhadina sibilatrix'
  },
  {
    'key': 'MX.33873',
    'nameFI': 'pajulintu',
    'nameSV': 'lövsångare',
    'nameEN': 'Willow Warbler',
    'nameSCI': 'Phylloscopus trochilus'
  },
  {
    'key': 'MX.33874',
    'nameFI': 'tiltaltti',
    'nameSV': 'gransångare',
    'nameEN': 'Common Chiffchaff',
    'nameSCI': 'Phylloscopus collybita'
  },
  {
    'key': 'MX.33890',
    'nameFI': 'lapinuunilintu',
    'nameSV': 'nordsångare',
    'nameEN': 'Arctic Warbler',
    'nameSCI': 'Seicercus borealis'
  },
  {
    'key': 'MX.33891',
    'nameFI': 'idänuunilintu',
    'nameSV': 'lundsångare',
    'nameEN': 'Greenish Warbler',
    'nameSCI': 'Seicercus trochiloides'
  },
  {
    'key': 'MX.34505',
    'nameFI': 'pyrstötiainen',
    'nameSV': 'stjärtmes',
    'nameEN': 'Long-tailed Tit',
    'nameSCI': 'Aegithalos caudatus'
  },
  {
    'key': 'MX.33934',
    'nameFI': 'mustapääkerttu',
    'nameSV': 'svarthätta',
    'nameEN': 'Eurasian Blackcap',
    'nameSCI': 'Sylvia atricapilla'
  },
  {
    'key': 'MX.33935',
    'nameFI': 'lehtokerttu',
    'nameSV': 'trädgårdssångare',
    'nameEN': 'Garden Warbler',
    'nameSCI': 'Sylvia borin'
  },
  {
    'key': 'MX.33936',
    'nameFI': 'pensaskerttu',
    'nameSV': 'törnsångare',
    'nameEN': 'Common Whitethroat',
    'nameSCI': 'Curruca communis'
  },
  {
    'key': 'MX.33937',
    'nameFI': 'hernekerttu',
    'nameSV': 'ärtsångare',
    'nameEN': 'Lesser Whitethroat',
    'nameSCI': 'Curruca curruca'
  },
  {
    'key': 'MX.33939',
    'nameFI': 'kirjokerttu',
    'nameSV': 'höksångare',
    'nameEN': 'Barred Warbler',
    'nameSCI': 'Curruca nisoria'
  },
  {
    'key': 'MX.33954',
    'nameFI': 'hippiäinen',
    'nameSV': 'kungsfågel',
    'nameEN': 'Goldcrest',
    'nameSCI': 'Regulus regulus'
  },
  {
    'key': 'MX.33952',
    'nameFI': 'tulipäähippiäinen',
    'nameSV': 'brandkronad kungsfågel',
    'nameEN': 'Common Firecrest',
    'nameSCI': 'Regulus ignicapilla'
  },
  {
    'key': 'MX.32608',
    'nameFI': 'tilhi',
    'nameSV': 'sidensvans',
    'nameEN': 'Bohemian Waxwing',
    'nameSCI': 'Bombycilla garrulus'
  },
  {
    'key': 'MX.34616',
    'nameFI': 'puukiipijä',
    'nameSV': 'trädkrypare',
    'nameEN': 'Eurasian Treecreeper',
    'nameSCI': 'Certhia familiaris'
  },
  {
    'key': 'MX.34586',
    'nameFI': 'pähkinänakkeli',
    'nameSV': 'nötväcka',
    'nameEN': 'Eurasian Nuthatch',
    'nameSCI': 'Sitta europaea'
  },
  {
    'key': 'MX.32696',
    'nameFI': 'peukaloinen',
    'nameSV': 'gärdsmyg',
    'nameEN': 'Eurasian Wren',
    'nameSCI': 'Troglodytes troglodytes'
  },
  {
    'key': 'MX.36817',
    'nameFI': 'kottarainen',
    'nameSV': 'stare',
    'nameEN': 'Common Starling',
    'nameSCI': 'Sturnus vulgaris'
  },
  {
    'key': 'MX.32625',
    'nameFI': 'koskikara',
    'nameSV': 'strömstare',
    'nameEN': 'White-throated Dipper',
    'nameSCI': 'Cinclus cinclus'
  },
  {
    'key': 'MX.33989',
    'nameFI': 'harmaasieppo',
    'nameSV': 'grå flugsnappare',
    'nameEN': 'Spotted Flycatcher',
    'nameSCI': 'Muscicapa striata'
  },
  {
    'key': 'MX.32801',
    'nameFI': 'punarinta',
    'nameSV': 'rödhake',
    'nameEN': 'European Robin',
    'nameSCI': 'Erithacus rubecula'
  },
  {
    'key': 'MX.32819',
    'nameFI': 'satakieli',
    'nameSV': 'näktergal',
    'nameEN': 'Thrush Nightingale',
    'nameSCI': 'Luscinia luscinia'
  },
  {
    'key': 'MX.32821',
    'nameFI': 'sinirinta',
    'nameSV': 'blåhake',
    'nameEN': 'Bluethroat',
    'nameSCI': 'Luscinia svecica'
  },
  {
    'key': 'MX.32816',
    'nameFI': 'sinipyrstö',
    'nameSV': 'blåstjärt',
    'nameEN': 'Red-flanked Bluetail',
    'nameSCI': 'Tarsiger cyanurus'
  },
  {
    'key': 'MX.34021',
    'nameFI': 'kirjosieppo',
    'nameSV': 'svartvit flugsnappare',
    'nameEN': 'European Pied Flycatcher',
    'nameSCI': 'Ficedula hypoleuca'
  },
  {
    'key': 'MX.34029',
    'nameFI': 'pikkusieppo',
    'nameSV': 'mindre flugsnappare',
    'nameEN': 'Red-breasted Flycatcher',
    'nameSCI': 'Ficedula parva'
  },
  {
    'key': 'MX.32894',
    'nameFI': 'mustaleppälintu',
    'nameSV': 'svart rödstjärt',
    'nameEN': 'Black Redstart',
    'nameSCI': 'Phoenicurus ochruros'
  },
  {
    'key': 'MX.32895',
    'nameFI': 'leppälintu',
    'nameSV': 'rödstjärt',
    'nameEN': 'Common Redstart',
    'nameSCI': 'Phoenicurus phoenicurus'
  },
  {
    'key': 'MX.32949',
    'nameFI': 'pensastasku',
    'nameSV': 'buskskvätta',
    'nameEN': 'Whinchat',
    'nameSCI': 'Saxicola rubetra'
  },
  {
    'key': 'MX.32953',
    'nameFI': 'mustapäätasku',
    'nameSV': 'svarthakad buskskvätta',
    'nameEN': 'European Stonechat',
    'nameSCI': 'Saxicola rubicola'
  },
  {
    'key': 'MX.32966',
    'nameFI': 'kivitasku',
    'nameSV': 'stenskvätta',
    'nameEN': 'Northern Wheatear',
    'nameSCI': 'Oenanthe oenanthe'
  },
  {
    'key': 'MX.33104',
    'nameFI': 'sepelrastas',
    'nameSV': 'ringtrast',
    'nameEN': 'Ring Ouzel',
    'nameSCI': 'Turdus torquatus'
  },
  {
    'key': 'MX.33106',
    'nameFI': 'mustarastas',
    'nameSV': 'koltrast',
    'nameEN': 'Common Blackbird',
    'nameSCI': 'Turdus merula'
  },
  {
    'key': 'MX.33117',
    'nameFI': 'räkättirastas',
    'nameSV': 'björktrast',
    'nameEN': 'Fieldfare',
    'nameSCI': 'Turdus pilaris'
  },
  {
    'key': 'MX.33118',
    'nameFI': 'punakylkirastas',
    'nameSV': 'rödvingetrast',
    'nameEN': 'Redwing',
    'nameSCI': 'Turdus iliacus'
  },
  {
    'key': 'MX.33119',
    'nameFI': 'laulurastas',
    'nameSV': 'taltrast',
    'nameEN': 'Song Thrush',
    'nameSCI': 'Turdus philomelos'
  },
  {
    'key': 'MX.33121',
    'nameFI': 'kulorastas',
    'nameSV': 'dubbeltrast',
    'nameEN': 'Mistle Thrush',
    'nameSCI': 'Turdus viscivorus'
  }
]

export const availableForms = ['JX.519', 'MHL.117', 'JX.652', 'MHL.45']

export const useUiSchemaFields = ['MHL.45']