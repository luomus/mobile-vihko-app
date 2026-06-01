export const getTaxonAutocomplete = async (q: string, filters: Record<string, any> | null, setCancelFn: ((c: () => void) => void) | null) => {
  return {
    query: q,
    results: [
      {
        'matchingName': 'vari',
        'nameType': 'MX.vernacularName',
        'id': 'MX.46490',
        'checklist': 'MR.1',
        'scientificName': 'Varecia variegata',
        'scientificNameAuthorship': '(Kerr, 1792)',
        'taxonRank': 'MX.species',
        'cursiveName': true,
        'finnish': false,
        'species': true,
        'vernacularName': 'vari',
        'informalGroups': [
          {
            'id': 'MVL.2',
            'name': 'Nisäkkäät'
          }
        ],
        'kingdomScientificName': 'Animalia',
        'type': 'exactMatches',
        'key': 'MX.46490',
        'value': 'vari'
      },
      {
        'matchingName': 'varis',
        'nameType': 'MX.vernacularName',
        'id': 'MX.73566',
        'checklist': 'MR.1',
        'scientificName': 'Corvus corone',
        'scientificNameAuthorship': 'Linnaeus, 1758',
        'taxonRank': 'MX.species',
        'cursiveName': true,
        'finnish': true,
        'species': true,
        'vernacularName': 'varis',
        'informalGroups': [
          {
            'id': 'MVL.1',
            'name': 'Linnut'
          }
        ],
        'kingdomScientificName': 'Animalia',
        'type': 'partialMatches',
        'key': 'MX.73566',
        'value': 'varis'
      },
      {
        'matchingName': 'variksenmarja',
        'nameType': 'MX.vernacularName',
        'id': 'MX.38646',
        'checklist': 'MR.1',
        'scientificName': 'Empetrum nigrum',
        'scientificNameAuthorship': 'L.',
        'taxonRank': 'MX.species',
        'cursiveName': true,
        'finnish': true,
        'species': true,
        'vernacularName': 'variksenmarja',
        'informalGroups': [
          {
            'id': 'MVL.343',
            'name': 'Putkilokasvit'
          },
          {
            'id': 'MVL.1062',
            'name': 'Marjakasvit'
          }
        ],
        'kingdomScientificName': 'Plantae',
        'type': 'partialMatches',
        'key': 'MX.38646',
        'value': 'variksenmarja'
      },
      {
        'matchingName': 'variksenmarjanruoste',
        'nameType': 'MX.vernacularName',
        'id': 'MX.4984651',
        'checklist': 'MR.1',
        'scientificName': 'Chrysomyxa empetri',
        'scientificNameAuthorship': '(Pers.) J. Schröt.',
        'taxonRank': 'MX.species',
        'cursiveName': true,
        'finnish': true,
        'species': true,
        'vernacularName': 'variksenmarjanruoste',
        'informalGroups': [
          {
            'id': 'MVL.233',
            'name': 'Sienet ja jäkälät'
          },
          {
            'id': 'MVL.564',
            'name': 'Parasiittiset piensienet'
          },
          {
            'id': 'MVL.583',
            'name': 'Ruostesienet'
          }
        ],
        'kingdomScientificName': 'Fungi',
        'type': 'partialMatches',
        'key': 'MX.4984651',
        'value': 'variksenmarjanruoste'
      },
      {
        'matchingName': 'Varicellaria hemisphaerica',
        'nameType': 'MX.scientificName',
        'id': 'MX.66344',
        'checklist': 'MR.1',
        'scientificName': 'Varicellaria hemisphaerica',
        'scientificNameAuthorship': '(Flörke) I. Schmitt & Lumbsch',
        'taxonRank': 'MX.species',
        'cursiveName': true,
        'finnish': true,
        'species': true,
        'vernacularName': 'jalosirotejäkälä',
        'informalGroups': [
          {
            'id': 'MVL.233',
            'name': 'Sienet ja jäkälät'
          },
          {
            'id': 'MVL.25',
            'name': 'Jäkälät ja likenikoliset sienet'
          },
          {
            'id': 'MVL.381',
            'name': 'Jäkälät'
          }
        ],
        'kingdomScientificName': 'Fungi',
        'type': 'partialMatches',
        'key': 'MX.66344',
        'value': 'Varicellaria hemisphaerica'
      }
    ]
  }
}