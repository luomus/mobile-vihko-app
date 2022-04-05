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
        validate: value => value !== 'empty' || 'must choose list type'
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
    'nameSCI': 'Cygnus olor',
    'nameFI': 'kyhmyjoutsen',
    'nameSV': 'knölsvan',
    'nameEN': 'Mute Swan'
  },
  {
    'key': 'MX.26280',
    'nameSCI': 'Cygnus cygnus',
    'nameFI': 'laulujoutsen',
    'nameSV': 'sångsvan',
    'nameEN': 'Whooper Swan'
  },
  {
    'key': 'MX.26287',
    'nameSCI': 'Anser fabalis',
    'nameFI': 'metsähanhi',
    'nameSV': 'sädgås',
    'nameEN': 'Bean Goose'
  },
  {
    'key': 'MX.26290',
    'nameSCI': 'Anser erythropus',
    'nameFI': 'kiljuhanhi',
    'nameSV': 'fjällgås',
    'nameEN': 'Lesser White-fronted Goose'
  },
  {
    'key': 'MX.26291',
    'nameSCI': 'Anser anser',
    'nameFI': 'merihanhi',
    'nameSV': 'grågås',
    'nameEN': 'Greylag Goose'
  },
  {
    'key': 'MX.26298',
    'nameSCI': 'Branta canadensis',
    'nameFI': 'kanadanhanhi',
    'nameSV': 'kanadagås',
    'nameEN': 'Canada Goose'
  },
  {
    'key': 'MX.26299',
    'nameSCI': 'Branta leucopsis',
    'nameFI': 'valkoposkihanhi',
    'nameSV': 'vitkindad gås',
    'nameEN': 'Barnacle Goose'
  },
  {
    'key': 'MX.26323',
    'nameSCI': 'Tadorna tadorna',
    'nameFI': 'ristisorsa',
    'nameSV': 'gravand',
    'nameEN': 'Common Shelduck'
  },
  {
    'key': 'MX.26360',
    'nameSCI': 'Anas penelope',
    'nameFI': 'haapana',
    'nameSV': 'bläsand',
    'nameEN': 'Eurasian Wigeon'
  },
  {
    'key': 'MX.26364',
    'nameSCI': 'Anas strepera',
    'nameFI': 'harmaasorsa',
    'nameSV': 'snatterand',
    'nameEN': 'Gadwall'
  },
  {
    'key': 'MX.26366',
    'nameSCI': 'Anas crecca',
    'nameFI': 'tavi',
    'nameSV': 'kricka',
    'nameEN': 'Eurasian Teal'
  },
  {
    'key': 'MX.26373',
    'nameSCI': 'Anas platyrhynchos',
    'nameFI': 'sinisorsa',
    'nameSV': 'gräsand',
    'nameEN': 'Mallard'
  },
  {
    'key': 'MX.26382',
    'nameSCI': 'Anas acuta',
    'nameFI': 'jouhisorsa',
    'nameSV': 'stjärtand',
    'nameEN': 'Northern Pintail'
  },
  {
    'key': 'MX.26388',
    'nameSCI': 'Anas querquedula',
    'nameFI': 'heinätavi',
    'nameSV': 'årta',
    'nameEN': 'Garganey'
  },
  {
    'key': 'MX.26394',
    'nameSCI': 'Anas clypeata',
    'nameFI': 'lapasorsa',
    'nameSV': 'skedand',
    'nameEN': 'Northern Shoveler'
  },
  {
    'key': 'MX.26407',
    'nameSCI': 'Aythya ferina',
    'nameFI': 'punasotka',
    'nameSV': 'brunand',
    'nameEN': 'Common Pochard'
  },
  {
    'key': 'MX.26415',
    'nameSCI': 'Aythya fuligula',
    'nameFI': 'tukkasotka',
    'nameSV': 'vigg',
    'nameEN': 'Tufted Duck'
  },
  {
    'key': 'MX.26416',
    'nameSCI': 'Aythya marila',
    'nameFI': 'lapasotka',
    'nameSV': 'bergand',
    'nameEN': 'Greater Scaup'
  },
  {
    'key': 'MX.26419',
    'nameSCI': 'Somateria mollissima',
    'nameFI': 'haahka',
    'nameSV': 'ejder',
    'nameEN': 'Common Eider'
  },
  {
    'key': 'MX.26427',
    'nameSCI': 'Clangula hyemalis',
    'nameFI': 'alli',
    'nameSV': 'alfågel',
    'nameEN': 'Long-tailed Duck'
  },
  {
    'key': 'MX.26429',
    'nameSCI': 'Melanitta nigra',
    'nameFI': 'mustalintu',
    'nameSV': 'sjöorre',
    'nameEN': 'Common Scoter'
  },
  {
    'key': 'MX.26431',
    'nameSCI': 'Melanitta fusca',
    'nameFI': 'pilkkasiipi',
    'nameSV': 'svärta',
    'nameEN': 'Velvet Scoter'
  },
  {
    'key': 'MX.26435',
    'nameSCI': 'Bucephala clangula',
    'nameFI': 'telkkä',
    'nameSV': 'knipa',
    'nameEN': 'Common Goldeneye'
  },
  {
    'key': 'MX.26438',
    'nameSCI': 'Mergellus albellus',
    'nameFI': 'uivelo',
    'nameSV': 'salskrake',
    'nameEN': 'Smew'
  },
  {
    'key': 'MX.26440',
    'nameSCI': 'Mergus serrator',
    'nameFI': 'tukkakoskelo',
    'nameSV': 'småskrake',
    'nameEN': 'Red-breasted Merganser'
  },
  {
    'key': 'MX.26442',
    'nameSCI': 'Mergus merganser',
    'nameFI': 'isokoskelo',
    'nameSV': 'storskrake',
    'nameEN': 'Common Merganser'
  },
  {
    'key': 'MX.27058',
    'nameSCI': 'Coturnix coturnix',
    'nameFI': 'viiriäinen',
    'nameSV': 'vaktel',
    'nameEN': 'Common Quail'
  },
  {
    'key': 'MX.26931',
    'nameSCI': 'Tetrastes bonasia',
    'nameFI': 'pyy',
    'nameSV': 'järpe',
    'nameEN': 'Hazel Grouse'
  },
  {
    'key': 'MX.26921',
    'nameSCI': 'Lagopus lagopus',
    'nameFI': 'riekko',
    'nameSV': 'dalripa',
    'nameEN': 'Willow Ptarmigan'
  },
  {
    'key': 'MX.26922',
    'nameSCI': 'Lagopus muta',
    'nameFI': 'kiiruna',
    'nameSV': 'fjällripa',
    'nameEN': 'Rock Ptarmigan'
  },
  {
    'key': 'MX.26926',
    'nameSCI': 'Tetrao tetrix',
    'nameFI': 'teeri',
    'nameSV': 'orre',
    'nameEN': 'Black Grouse'
  },
  {
    'key': 'MX.26928',
    'nameSCI': 'Tetrao urogallus',
    'nameFI': 'metso',
    'nameSV': 'tjäder',
    'nameEN': 'Western Capercaillie'
  },
  {
    'key': 'MX.27048',
    'nameSCI': 'Perdix perdix',
    'nameFI': 'peltopyy',
    'nameSV': 'rapphöna',
    'nameEN': 'Grey Partridge'
  },
  {
    'key': 'MX.27152',
    'nameSCI': 'Phasianus colchicus',
    'nameFI': 'fasaani',
    'nameSV': 'fasan',
    'nameEN': 'Common Pheasant'
  },
  {
    'key': 'MX.25836',
    'nameSCI': 'Gavia stellata',
    'nameFI': 'kaakkuri',
    'nameSV': 'smålom',
    'nameEN': 'Red-throated Loon'
  },
  {
    'key': 'MX.25837',
    'nameSCI': 'Gavia arctica',
    'nameFI': 'kuikka',
    'nameSV': 'storlom',
    'nameEN': 'Black-throated Loon'
  },
  {
    'key': 'MX.25844',
    'nameSCI': 'Tachybaptus ruficollis',
    'nameFI': 'pikku-uikku',
    'nameSV': 'smådopping',
    'nameEN': 'Little Grebe'
  },
  {
    'key': 'MX.25860',
    'nameSCI': 'Podiceps cristatus',
    'nameFI': 'silkkiuikku',
    'nameSV': 'skäggdopping',
    'nameEN': 'Great Crested Grebe'
  },
  {
    'key': 'MX.25859',
    'nameSCI': 'Podiceps grisegena',
    'nameFI': 'härkälintu',
    'nameSV': 'gråhakedopping',
    'nameEN': 'Red-necked Grebe'
  },
  {
    'key': 'MX.25861',
    'nameSCI': 'Podiceps auritus',
    'nameFI': 'mustakurkku-uikku',
    'nameSV': 'svarthakedopping',
    'nameEN': 'Horned Grebe'
  },
  {
    'key': 'MX.26043',
    'nameSCI': 'Phalacrocorax carbo',
    'nameFI': 'merimetso',
    'nameSV': 'storskarv',
    'nameEN': 'Great Cormorant'
  },
  {
    'key': 'MX.26164',
    'nameSCI': 'Botaurus stellaris',
    'nameFI': 'kaulushaikara',
    'nameSV': 'rördrom',
    'nameEN': 'Eurasian Bittern'
  },
  {
    'key': 'MX.26105',
    'nameSCI': 'Egretta alba',
    'nameFI': 'jalohaikara',
    'nameSV': 'ägretthäger',
    'nameEN': 'Great Egret'
  },
  {
    'key': 'MX.26094',
    'nameSCI': 'Ardea cinerea',
    'nameFI': 'harmaahaikara',
    'nameSV': 'gråhäger',
    'nameEN': 'Grey Heron'
  },
  {
    'key': 'MX.26488',
    'nameSCI': 'Pernis apivorus',
    'nameFI': 'mehiläishaukka',
    'nameSV': 'bivråk',
    'nameEN': 'European Honey Buzzard'
  },
  {
    'key': 'MX.26518',
    'nameSCI': 'Milvus migrans',
    'nameFI': 'haarahaukka',
    'nameSV': 'brun glada',
    'nameEN': 'Black Kite'
  },
  {
    'key': 'MX.26530',
    'nameSCI': 'Haliaeetus albicilla',
    'nameFI': 'merikotka',
    'nameSV': 'havsörn',
    'nameEN': 'White-tailed Sea Eagle'
  },
  {
    'key': 'MX.26597',
    'nameSCI': 'Circus aeruginosus',
    'nameFI': 'ruskosuohaukka',
    'nameSV': 'brun kärrhök',
    'nameEN': 'Western Marsh Harrier'
  },
  {
    'key': 'MX.26592',
    'nameSCI': 'Circus cyaneus',
    'nameFI': 'sinisuohaukka',
    'nameSV': 'blå kärrhök',
    'nameEN': 'Hen Harrier'
  },
  {
    'key': 'MX.26594',
    'nameSCI': 'Circus macrourus',
    'nameFI': 'arosuohaukka',
    'nameSV': 'stäpphök',
    'nameEN': 'Pallid Harrier'
  },
  {
    'key': 'MX.26596',
    'nameSCI': 'Circus pygargus',
    'nameFI': 'niittysuohaukka',
    'nameSV': 'ängshök',
    'nameEN': 'Montagus Harrier'
  },
  {
    'key': 'MX.26647',
    'nameSCI': 'Accipiter gentilis',
    'nameFI': 'kanahaukka',
    'nameSV': 'duvhök',
    'nameEN': 'Northern Goshawk'
  },
  {
    'key': 'MX.26639',
    'nameSCI': 'Accipiter nisus',
    'nameFI': 'varpushaukka',
    'nameSV': 'sparvhök',
    'nameEN': 'Eurasian Sparrowhawk'
  },
  {
    'key': 'MX.26701',
    'nameSCI': 'Buteo buteo',
    'nameFI': 'hiirihaukka',
    'nameSV': 'ormvråk',
    'nameEN': 'Common Buzzard'
  },
  {
    'key': 'MX.26704',
    'nameSCI': 'Buteo lagopus',
    'nameFI': 'piekana',
    'nameSV': 'fjällvråk',
    'nameEN': 'Rough-legged Buzzard'
  },
  {
    'key': 'MX.26723',
    'nameSCI': 'Aquila clanga',
    'nameFI': 'kiljukotka',
    'nameSV': 'större skrikörn',
    'nameEN': 'Greater Spotted Eagle'
  },
  {
    'key': 'MX.26727',
    'nameSCI': 'Aquila chrysaetos',
    'nameFI': 'maakotka',
    'nameSV': 'kungsörn',
    'nameEN': 'Golden Eagle'
  },
  {
    'key': 'MX.26472',
    'nameSCI': 'Pandion haliaetus',
    'nameFI': 'sääksi',
    'nameSV': 'fiskgjuse',
    'nameEN': 'Osprey'
  },
  {
    'key': 'MX.26796',
    'nameSCI': 'Falco tinnunculus',
    'nameFI': 'tuulihaukka',
    'nameSV': 'tornfalk',
    'nameEN': 'Common Kestrel'
  },
  {
    'key': 'MX.26808',
    'nameSCI': 'Falco columbarius',
    'nameFI': 'ampuhaukka',
    'nameSV': 'stenfalk',
    'nameEN': 'Merlin'
  },
  {
    'key': 'MX.26811',
    'nameSCI': 'Falco subbuteo',
    'nameFI': 'nuolihaukka',
    'nameSV': 'lärkfalk',
    'nameEN': 'Eurasian Hobby'
  },
  {
    'key': 'MX.26825',
    'nameSCI': 'Falco rusticolus',
    'nameFI': 'tunturihaukka',
    'nameSV': 'jaktfalk',
    'nameEN': 'Gyrfalcon'
  },
  {
    'key': 'MX.26828',
    'nameSCI': 'Falco peregrinus',
    'nameFI': 'muuttohaukka',
    'nameSV': 'pilgrimsfalk',
    'nameEN': 'Peregrine Falcon'
  },
  {
    'key': 'MX.27276',
    'nameSCI': 'Rallus aquaticus',
    'nameFI': 'luhtakana',
    'nameSV': 'vattenrall',
    'nameEN': 'Water Rail'
  },
  {
    'key': 'MX.27345',
    'nameSCI': 'Porzana porzana',
    'nameFI': 'luhtahuitti',
    'nameSV': 'småfläckig sumphöna',
    'nameEN': 'Spotted Crake'
  },
  {
    'key': 'MX.27342',
    'nameSCI': 'Porzana parva',
    'nameFI': 'pikkuhuitti',
    'nameSV': 'mindre sumphöna',
    'nameEN': 'Little Crake'
  },
  {
    'key': 'MX.27328',
    'nameSCI': 'Crex crex',
    'nameFI': 'ruisrääkkä',
    'nameSV': 'kornknarr',
    'nameEN': 'Corn Crake'
  },
  {
    'key': 'MX.27364',
    'nameSCI': 'Gallinula chloropus',
    'nameFI': 'liejukana',
    'nameSV': 'rörhöna',
    'nameEN': 'Common Moorhen'
  },
  {
    'key': 'MX.27381',
    'nameSCI': 'Fulica atra',
    'nameFI': 'nokikana',
    'nameSV': 'sothöna',
    'nameEN': 'Eurasian Coot'
  },
  {
    'key': 'MX.27214',
    'nameSCI': 'Grus grus',
    'nameFI': 'kurki',
    'nameSV': 'trana',
    'nameEN': 'Common Crane'
  },
  {
    'key': 'MX.27459',
    'nameSCI': 'Haematopus ostralegus',
    'nameFI': 'meriharakka',
    'nameSV': 'strandskata',
    'nameEN': 'Eurasian Oystercatcher'
  },
  {
    'key': 'MX.27553',
    'nameSCI': 'Pluvialis apricaria',
    'nameFI': 'kapustarinta',
    'nameSV': 'ljungpipare',
    'nameEN': 'European Golden Plover'
  },
  {
    'key': 'MX.27527',
    'nameSCI': 'Vanellus vanellus',
    'nameFI': 'töyhtöhyyppä',
    'nameSV': 'tofsvipa',
    'nameEN': 'Northern Lapwing'
  },
  {
    'key': 'MX.27562',
    'nameSCI': 'Charadrius dubius',
    'nameFI': 'pikkutylli',
    'nameSV': 'mindre strandpipare',
    'nameEN': 'Little Ringed Plover'
  },
  {
    'key': 'MX.27559',
    'nameSCI': 'Charadrius hiaticula',
    'nameFI': 'tylli',
    'nameSV': 'större strandpipare',
    'nameEN': 'Common Ringed Plover'
  },
  {
    'key': 'MX.27597',
    'nameSCI': 'Charadrius morinellus',
    'nameFI': 'keräkurmitsa',
    'nameSV': 'fjällpipare',
    'nameEN': 'Eurasian Dotterel'
  },
  {
    'key': 'MX.27610',
    'nameSCI': 'Numenius phaeopus',
    'nameFI': 'pikkukuovi',
    'nameSV': 'småspov',
    'nameEN': 'Whimbrel'
  },
  {
    'key': 'MX.27613',
    'nameSCI': 'Numenius arquata',
    'nameFI': 'kuovi',
    'nameSV': 'storspov',
    'nameEN': 'Eurasian Curlew'
  },
  {
    'key': 'MX.27603',
    'nameSCI': 'Limosa limosa',
    'nameFI': 'mustapyrstökuiri',
    'nameSV': 'rödspov',
    'nameEN': 'Black-tailed Godwit'
  },
  {
    'key': 'MX.27605',
    'nameSCI': 'Limosa lapponica',
    'nameFI': 'punakuiri',
    'nameSV': 'myrspov',
    'nameEN': 'Bar-tailed Godwit'
  },
  {
    'key': 'MX.27642',
    'nameSCI': 'Arenaria interpres',
    'nameFI': 'karikukko',
    'nameSV': 'roskarl',
    'nameEN': 'Ruddy Turnstone'
  },
  {
    'key': 'MX.27710',
    'nameSCI': 'Calidris pugnax',
    'nameFI': 'suokukko',
    'nameSV': 'brushane',
    'nameEN': 'Ruff'
  },
  {
    'key': 'MX.27704',
    'nameSCI': 'Calidris falcinellus',
    'nameFI': 'jänkäsirriäinen',
    'nameSV': 'myrsnäppa',
    'nameEN': 'Broad-billed Sandpiper'
  },
  {
    'key': 'MX.27689',
    'nameSCI': 'Calidris temminckii',
    'nameFI': 'lapinsirri',
    'nameSV': 'mosnäppa',
    'nameEN': 'Temmincks Stint'
  },
  {
    'key': 'MX.27699',
    'nameSCI': 'Calidris alpina',
    'nameFI': 'suosirri',
    'nameSV': 'kärrsnäppa',
    'nameEN': 'Dunlin'
  },
  {
    'key': 'MX.27697',
    'nameSCI': 'Calidris maritima',
    'nameFI': 'merisirri',
    'nameSV': 'skärsnäppa',
    'nameEN': 'Purple Sandpiper'
  },
  {
    'key': 'MX.27688',
    'nameSCI': 'Calidris minuta',
    'nameFI': 'pikkusirri',
    'nameSV': 'småsnäppa',
    'nameEN': 'Little Stint'
  },
  {
    'key': 'MX.27646',
    'nameSCI': 'Phalaropus lobatus',
    'nameFI': 'vesipääsky',
    'nameSV': 'smalnäbbad simsnäppa',
    'nameEN': 'Red-necked Phalarope'
  },
  {
    'key': 'MX.27632',
    'nameSCI': 'Xenus cinereus',
    'nameFI': 'rantakurvi',
    'nameSV': 'tereksnäppa',
    'nameEN': 'Terek Sandpiper'
  },
  {
    'key': 'MX.27634',
    'nameSCI': 'Actitis hypoleucos',
    'nameFI': 'rantasipi',
    'nameSV': 'drillsnäppa',
    'nameEN': 'Common Sandpiper'
  },
  {
    'key': 'MX.27626',
    'nameSCI': 'Tringa ochropus',
    'nameFI': 'metsäviklo',
    'nameSV': 'skogssnäppa',
    'nameEN': 'Green Sandpiper'
  },
  {
    'key': 'MX.27619',
    'nameSCI': 'Tringa erythropus',
    'nameFI': 'mustaviklo',
    'nameSV': 'svartsnäppa',
    'nameEN': 'Spotted Redshank'
  },
  {
    'key': 'MX.27622',
    'nameSCI': 'Tringa nebularia',
    'nameFI': 'valkoviklo',
    'nameSV': 'gluttsnäppa',
    'nameEN': 'Common Greenshank'
  },
  {
    'key': 'MX.27621',
    'nameSCI': 'Tringa stagnatilis',
    'nameFI': 'lampiviklo',
    'nameSV': 'dammsnäppa',
    'nameEN': 'Marsh Sandpiper'
  },
  {
    'key': 'MX.27628',
    'nameSCI': 'Tringa glareola',
    'nameFI': 'liro',
    'nameSV': 'grönbena',
    'nameEN': 'Wood Sandpiper'
  },
  {
    'key': 'MX.27620',
    'nameSCI': 'Tringa totanus',
    'nameFI': 'punajalkaviklo',
    'nameSV': 'rödbena',
    'nameEN': 'Common Redshank'
  },
  {
    'key': 'MX.27674',
    'nameSCI': 'Lymnocryptes minimus',
    'nameFI': 'jänkäkurppa',
    'nameSV': 'Dvärgbeckasin',
    'nameEN': 'Jack Snipe'
  },
  {
    'key': 'MX.27649',
    'nameSCI': 'Scolopax rusticola',
    'nameFI': 'lehtokurppa',
    'nameSV': 'morkulla',
    'nameEN': 'Eurasian Woodcock'
  },
  {
    'key': 'MX.27666',
    'nameSCI': 'Gallinago gallinago',
    'nameFI': 'taivaanvuohi',
    'nameSV': 'enkelbeckasin',
    'nameEN': 'Common Snipe'
  },
  {
    'key': 'MX.27665',
    'nameSCI': 'Gallinago media',
    'nameFI': 'heinäkurppa',
    'nameSV': 'dubbelbeckasin',
    'nameEN': 'Great Snipe'
  },
  {
    'key': 'MX.27730',
    'nameSCI': 'Stercorarius parasiticus',
    'nameFI': 'merikihu',
    'nameSV': 'kustlabb',
    'nameEN': 'Parasitic Jaeger'
  },
  {
    'key': 'MX.27731',
    'nameSCI': 'Stercorarius longicaudus',
    'nameFI': 'tunturikihu',
    'nameSV': 'fjällabb',
    'nameEN': 'Long-tailed Jaeger'
  },
  {
    'key': 'MX.27855',
    'nameSCI': 'Cepphus grylle',
    'nameFI': 'riskilä',
    'nameSV': 'tobisgrissla',
    'nameEN': 'Black Guillemot'
  },
  {
    'key': 'MX.27850',
    'nameSCI': 'Alca torda',
    'nameFI': 'ruokki',
    'nameSV': 'tordmule',
    'nameEN': 'Razorbill'
  },
  {
    'key': 'MX.27853',
    'nameSCI': 'Uria aalge',
    'nameFI': 'etelänkiisla',
    'nameSV': 'sillgrissla',
    'nameEN': 'Common Murre'
  },
  {
    'key': 'MX.27821',
    'nameSCI': 'Sternula albifrons',
    'nameFI': 'pikkutiira',
    'nameSV': 'småtärna',
    'nameEN': 'Little Tern'
  },
  {
    'key': 'MX.27797',
    'nameSCI': 'Hydroprogne caspia',
    'nameFI': 'räyskä',
    'nameSV': 'skräntärna',
    'nameEN': 'Caspian Tern'
  },
  {
    'key': 'MX.27791',
    'nameSCI': 'Chlidonias niger',
    'nameFI': 'mustatiira',
    'nameSV': 'svarttärna',
    'nameEN': 'Black Tern'
  },
  {
    'key': 'MX.27801',
    'nameSCI': 'Sterna hirundo',
    'nameFI': 'kalatiira',
    'nameSV': 'fisktärna',
    'nameEN': 'Common Tern'
  },
  {
    'key': 'MX.27802',
    'nameSCI': 'Sterna paradisaea',
    'nameFI': 'lapintiira',
    'nameSV': 'silvertärna',
    'nameEN': 'Arctic Tern'
  },
  {
    'key': 'MX.27777',
    'nameSCI': 'Hydrocoloeus minutus',
    'nameFI': 'pikkulokki',
    'nameSV': 'dvärgmås',
    'nameEN': 'Little Gull'
  },
  {
    'key': 'MX.27748',
    'nameSCI': 'Larus canus',
    'nameFI': 'kalalokki',
    'nameSV': 'fiskmås',
    'nameEN': 'Mew Gull'
  },
  {
    'key': 'MX.27753',
    'nameSCI': 'Larus fuscus',
    'nameFI': 'selkälokki',
    'nameSV': 'silltrut',
    'nameEN': 'Lesser Black-backed Gull'
  },
  {
    'key': 'MX.27750',
    'nameSCI': 'Larus argentatus',
    'nameFI': 'harmaalokki',
    'nameSV': 'gråtrut',
    'nameEN': 'European Herring Gull'
  },
  {
    'key': 'MX.27759',
    'nameSCI': 'Larus marinus',
    'nameFI': 'merilokki',
    'nameSV': 'havstrut',
    'nameEN': 'Great Black-backed Gull'
  },
  {
    'key': 'MX.27774',
    'nameSCI': 'Larus ridibundus',
    'nameFI': 'naurulokki',
    'nameSV': 'skrattmås',
    'nameEN': 'Black-headed Gull'
  },
  {
    'key': 'MX.27903',
    'nameSCI': 'Columba livia',
    'nameFI': 'kalliokyyhky',
    'nameSV': 'klippduva',
    'nameEN': 'Rock Dove'
  },
  {
    'key': 'MX.27908',
    'nameSCI': 'Columba oenas',
    'nameFI': 'uuttukyyhky',
    'nameSV': 'skogsduva',
    'nameEN': 'Stock Dove'
  },
  {
    'key': 'MX.27911',
    'nameSCI': 'Columba palumbus',
    'nameFI': 'sepelkyyhky',
    'nameSV': 'ringduva',
    'nameEN': 'Common Wood Pigeon'
  },
  {
    'key': 'MX.27960',
    'nameSCI': 'Streptopelia decaocto',
    'nameFI': 'turkinkyyhky',
    'nameSV': 'turkduva',
    'nameEN': 'Eurasian Collared Dove'
  },
  {
    'key': 'MX.27955',
    'nameSCI': 'Streptopelia turtur',
    'nameFI': 'turturikyyhky',
    'nameSV': 'turturduva',
    'nameEN': 'European Turtle Dove'
  },
  {
    'key': 'MX.28715',
    'nameSCI': 'Cuculus canorus',
    'nameFI': 'käki',
    'nameSV': 'gök',
    'nameEN': 'Common Cuckoo'
  },
  {
    'key': 'MX.28965',
    'nameSCI': 'Bubo bubo',
    'nameFI': 'huuhkaja',
    'nameSV': 'berguv',
    'nameEN': 'Eurasian Eagle-owl'
  },
  {
    'key': 'MX.28987',
    'nameSCI': 'Bubo scandiacus',
    'nameFI': 'tunturipöllö',
    'nameSV': 'fjälluggla',
    'nameEN': 'Snowy Owl'
  },
  {
    'key': 'MX.29008',
    'nameSCI': 'Surnia ulula',
    'nameFI': 'hiiripöllö',
    'nameSV': 'hökuggla',
    'nameEN': 'Northern Hawk-Owl'
  },
  {
    'key': 'MX.29011',
    'nameSCI': 'Glaucidium passerinum',
    'nameFI': 'varpuspöllö',
    'nameSV': 'sparvuggla',
    'nameEN': 'Eurasian Pygmy Owl'
  },
  {
    'key': 'MX.28998',
    'nameSCI': 'Strix aluco',
    'nameFI': 'lehtopöllö',
    'nameSV': 'kattuggla',
    'nameEN': 'Tawny Owl'
  },
  {
    'key': 'MX.29003',
    'nameSCI': 'Strix uralensis',
    'nameFI': 'viirupöllö',
    'nameSV': 'slaguggla',
    'nameEN': 'Ural Owl'
  },
  {
    'key': 'MX.29004',
    'nameSCI': 'Strix nebulosa',
    'nameFI': 'lapinpöllö',
    'nameSV': 'lappuggla',
    'nameEN': 'Great Grey Owl'
  },
  {
    'key': 'MX.29068',
    'nameSCI': 'Asio otus',
    'nameFI': 'sarvipöllö',
    'nameSV': 'hornuggla',
    'nameEN': 'Long-eared Owl'
  },
  {
    'key': 'MX.29072',
    'nameSCI': 'Asio flammeus',
    'nameFI': 'suopöllö',
    'nameSV': 'jorduggla',
    'nameEN': 'Short-eared Owl'
  },
  {
    'key': 'MX.29038',
    'nameSCI': 'Aegolius funereus',
    'nameFI': 'helmipöllö',
    'nameSV': 'pärluggla',
    'nameEN': 'Boreal Owl'
  },
  {
    'key': 'MX.29172',
    'nameSCI': 'Caprimulgus europaeus',
    'nameFI': 'kehrääjä',
    'nameSV': 'nattskärra',
    'nameEN': 'European Nightjar'
  },
  {
    'key': 'MX.29324',
    'nameSCI': 'Apus apus',
    'nameFI': 'tervapääsky',
    'nameSV': 'tornseglare',
    'nameEN': 'Common Swift'
  },
  {
    'key': 'MX.29860',
    'nameSCI': 'Alcedo atthis',
    'nameFI': 'kuningaskalastaja',
    'nameSV': 'kungsfiskare',
    'nameEN': 'Common Kingfisher'
  },
  {
    'key': 'MX.30333',
    'nameSCI': 'Jynx torquilla',
    'nameFI': 'käenpiika',
    'nameSV': 'göktyta',
    'nameEN': 'Eurasian Wryneck'
  },
  {
    'key': 'MX.30530',
    'nameSCI': 'Picus canus',
    'nameFI': 'harmaapäätikka',
    'nameSV': 'gråspett',
    'nameEN': 'Grey-headed Woodpecker'
  },
  {
    'key': 'MX.30504',
    'nameSCI': 'Dryocopus martius',
    'nameFI': 'palokärki',
    'nameSV': 'spillkråka',
    'nameEN': 'Black Woodpecker'
  },
  {
    'key': 'MX.30443',
    'nameSCI': 'Dendrocopos major',
    'nameFI': 'käpytikka',
    'nameSV': 'större hackspett',
    'nameEN': 'Great Spotted Woodpecker'
  },
  {
    'key': 'MX.30438',
    'nameSCI': 'Dendrocopos leucotos',
    'nameFI': 'valkoselkätikka',
    'nameSV': 'vitryggig hackspett',
    'nameEN': 'White-backed Woodpecker'
  },
  {
    'key': 'MX.30428',
    'nameSCI': 'Dendrocopos minor',
    'nameFI': 'pikkutikka',
    'nameSV': 'mindre hackspett',
    'nameEN': 'Lesser Spotted Woodpecker'
  },
  {
    'key': 'MX.30453',
    'nameSCI': 'Picoides tridactylus',
    'nameFI': 'pohjantikka',
    'nameSV': 'tretåig hackspett',
    'nameEN': 'Eurasian Three-toed Woodpecker'
  },
  {
    'key': 'MX.32063',
    'nameSCI': 'Lullula arborea',
    'nameFI': 'kangaskiuru',
    'nameSV': 'trädlärka',
    'nameEN': 'Woodlark'
  },
  {
    'key': 'MX.32065',
    'nameSCI': 'Alauda arvensis',
    'nameFI': 'kiuru',
    'nameSV': 'sånglärka',
    'nameEN': 'Eurasian Skylark'
  },
  {
    'key': 'MX.32076',
    'nameSCI': 'Eremophila alpestris',
    'nameFI': 'tunturikiuru',
    'nameSV': 'berglärka',
    'nameEN': 'Horned Lark'
  },
  {
    'key': 'MX.32120',
    'nameSCI': 'Riparia riparia',
    'nameFI': 'törmäpääsky',
    'nameSV': 'backsvala',
    'nameEN': 'Sand Martin'
  },
  {
    'key': 'MX.32132',
    'nameSCI': 'Hirundo rustica',
    'nameFI': 'haarapääsky',
    'nameSV': 'ladusvala',
    'nameEN': 'Barn Swallow'
  },
  {
    'key': 'MX.32163',
    'nameSCI': 'Delichon urbicum',
    'nameFI': 'räystäspääsky',
    'nameSV': 'hussvala',
    'nameEN': 'Common House Martin'
  },
  {
    'key': 'MX.32207',
    'nameSCI': 'Anthus campestris',
    'nameFI': 'nummikirvinen',
    'nameSV': 'fältpiplärka',
    'nameEN': 'Tawny Pipit'
  },
  {
    'key': 'MX.32214',
    'nameSCI': 'Anthus trivialis',
    'nameFI': 'metsäkirvinen',
    'nameSV': 'trädpiplärka',
    'nameEN': 'Tree Pipit'
  },
  {
    'key': 'MX.32213',
    'nameSCI': 'Anthus pratensis',
    'nameFI': 'niittykirvinen',
    'nameSV': 'ängspiplärka',
    'nameEN': 'Meadow Pipit'
  },
  {
    'key': 'MX.32217',
    'nameSCI': 'Anthus cervinus',
    'nameFI': 'lapinkirvinen',
    'nameSV': 'rödstrupig piplärka',
    'nameEN': 'Red-throated Pipit'
  },
  {
    'key': 'MX.32221',
    'nameSCI': 'Anthus petrosus',
    'nameFI': 'luotokirvinen',
    'nameSV': 'skärpiplärka',
    'nameEN': 'Eurasian Rock Pipit'
  },
  {
    'key': 'MX.32180',
    'nameSCI': 'Motacilla flava',
    'nameFI': 'keltavästäräkki',
    'nameSV': 'gulärla',
    'nameEN': 'Western Yellow Wagtail'
  },
  {
    'key': 'MX.32181',
    'nameSCI': 'Motacilla citreola',
    'nameFI': 'sitruunavästäräkki',
    'nameSV': 'citronärla',
    'nameEN': 'Citrine Wagtail'
  },
  {
    'key': 'MX.32182',
    'nameSCI': 'Motacilla cinerea',
    'nameFI': 'virtavästäräkki',
    'nameSV': 'forsärla',
    'nameEN': 'Grey Wagtail'
  },
  {
    'key': 'MX.32183',
    'nameSCI': 'Motacilla alba',
    'nameFI': 'västäräkki',
    'nameSV': 'sädesärla',
    'nameEN': 'White Wagtail'
  },
  {
    'key': 'MX.32608',
    'nameSCI': 'Bombycilla garrulus',
    'nameFI': 'tilhi',
    'nameSV': 'sidensvans',
    'nameEN': 'Bohemian Waxwing'
  },
  {
    'key': 'MX.32625',
    'nameSCI': 'Cinclus cinclus',
    'nameFI': 'koskikara',
    'nameSV': 'strömstare',
    'nameEN': 'White-throated Dipper'
  },
  {
    'key': 'MX.32696',
    'nameSCI': 'Troglodytes troglodytes',
    'nameFI': 'peukaloinen',
    'nameSV': 'gärdsmyg',
    'nameEN': 'Eurasian Wren'
  },
  {
    'key': 'MX.32772',
    'nameSCI': 'Prunella modularis',
    'nameFI': 'rautiainen',
    'nameSV': 'järnsparv',
    'nameEN': 'Dunnock'
  },
  {
    'key': 'MX.32801',
    'nameSCI': 'Erithacus rubecula',
    'nameFI': 'punarinta',
    'nameSV': 'rödhake',
    'nameEN': 'European Robin'
  },
  {
    'key': 'MX.32819',
    'nameSCI': 'Luscinia luscinia',
    'nameFI': 'satakieli',
    'nameSV': 'näktergal',
    'nameEN': 'Thrush Nightingale'
  },
  {
    'key': 'MX.32821',
    'nameSCI': 'Luscinia svecica',
    'nameFI': 'sinirinta',
    'nameSV': 'blåhake',
    'nameEN': 'Bluethroat'
  },
  {
    'key': 'MX.32816',
    'nameSCI': 'Tarsiger cyanurus',
    'nameFI': 'sinipyrstö',
    'nameSV': 'blåstjärt',
    'nameEN': 'Red-flanked Bluetail'
  },
  {
    'key': 'MX.32894',
    'nameSCI': 'Phoenicurus ochruros',
    'nameFI': 'mustaleppälintu',
    'nameSV': 'svart rödstjärt',
    'nameEN': 'Black Redstart'
  },
  {
    'key': 'MX.32895',
    'nameSCI': 'Phoenicurus phoenicurus',
    'nameFI': 'leppälintu',
    'nameSV': 'rödstjärt',
    'nameEN': 'Common Redstart'
  },
  {
    'key': 'MX.32949',
    'nameSCI': 'Saxicola rubetra',
    'nameFI': 'pensastasku',
    'nameSV': 'buskskvätta',
    'nameEN': 'Whinchat'
  },
  {
    'key': 'MX.200001',
    'nameSCI': 'Saxicola maurus',
    'nameFI': 'sepeltasku',
    'nameSV': 'vitgumpad buskskvätta',
    'nameEN': 'Siberian Stonechat'
  },
  {
    'key': 'MX.32966',
    'nameSCI': 'Oenanthe oenanthe',
    'nameFI': 'kivitasku',
    'nameSV': 'stenskvätta',
    'nameEN': 'Northern Wheatear'
  },
  {
    'key': 'MX.33104',
    'nameSCI': 'Turdus torquatus',
    'nameFI': 'sepelrastas',
    'nameSV': 'ringtrast',
    'nameEN': 'Ring Ouzel'
  },
  {
    'key': 'MX.33106',
    'nameSCI': 'Turdus merula',
    'nameFI': 'mustarastas',
    'nameSV': 'koltrast',
    'nameEN': 'Common Blackbird'
  },
  {
    'key': 'MX.33117',
    'nameSCI': 'Turdus pilaris',
    'nameFI': 'räkättirastas',
    'nameSV': 'björktrast',
    'nameEN': 'Fieldfare'
  },
  {
    'key': 'MX.33119',
    'nameSCI': 'Turdus philomelos',
    'nameFI': 'laulurastas',
    'nameSV': 'taltrast',
    'nameEN': 'Song Thrush'
  },
  {
    'key': 'MX.33118',
    'nameSCI': 'Turdus iliacus',
    'nameFI': 'punakylkirastas',
    'nameSV': 'rödvingetrast',
    'nameEN': 'Redwing'
  },
  {
    'key': 'MX.33121',
    'nameSCI': 'Turdus viscivorus',
    'nameFI': 'kulorastas',
    'nameSV': 'dubbeltrast',
    'nameEN': 'Mistle Thrush'
  },
  {
    'key': 'MX.33630',
    'nameSCI': 'Locustella naevia',
    'nameFI': 'pensassirkkalintu',
    'nameSV': 'gräshoppsångare',
    'nameEN': 'Common Grasshopper Warbler'
  },
  {
    'key': 'MX.33634',
    'nameSCI': 'Locustella fluviatilis',
    'nameFI': 'viitasirkkalintu',
    'nameSV': 'flodsångare',
    'nameEN': 'River Warbler'
  },
  {
    'key': 'MX.33635',
    'nameSCI': 'Locustella luscinioides',
    'nameFI': 'ruokosirkkalintu',
    'nameSV': 'vassångare',
    'nameEN': 'Savis Warbler'
  },
  {
    'key': 'MX.33671',
    'nameSCI': 'Iduna caligata',
    'nameFI': 'pikkukultarinta',
    'nameSV': 'stäppsångare',
    'nameEN': 'Booted Warbler'
  },
  {
    'key': 'MX.33676',
    'nameSCI': 'Hippolais icterina',
    'nameFI': 'kultarinta',
    'nameSV': 'härmsångare',
    'nameEN': 'Icterine Warbler'
  },
  {
    'key': 'MX.33641',
    'nameSCI': 'Acrocephalus schoenobaenus',
    'nameFI': 'ruokokerttunen',
    'nameSV': 'sävsångare',
    'nameEN': 'Sedge Warbler'
  },
  {
    'key': 'MX.33650',
    'nameSCI': 'Acrocephalus dumetorum',
    'nameFI': 'viitakerttunen',
    'nameSV': 'busksångare',
    'nameEN': 'Blyths Reed Warbler'
  },
  {
    'key': 'MX.33649',
    'nameSCI': 'Acrocephalus palustris',
    'nameFI': 'luhtakerttunen',
    'nameSV': 'kärrsångare',
    'nameEN': 'Marsh Warbler'
  },
  {
    'key': 'MX.33646',
    'nameSCI': 'Acrocephalus scirpaceus',
    'nameFI': 'rytikerttunen',
    'nameSV': 'rörsångare',
    'nameEN': 'Common Reed Warbler'
  },
  {
    'key': 'MX.33651',
    'nameSCI': 'Acrocephalus arundinaceus',
    'nameFI': 'rastaskerttunen',
    'nameSV': 'trastsångare',
    'nameEN': 'Great Reed Warbler'
  },
  {
    'key': 'MX.33939',
    'nameSCI': 'Sylvia nisoria',
    'nameFI': 'kirjokerttu',
    'nameSV': 'höksångare',
    'nameEN': 'Barred Warbler'
  },
  {
    'key': 'MX.33937',
    'nameSCI': 'Sylvia curruca',
    'nameFI': 'hernekerttu',
    'nameSV': 'ärtsångare',
    'nameEN': 'Lesser Whitethroat'
  },
  {
    'key': 'MX.33936',
    'nameSCI': 'Sylvia communis',
    'nameFI': 'pensaskerttu',
    'nameSV': 'törnsångare',
    'nameEN': 'Common Whitethroat'
  },
  {
    'key': 'MX.33935',
    'nameSCI': 'Sylvia borin',
    'nameFI': 'lehtokerttu',
    'nameSV': 'trädgårdssångare',
    'nameEN': 'Garden Warbler'
  },
  {
    'key': 'MX.33934',
    'nameSCI': 'Sylvia atricapilla',
    'nameFI': 'mustapääkerttu',
    'nameSV': 'svarthätta',
    'nameEN': 'Eurasian Blackcap'
  },
  {
    'key': 'MX.33891',
    'nameSCI': 'Seicercus trochiloides',
    'nameFI': 'idänuunilintu',
    'nameSV': 'lundsångare',
    'nameEN': 'Greenish Warbler'
  },
  {
    'key': 'MX.33890',
    'nameSCI': 'Seicercus borealis',
    'nameFI': 'lapinuunilintu',
    'nameSV': 'nordsångare',
    'nameEN': 'Arctic Warbler'
  },
  {
    'key': 'MX.33878',
    'nameSCI': 'Phylloscopus sibilatrix',
    'nameFI': 'sirittäjä',
    'nameSV': 'grönsångare',
    'nameEN': 'Wood Warbler'
  },
  {
    'key': 'MX.33874',
    'nameSCI': 'Phylloscopus collybita',
    'nameFI': 'tiltaltti',
    'nameSV': 'gransångare',
    'nameEN': 'Common Chiffchaff'
  },
  {
    'key': 'MX.33873',
    'nameSCI': 'Phylloscopus trochilus',
    'nameFI': 'pajulintu',
    'nameSV': 'lövsångare',
    'nameEN': 'Willow Warbler'
  },
  {
    'key': 'MX.33954',
    'nameSCI': 'Regulus regulus',
    'nameFI': 'hippiäinen',
    'nameSV': 'kungsfågel',
    'nameEN': 'Goldcrest'
  },
  {
    'key': 'MX.33952',
    'nameSCI': 'Regulus ignicapilla',
    'nameFI': 'tulipäähippiäinen',
    'nameSV': 'brandkronad kungsfågel',
    'nameEN': 'Common Firecrest'
  },
  {
    'key': 'MX.33989',
    'nameSCI': 'Muscicapa striata',
    'nameFI': 'harmaasieppo',
    'nameSV': 'grå flugsnappare',
    'nameEN': 'Spotted Flycatcher'
  },
  {
    'key': 'MX.34029',
    'nameSCI': 'Ficedula parva',
    'nameFI': 'pikkusieppo',
    'nameSV': 'mindre flugsnappare',
    'nameEN': 'Red-breasted Flycatcher'
  },
  {
    'key': 'MX.34021',
    'nameSCI': 'Ficedula hypoleuca',
    'nameFI': 'kirjosieppo',
    'nameSV': 'svartvit flugsnappare',
    'nameEN': 'European Pied Flycatcher'
  },
  {
    'key': 'MX.33492',
    'nameSCI': 'Panurus biarmicus',
    'nameFI': 'viiksitimali',
    'nameSV': 'skäggmes',
    'nameEN': 'Bearded Reedling'
  },
  {
    'key': 'MX.34505',
    'nameSCI': 'Aegithalos caudatus',
    'nameFI': 'pyrstötiainen',
    'nameSV': 'stjärtmes',
    'nameEN': 'Long-tailed Tit'
  },
  {
    'key': 'MX.34574',
    'nameSCI': 'Cyanistes caeruleus',
    'nameFI': 'sinitiainen',
    'nameSV': 'blåmes',
    'nameEN': 'Eurasian Blue Tit'
  },
  {
    'key': 'MX.34567',
    'nameSCI': 'Parus major',
    'nameFI': 'talitiainen',
    'nameSV': 'talgoxe',
    'nameEN': 'Great Tit'
  },
  {
    'key': 'MX.34549',
    'nameSCI': 'Periparus ater',
    'nameFI': 'kuusitiainen',
    'nameSV': 'svartmes',
    'nameEN': 'Coal Tit'
  },
  {
    'key': 'MX.34553',
    'nameSCI': 'Lophophanes cristatus',
    'nameFI': 'töyhtötiainen',
    'nameSV': 'tofsmes',
    'nameEN': 'European Crested Tit'
  },
  {
    'key': 'MX.34535',
    'nameSCI': 'Poecile montanus',
    'nameFI': 'hömötiainen',
    'nameSV': 'talltita',
    'nameEN': 'Willow Tit'
  },
  {
    'key': 'MX.34542',
    'nameSCI': 'Poecile cinctus',
    'nameFI': 'lapintiainen',
    'nameSV': 'lappmes',
    'nameEN': 'Siberian Tit'
  },
  {
    'key': 'MX.34586',
    'nameSCI': 'Sitta europaea',
    'nameFI': 'pähkinänakkeli',
    'nameSV': 'nötväcka',
    'nameEN': 'Eurasian Nuthatch'
  },
  {
    'key': 'MX.34616',
    'nameSCI': 'Certhia familiaris',
    'nameFI': 'puukiipijä',
    'nameSV': 'trädkrypare',
    'nameEN': 'Eurasian Treecreeper'
  },
  {
    'key': 'MX.34517',
    'nameSCI': 'Remiz pendulinus',
    'nameFI': 'pussitiainen',
    'nameSV': 'pungmes',
    'nameEN': 'Eurasian Penduline Tit'
  },
  {
    'key': 'MX.36871',
    'nameSCI': 'Oriolus oriolus',
    'nameFI': 'kuhankeittäjä',
    'nameSV': 'sommargylling',
    'nameEN': 'Eurasian Golden Oriole'
  },
  {
    'key': 'MX.32561',
    'nameSCI': 'Lanius collurio',
    'nameFI': 'pikkulepinkäinen',
    'nameSV': 'törnskata',
    'nameEN': 'Red-backed Shrike'
  },
  {
    'key': 'MX.32570',
    'nameSCI': 'Lanius excubitor',
    'nameFI': 'isolepinkäinen',
    'nameSV': 'varfågel',
    'nameEN': 'Great Grey Shrike'
  },
  {
    'key': 'MX.37090',
    'nameSCI': 'Garrulus glandarius',
    'nameFI': 'närhi',
    'nameSV': 'nötskrika',
    'nameEN': 'Eurasian Jay'
  },
  {
    'key': 'MX.37095',
    'nameSCI': 'Perisoreus infaustus',
    'nameFI': 'kuukkeli',
    'nameSV': 'lavskrika',
    'nameEN': 'Siberian Jay'
  },
  {
    'key': 'MX.37122',
    'nameSCI': 'Pica pica',
    'nameFI': 'harakka',
    'nameSV': 'skata',
    'nameEN': 'Eurasian Magpie'
  },
  {
    'key': 'MX.37135',
    'nameSCI': 'Nucifraga caryocatactes',
    'nameFI': 'pähkinähakki',
    'nameSV': 'nötkråka',
    'nameEN': 'Spotted Nutcracker'
  },
  {
    'key': 'MX.37142',
    'nameSCI': 'Corvus monedula',
    'nameFI': 'naakka',
    'nameSV': 'kaja',
    'nameEN': 'Western Jackdaw'
  },
  {
    'key': 'MX.37156',
    'nameSCI': 'Corvus frugilegus',
    'nameFI': 'mustavaris',
    'nameSV': 'råka',
    'nameEN': 'Rook'
  },
  {
    'key': 'MX.73566',
    'nameSCI': 'Corvus corone',
    'nameFI': 'varis',
    'nameSV': 'kråka',
    'nameEN': 'Carrion Crow'
  },
  {
    'key': 'MX.37178',
    'nameSCI': 'Corvus corax',
    'nameFI': 'korppi',
    'nameSV': 'korp',
    'nameEN': 'Northern Raven'
  },
  {
    'key': 'MX.36817',
    'nameSCI': 'Sturnus vulgaris',
    'nameFI': 'kottarainen',
    'nameSV': 'stare',
    'nameEN': 'Common Starling'
  },
  {
    'key': 'MX.36573',
    'nameSCI': 'Passer domesticus',
    'nameFI': 'varpunen',
    'nameSV': 'gråsparv',
    'nameEN': 'House Sparrow'
  },
  {
    'key': 'MX.36589',
    'nameSCI': 'Passer montanus',
    'nameFI': 'pikkuvarpunen',
    'nameSV': 'pilfink',
    'nameEN': 'Eurasian Tree Sparrow'
  },
  {
    'key': 'MX.36237',
    'nameSCI': 'Fringilla coelebs',
    'nameFI': 'peippo',
    'nameSV': 'bofink',
    'nameEN': 'Common Chaffinch'
  },
  {
    'key': 'MX.36239',
    'nameSCI': 'Fringilla montifringilla',
    'nameFI': 'järripeippo',
    'nameSV': 'bergfink',
    'nameEN': 'Brambling'
  },
  {
    'key': 'MX.36242',
    'nameSCI': 'Serinus serinus',
    'nameFI': 'keltahemppo',
    'nameSV': 'gulhämpling',
    'nameEN': 'European Serin'
  },
  {
    'key': 'MX.36283',
    'nameSCI': 'Carduelis chloris',
    'nameFI': 'viherpeippo',
    'nameSV': 'grönfink',
    'nameEN': 'European Greenfinch'
  },
  {
    'key': 'MX.36306',
    'nameSCI': 'Carduelis carduelis',
    'nameFI': 'tikli',
    'nameSV': 'steglits',
    'nameEN': 'European Goldfinch'
  },
  {
    'key': 'MX.36287',
    'nameSCI': 'Carduelis spinus',
    'nameFI': 'vihervarpunen',
    'nameSV': 'grönsiska',
    'nameEN': 'Eurasian Siskin'
  },
  {
    'key': 'MX.36310',
    'nameSCI': 'Carduelis cannabina',
    'nameFI': 'hemppo',
    'nameSV': 'hämpling',
    'nameEN': 'Common Linnet'
  },
  {
    'key': 'MX.36309',
    'nameSCI': 'Carduelis flavirostris',
    'nameFI': 'vuorihemppo',
    'nameSV': 'Vinterhämpling',
    'nameEN': 'Twite'
  },
  {
    'key': 'MX.36308',
    'nameSCI': 'Carduelis flammea',
    'nameFI': 'urpiainen',
    'nameSV': 'gråsiska',
    'nameEN': 'Common Redpoll'
  },
  {
    'key': 'MX.73545',
    'nameSCI': 'Carduelis hornemanni',
    'nameFI': 'tundraurpiainen',
    'nameSV': 'snösiska',
    'nameEN': 'Arctic Redpoll'
  },
  {
    'key': 'MX.36359',
    'nameSCI': 'Loxia leucoptera',
    'nameFI': 'kirjosiipikäpylintu',
    'nameSV': 'bändelkorsnäbb',
    'nameEN': 'Two-barred Crossbill'
  },
  {
    'key': 'MX.36358',
    'nameSCI': 'Loxia curvirostra',
    'nameFI': 'pikkukäpylintu',
    'nameSV': 'mindre korsnäbb',
    'nameEN': 'Red Crossbill'
  },
  {
    'key': 'MX.36356',
    'nameSCI': 'Loxia pytyopsittacus',
    'nameFI': 'isokäpylintu',
    'nameSV': 'större korsnäbb',
    'nameEN': 'Parrot Crossbill'
  },
  {
    'key': 'MX.36331',
    'nameSCI': 'Carpodacus erythrinus',
    'nameFI': 'punavarpunen',
    'nameSV': 'rosenfink',
    'nameEN': 'Common Rosefinch'
  },
  {
    'key': 'MX.36351',
    'nameSCI': 'Pinicola enucleator',
    'nameFI': 'taviokuurna',
    'nameSV': 'tallbit',
    'nameEN': 'Pine Grosbeak'
  },
  {
    'key': 'MX.36366',
    'nameSCI': 'Pyrrhula pyrrhula',
    'nameFI': 'punatulkku',
    'nameSV': 'domherre',
    'nameEN': 'Eurasian Bullfinch'
  },
  {
    'key': 'MX.36368',
    'nameSCI': 'Coccothraustes coccothraustes',
    'nameFI': 'nokkavarpunen',
    'nameSV': 'stenknäck',
    'nameEN': 'Hawfinch'
  },
  {
    'key': 'MX.35185',
    'nameSCI': 'Calcarius lapponicus',
    'nameFI': 'lapinsirkku',
    'nameSV': 'lappsparv',
    'nameEN': 'Lapland Longspur'
  },
  {
    'key': 'MX.35189',
    'nameSCI': 'Plectrophenax nivalis',
    'nameFI': 'pulmunen',
    'nameSV': 'snösparv',
    'nameEN': 'Snow Bunting'
  },
  {
    'key': 'MX.35146',
    'nameSCI': 'Emberiza citrinella',
    'nameFI': 'keltasirkku',
    'nameSV': 'gulsparv',
    'nameEN': 'Yellowhammer'
  },
  {
    'key': 'MX.35154',
    'nameSCI': 'Emberiza hortulana',
    'nameFI': 'peltosirkku',
    'nameSV': 'ortolansparv',
    'nameEN': 'Ortolan Bunting'
  },
  {
    'key': 'MX.35167',
    'nameSCI': 'Emberiza rustica',
    'nameFI': 'pohjansirkku',
    'nameSV': 'videsparv',
    'nameEN': 'Rustic Bunting'
  },
  {
    'key': 'MX.35165',
    'nameSCI': 'Emberiza pusilla',
    'nameFI': 'pikkusirkku',
    'nameSV': 'dvärgsparv',
    'nameEN': 'Little Bunting'
  },
  {
    'key': 'MX.35182',
    'nameSCI': 'Emberiza schoeniclus',
    'nameFI': 'pajusirkku',
    'nameSV': 'sävsparv',
    'nameEN': 'Common Reed Bunting'
  }
]

export const forms = {
  tripForm: 'JX.519',
  birdAtlas: 'MHL.117',
  fungiAtlas: 'JX.652',
  lolife: 'MHL.45'
}

export const useUiSchemaFields = ['MHL.45']