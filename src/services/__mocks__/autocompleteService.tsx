import { Canceler } from "axios"

export const getTaxonAutocomplete = async (target: string, q: string, filters: Record<string, any> | null, lang: string, limit: number, setCancelToken: ((c: Canceler) => void) | null) => {
 return [
    {
      "key": "MX.73566",
      "value": "varis",
      "payload": {
        "matchingName": "varis",
        "informalTaxonGroups": [
          {
            "id": "MVL.1",
            "name": "Linnut"
          }
        ],
        "scientificName": "Corvus corone",
        "scientificNameAuthorship": "Linnaeus, 1758",
        "taxonRankId": "MX.species",
        "matchType": "partialMatches",
        "cursiveName": true,
        "finnish": true,
        "species": true,
        "nameType": "MX.vernacularName",
        "vernacularName": "varis"
      }
    },
    {
      "key": "MX.36287",
      "value": "vihervarpunen",
      "payload": {
        "matchingName": "vihervarpunen",
        "informalTaxonGroups": [
          {
            "id": "MVL.1",
            "name": "Linnut"
          }
        ],
        "scientificName": "Carduelis spinus",
        "scientificNameAuthorship": "(Linnaeus, 1758)",
        "taxonRankId": "MX.species",
        "matchType": "partialMatches",
        "cursiveName": true,
        "finnish": true,
        "species": true,
        "nameType": "MX.vernacularName",
        "vernacularName": "vihervarpunen"
      }
    },
    {
      "key": "MX.34021",
      "value": "svartvit flugsnappare",
      "payload": {
        "matchingName": "svartvit flugsnappare",
        "informalTaxonGroups": [
          {
            "id": "MVL.1",
            "name": "Linnut"
          }
        ],
        "scientificName": "Ficedula hypoleuca",
        "scientificNameAuthorship": "(Pallas, 1764)",
        "taxonRankId": "MX.species",
        "matchType": "partialMatches",
        "cursiveName": true,
        "finnish": true,
        "species": true,
        "nameType": "MX.vernacularName",
        "vernacularName": "kirjosieppo"
      }
    },
    {
      "key": "MX.36573",
      "value": "varpunen",
      "payload": {
        "matchingName": "varpunen",
        "informalTaxonGroups": [
          {
            "id": "MVL.1",
            "name": "Linnut"
          }
        ],
        "scientificName": "Passer domesticus",
        "scientificNameAuthorship": "(Linnaeus, 1758)",
        "taxonRankId": "MX.species",
        "matchType": "partialMatches",
        "cursiveName": true,
        "finnish": true,
        "species": true,
        "nameType": "MX.vernacularName",
        "vernacularName": "varpunen"
      }
    },
    {
      "key": "MX.34549",
      "value": "svartmes",
      "payload": {
        "matchingName": "svartmes",
        "informalTaxonGroups": [
          {
            "id": "MVL.1",
            "name": "Linnut"
          }
        ],
        "scientificName": "Periparus ater",
        "scientificNameAuthorship": "(Linnaeus, 1758)",
        "taxonRankId": "MX.species",
        "matchType": "partialMatches",
        "cursiveName": true,
        "finnish": true,
        "species": true,
        "nameType": "MX.vernacularName",
        "vernacularName": "kuusitiainen"
      }
    }
  ]
}