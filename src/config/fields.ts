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
  'gatheringEvent_dateEnd',
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
    'key': 'MX.34567',
    'nameFI': 'talitiainen',
    'nameSV': 'talgoxe',
    'nameEN': 'Great Tit'
  },
  {
    'key': 'MX.34574',
    'nameFI': 'sinitiainen',
    'nameSV': 'blåmes',
    'nameEN': 'Eurasian Blue Tit'
  },
  {
    'key': 'MX.33873',
    'nameFI': 'pajulintu',
    'nameSV': 'lövsångare',
    'nameEN': 'Willow Warbler'
  },
  {
    'key': 'MX.34021',
    'nameFI': 'kirjosieppo',
    'nameSV': 'svartvit flugsnappare',
    'nameEN': 'European Pied Flycatcher'
  },
  {
    'key': 'MX.33954',
    'nameFI': 'hippiäinen',
    'nameSV': 'kungsfågel',
    'nameEN': 'Goldcrest'
  },
  {
    'key': 'MX.32801',
    'nameFI': 'punarinta',
    'nameSV': 'rödhake',
    'nameEN': 'European Robin'
  },
  {
    'key': 'MX.36308',
    'nameFI': 'urpiainen',
    'nameSV': 'gråsiska',
    'nameEN': 'Common Redpoll'
  },
  {
    'key': 'MX.27750',
    'nameFI': 'harmaalokki',
    'nameSV': 'gråtrut',
    'nameEN': 'European Herring Gull'
  },
  {
    'key': 'MX.36237',
    'nameFI': 'peippo',
    'nameSV': 'bofink',
    'nameEN': 'Common Chaffinch'
  },
  {
    'key': 'MX.33641',
    'nameFI': 'ruokokerttunen',
    'nameSV': 'sävsångare',
    'nameEN': 'Sedge Warbler'
  },
  {
    'key': 'MX.36283',
    'nameFI': 'viherpeippo',
    'nameSV': 'grönfink',
    'nameEN': 'European Greenfinch'
  },
  {
    'key': 'MX.32132',
    'nameFI': 'haarapääsky',
    'nameSV': 'ladusvala',
    'nameEN': 'Barn Swallow'
  },
  {
    'key': 'MX.34535',
    'nameFI': 'hömötiainen',
    'nameSV': 'talltita',
    'nameEN': 'Willow Tit'
  },
  {
    'key': 'MX.27774',
    'nameFI': 'naurulokki',
    'nameSV': 'skrattmås',
    'nameEN': 'Black-headed Gull'
  },
  {
    'key': 'MX.36366',
    'nameFI': 'punatulkku',
    'nameSV': 'domherre',
    'nameEN': 'Eurasian Bullfinch'
  },
  {
    'key': 'MX.36287',
    'nameFI': 'vihervarpunen',
    'nameSV': 'grönsiska',
    'nameEN': 'Eurasian Siskin'
  },
  {
    'key': 'MX.35146',
    'nameFI': 'keltasirkku',
    'nameSV': 'gulsparv',
    'nameEN': 'Yellowhammer'
  },
  {
    'key': 'MX.33117',
    'nameFI': 'räkättirastas',
    'nameSV': 'björktrast',
    'nameEN': 'Fieldfare'
  },
  {
    'key': 'MX.33118',
    'nameFI': 'punakylkirastas',
    'nameSV': 'rödvingetrast',
    'nameEN': 'Redwing'
  },
  {
    'key': 'MX.34549',
    'nameFI': 'kuusitiainen',
    'nameSV': 'svartmes',
    'nameEN': 'Coal Tit'
  },
  {
    'key': 'MX.32772',
    'nameFI': 'rautiainen',
    'nameSV': 'järnsparv',
    'nameEN': 'Dunnock'
  },
  {
    'key': 'MX.37122',
    'nameFI': 'harakka',
    'nameSV': 'skata',
    'nameEN': 'Eurasian Magpie'
  },
  {
    'key': 'MX.30443',
    'nameFI': 'käpytikka',
    'nameSV': 'större hackspett',
    'nameEN': 'Great Spotted Woodpecker'
  },
  {
    'key': 'MX.33106',
    'nameFI': 'mustarastas',
    'nameSV': 'koltrast',
    'nameEN': 'Common Blackbird'
  },
  {
    'key': 'MX.73566',
    'nameFI': 'varis',
    'nameSV': 'kråka',
    'nameEN': 'Carrion Crow'
  },
  {
    'key': 'MX.35182',
    'nameFI': 'pajusirkku',
    'nameSV': 'sävsparv',
    'nameEN': 'Common Reed Bunting'
  },
  {
    'key': 'MX.36817',
    'nameFI': 'kottarainen',
    'nameSV': 'stare',
    'nameEN': 'Common Starling'
  },
  {
    'key': 'MX.27748',
    'nameFI': 'kalalokki',
    'nameSV': 'fiskmås',
    'nameEN': 'Mew Gull'
  },
  {
    'key': 'MX.36573',
    'nameFI': 'varpunen',
    'nameSV': 'gråsparv',
    'nameEN': 'House Sparrow'
  },
  {
    'key': 'MX.33119',
    'nameFI': 'laulurastas',
    'nameSV': 'taltrast',
    'nameEN': 'Song Thrush'
  },
  {
    'key': 'MX.32895',
    'nameFI': 'leppälintu',
    'nameSV': 'rödstjärt',
    'nameEN': 'Common Redstart'
  },
  {
    'key': 'MX.34616',
    'nameFI': 'puukiipijä',
    'nameSV': 'trädkrypare',
    'nameEN': 'Eurasian Treecreeper'
  },
  {
    'key': 'MX.36239',
    'nameFI': 'järripeippo',
    'nameSV': 'bergfink',
    'nameEN': 'Brambling'
  },
  {
    'key': 'MX.33935',
    'nameFI': 'lehtokerttu',
    'nameSV': 'trädgårdssångare',
    'nameEN': 'Garden Warbler'
  },
  {
    'key': 'MX.32214',
    'nameFI': 'metsäkirvinen',
    'nameSV': 'trädpiplärka',
    'nameEN': 'Tree Pipit'
  },
  {
    'key': 'MX.37142',
    'nameFI': 'naakka',
    'nameSV': 'kaja',
    'nameEN': 'Western Jackdaw'
  },
  {
    'key': 'MX.34505',
    'nameFI': 'pyrstötiainen',
    'nameSV': 'stjärtmes',
    'nameEN': 'Long-tailed Tit'
  },
  {
    'key': 'MX.37090',
    'nameFI': 'närhi',
    'nameSV': 'nötskrika',
    'nameEN': 'Eurasian Jay'
  },
  {
    'key': 'MX.32183',
    'nameFI': 'västäräkki',
    'nameSV': 'sädesärla',
    'nameEN': 'White Wagtail'
  },
  {
    'key': 'MX.27801',
    'nameFI': 'kalatiira',
    'nameSV': 'fisktärna',
    'nameEN': 'Common Tern'
  },
  {
    'key': 'MX.33989',
    'nameFI': 'harmaasieppo',
    'nameSV': 'grå flugsnappare',
    'nameEN': 'Spotted Flycatcher'
  },
  {
    'key': 'MX.34553',
    'nameFI': 'töyhtötiainen',
    'nameSV': 'tofsmes',
    'nameEN': 'European Crested Tit'
  },
  {
    'key': 'MX.36589',
    'nameFI': 'pikkuvarpunen',
    'nameSV': 'pilfink',
    'nameEN': 'Eurasian Tree Sparrow'
  },
  {
    'key': 'MX.26435',
    'nameFI': 'telkkä',
    'nameSV': 'knipa',
    'nameEN': 'Common Goldeneye'
  },
  {
    'key': 'MX.37178',
    'nameFI': 'korppi',
    'nameSV': 'korp',
    'nameEN': 'Northern Raven'
  },
  {
    'key': 'MX.33937',
    'nameFI': 'hernekerttu',
    'nameSV': 'ärtsångare',
    'nameEN': 'Lesser Whitethroat'
  },
  {
    'key': 'MX.33874',
    'nameFI': 'tiltaltti',
    'nameSV': 'gransångare',
    'nameEN': 'Common Chiffchaff'
  },
  {
    'key': 'MX.32120',
    'nameFI': 'törmäpääsky',
    'nameSV': 'backsvala',
    'nameEN': 'Sand Martin'
  },
  {
    'key': 'MX.33936',
    'nameFI': 'pensaskerttu',
    'nameSV': 'törnsångare',
    'nameEN': 'Common Whitethroat'
  },
  {
    'key': 'MX.26373',
    'nameFI': 'sinisorsa',
    'nameSV': 'gräsand',
    'nameEN': 'Mallard'
  },
  {
    'key': 'MX.27911',
    'nameFI': 'sepelkyyhky',
    'nameSV': 'ringduva',
    'nameEN': 'Common Wood Pigeon'
  },
  {
    'key': 'MX.29324',
    'nameFI': 'tervapääsky',
    'nameSV': 'tornseglare',
    'nameEN': 'Common Swift'
  },
  {
    'key': 'MX.27527',
    'nameFI': 'töyhtöhyyppä',
    'nameSV': 'tofsvipa',
    'nameEN': 'Northern Lapwing'
  },
  {
    'key': 'MX.26280',
    'nameFI': 'laulujoutsen',
    'nameSV': 'sångsvan',
    'nameEN': 'Whooper Swan'
  },
  {
    'key': 'MX.33934',
    'nameFI': 'mustapääkerttu',
    'nameSV': 'svarthätta',
    'nameEN': 'Eurasian Blackcap'
  },
  {
    'key': 'MX.28715',
    'nameFI': 'käki',
    'nameSV': 'gök',
    'nameEN': 'Common Cuckoo'
  },
  {
    'key': 'MX.32949',
    'nameFI': 'pensastasku',
    'nameSV': 'buskskvätta',
    'nameEN': 'Whinchat'
  },
  {
    'key': 'MX.32213',
    'nameFI': 'niittykirvinen',
    'nameSV': 'ängspiplärka',
    'nameEN': 'Meadow Pipit'
  },
  {
    'key': 'MX.30504',
    'nameFI': 'palokärki',
    'nameSV': 'spillkråka',
    'nameEN': 'Black Woodpecker'
  },
  {
    'key': 'MX.27613',
    'nameFI': 'kuovi',
    'nameSV': 'storspov',
    'nameEN': 'Eurasian Curlew'
  },
  {
    'key': 'MX.36331',
    'nameFI': 'punavarpunen',
    'nameSV': 'rosenfink',
    'nameEN': 'Common Rosefinch'
  },
  {
    'key': 'MX.26442',
    'nameFI': 'isokoskelo',
    'nameSV': 'storskrake',
    'nameEN': 'Common Merganser'
  },
  {
    'key': 'MX.27214',
    'nameFI': 'kurki',
    'nameSV': 'trana',
    'nameEN': 'Common Crane'
  },
  {
    'key': 'MX.26926',
    'nameFI': 'teeri',
    'nameSV': 'orre',
    'nameEN': 'Black Grouse'
  },
  {
    'key': 'MX.32163',
    'nameFI': 'räystäspääsky',
    'nameSV': 'hussvala',
    'nameEN': 'Common House Martin'
  },
  {
    'key': 'MX.32065',
    'nameFI': 'kiuru',
    'nameSV': 'sånglärka',
    'nameEN': 'Eurasian Skylark'
  },
  {
    'key': 'MX.36358',
    'nameFI': 'pikkukäpylintu',
    'nameSV': 'mindre korsnäbb',
    'nameEN': 'Red Crossbill'
  },
  {
    'key': 'MX.32696',
    'nameFI': 'peukaloinen',
    'nameSV': 'gärdsmyg',
    'nameEN': 'Eurasian Wren'
  },
  {
    'key': 'MX.33878',
    'nameFI': 'sirittäjä',
    'nameSV': 'grönsångare',
    'nameEN': 'Wood Warbler'
  },
  {
    'key': 'MX.26277',
    'nameFI': 'kyhmyjoutsen',
    'nameSV': 'knölsvan',
    'nameEN': 'Mute Swan'
  },
  {
    'key': 'MX.27666',
    'nameFI': 'taivaanvuohi',
    'nameSV': 'enkelbeckasin',
    'nameEN': 'Common Snipe'
  },
  {
    'key': 'MX.27634',
    'nameFI': 'rantasipi',
    'nameSV': 'drillsnäppa',
    'nameEN': 'Common Sandpiper'
  },
  {
    'key': 'MX.26366',
    'nameFI': 'tavi',
    'nameSV': 'kricka',
    'nameEN': 'Eurasian Teal'
  },
  {
    'key': 'MX.36306',
    'nameFI': 'tikli',
    'nameSV': 'steglits',
    'nameEN': 'European Goldfinch'
  },
  {
    'key': 'MX.32819',
    'nameFI': 'satakieli',
    'nameSV': 'näktergal',
    'nameEN': 'Thrush Nightingale'
  },
  {
    'key': 'MX.32966',
    'nameFI': 'kivitasku',
    'nameSV': 'stenskvätta',
    'nameEN': 'Northern Wheatear'
  },
  {
    'key': 'MX.26360',
    'nameFI': 'haapana',
    'nameSV': 'bläsand',
    'nameEN': 'Eurasian Wigeon'
  },
  {
    'key': 'MX.27626',
    'nameFI': 'metsäviklo',
    'nameSV': 'skogssnäppa',
    'nameEN': 'Green Sandpiper'
  },
  {
    'key': 'MX.25860',
    'nameFI': 'silkkiuikku',
    'nameSV': 'skäggdopping',
    'nameEN': 'Great Crested Grebe'
  },
  {
    'key': 'MX.27649',
    'nameFI': 'lehtokurppa',
    'nameSV': 'morkulla',
    'nameEN': 'Eurasian Woodcock'
  },
  {
    'key': 'MX.36310',
    'nameFI': 'hemppo',
    'nameSV': 'hämpling',
    'nameEN': 'Common Linnet'
  },
  {
    'key': 'MX.26298',
    'nameFI': 'kanadanhanhi',
    'nameSV': 'kanadagås',
    'nameEN': 'Canada Goose'
  },
  {
    'key': 'MX.26394',
    'nameFI': 'lapasorsa',
    'nameSV': 'skedand',
    'nameEN': 'Northern Shoveler'
  },
  {
    'key': 'MX.27381',
    'nameFI': 'nokikana',
    'nameSV': 'sothöna',
    'nameEN': 'Eurasian Coot'
  },
  {
    'key': 'MX.200535',
    'nameFI': 'kesykyyhky',
    'nameSV': 'tamduva',
    'nameEN': 'Rock Dove (Feral Pigeon)'
  },
]

export const availableForms = ['JX.519', 'MHL.117', 'JX.652', 'MHL.45']

export const useUiSchemaFields = ['MHL.45']