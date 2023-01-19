import { get, set } from 'lodash'

const locateNextInstanceOf: any | null = (objectName: string, inputObject: Record<string, any>): any => {
  let result = null
  let queue = [inputObject]

  while (queue.length > 0) {
    const queueTop = queue.shift()
    for (const key in queueTop) {
      if (key === objectName) {
        result = queueTop[key]
        queue = []
        break
      } else if (queueTop[key] instanceof Object || queueTop[key] instanceof Array) {
        queue.push(queueTop[key])
      }
    }
  }

  return result
}

const blacklistExtractor = (inputObject: Record<string, any>) => {
  const uiSchema: Record<string, any> | null = get(inputObject, 'uiSchema', null)
  const outputBlacklist: Record<string, any> = {}

  if (!uiSchema) {
    return null
  }

  Object.keys(uiSchema).forEach((key: string) => {
    const filterType = get(uiSchema, [key, 'ui:options', 'filterType'], null)

    if (filterType && filterType === 'blacklist') {
      outputBlacklist[key] = get(uiSchema, [key, 'ui:options', 'filter'], null)
    }
  })

  return Object.keys(outputBlacklist).length <= 0 ? null : outputBlacklist
}

const fieldScopeExtractor = (fieldScopes: Record<string, any>, definitions: Record<string, any> | null) => {
  const findFieldsAndBlacklist = (inputObject: Record<string, any>) => {
    const fields: string[] | null = get(inputObject, 'fields', null)

    const blacklist: Record<string, any> | null = blacklistExtractor(inputObject)

    return { fields, blacklist }
  }

  let outputFieldScopes: Record<string, any> = {}

  Object.keys(fieldScopes).forEach((key: string) => {
    const containedFieldScopes: Record<string, any> | null = get(fieldScopes, [key, '+', 'fieldScopes'], null)

    if (containedFieldScopes) {
      const nestedFieldScopes: Record<string, any> | null = fieldScopeExtractor(containedFieldScopes, definitions)

      outputFieldScopes = {
        ...outputFieldScopes,
        ...nestedFieldScopes
      }

    } else {
      Object.keys(fieldScopes[key]).forEach((nestedKey: string) => {
        const nestedFields = fieldScopes[key][nestedKey]
        const { fields, blacklist } = findFieldsAndBlacklist(nestedFields)

        if (fields) {
          set(outputFieldScopes, [key, nestedKey], {
            fields,
            blacklist,
          })
          return
        }

        const refs = get(nestedFields, 'refs', null)

        if (refs && definitions) {
          const tempFields: string[] = []
          let tempBlacklist: Record<string, any> = {}

          refs.forEach((ref: string) => {
            const refObject: Record<string, any> | null = get(definitions, ref, null)

            if (!refObject) {
              return
            }

            const { fields, blacklist } = findFieldsAndBlacklist(refObject)

            if (fields) {
              tempFields.push(...fields)
            }

            if ( blacklist ) {
              tempBlacklist = {
                ...tempBlacklist,
                ...blacklist
              }
            }

            if (tempFields.length > 0) {
              outputFieldScopes[key][nestedKey] = {
                fields: tempFields,
                blacklist: Object.keys(tempBlacklist).length > 0 ? blacklist : null
              }
            }
          })
        }
      })
    }
  })

  return Object.keys(outputFieldScopes).length <= 0 ? null : outputFieldScopes
}

const unitColorExtractor = (inputObject: Record<string, any>) => {
  const color = get(inputObject, ['operations', 'uiSchema', 'ui:options', 'color'], null)
  const rules = get(inputObject, ['rules'], null)

  return { color, rules }
}

export const parseUiSchemaToObservations = (uiSchema: Record<string, any>) => {
  //locate object containing information for observations, eg. units
  const units = uiSchema.gatherings.items.units

  //locate groups-field containig information on observation types and their ui construction,
  //extract button labels, observation types etc.
  let unitGroups: Record<string, any>[] | null = locateNextInstanceOf('groups', units)

  //locate fieldScopes containing fields for different observation types
  let unitFieldScopes: Record<string, any> | null = locateNextInstanceOf('fieldScopes', units)

  //locate definitions for any refs in object fields
  const definitions: Record<string, any> | null = locateNextInstanceOf('definitions', units)

  //locate rules for conditional
  let unitColors: Record<string, any>[] | null = locateNextInstanceOf('cases', units)

  //checks that both have been found, otherwise forms cant be built
  if (!unitGroups || !unitFieldScopes) {
    return
  }

  //extracts for each addable observation type its labe, default values (in button), title of observation,
  //and rules contaning observations field name and regex for splitting observation ttypes woth same fieldname
  unitGroups = unitGroups.map(unitGroup => {
    const button = get(unitGroup, ['operations', 'uiSchema', 'ui:options', 'buttons', '0'])
    const title = get(unitGroup, ['operations', 'uiSchema', 'ui:title'])
    const rules = get(unitGroup, 'rules')

    return {
      button,
      title,
      rules,
    }
  })

  if (unitColors) {
    unitColors = unitColors.map(unitColor => {
      return unitColorExtractor(unitColor)
    })
  }

  //extract from fieldScopes the fields and blacklist per type or subtype
  unitFieldScopes = fieldScopeExtractor(unitFieldScopes, definitions)

  return { unitGroups, unitFieldScopes, unitColors }
}