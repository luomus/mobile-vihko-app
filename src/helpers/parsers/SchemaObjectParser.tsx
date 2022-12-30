import React from 'react'
import i18n from '../../languages/i18n'
import SchemaObjectComponent from '../../components/overview/SchemaObjectComponent'
import { parsePathForFieldParams } from './SchemaToInputParser'
import { get, set } from 'lodash'
import { getTaxonAutocomplete } from '../../services/autocompleteService'
import { log } from '../logger'
import { parseDateFromDocumentToUI } from '../dateHelper'
import { CredentialsType } from '../../stores'
import { captureException } from '../sentry'

export const createSchemaObjectComponents = async (inputObject: Record<string, any>, fields: Array<string>, schema: Record<string, any>,
  credentials: CredentialsType) => {

  const returnArray: Array<any> = await Promise.all(
    fields.map(async (field) => await parseObjectToComponents(field, inputObject, schema, credentials)))
  return returnArray
}

const parseObjectToComponents = async (
  field: string,
  inputObject: Record<string, any>,
  schema: Record<string, any>,
  credentials: CredentialsType
) => {
  if (field.includes('images')) {
    return null
  }

  const path = field.split('_')
  const fieldParams = parsePathForFieldParams(schema, path)
  let value = get(inputObject, path, null)

  //parse the dates to readable format for ui
  if (field.includes('date')) {
    value = parseDateFromDocumentToUI(value)
  }

  if (fieldParams.isArray) {
    return (
      <SchemaObjectComponent key={field} title={fieldParams.title} value={value.toString()} />
    )
  } else if (fieldParams.isEnum) {
    const localizedValue = fieldParams['enumDict'][value]
    return (
      <SchemaObjectComponent key={field} title={fieldParams.title} value={localizedValue} />
    )
  } else {
    if (fieldParams.type === 'boolean' || fieldParams.type === 'integer') {
      return (
        <SchemaObjectComponent key={field} title={fieldParams.title} value={i18n.t(value)} />
      )
    } else if (fieldParams.type === 'string') {
      let finalValue = value

      //API call for viewing substrateSpecies' name
      if (value !== null && value.includes('MX')) {
        try {
          let response: Record<string, any> = await getTaxonAutocomplete('taxon', value, null, i18n.language, 5, null)
          if (response.result[0].payload.vernacularName) {
            finalValue = response.result[0].payload.vernacularName
          } else if (response.result[0].payload.scientificName) {
            finalValue = response.result[0].payload.scientificName
          }
        } catch (error) {
          captureException(error)
          log.error({
            location: '/parsers/SchemaObjectParser parseObjectToComponents()',
            error: error,
            user_id: credentials.user?.id
          })
        }
      }

      return (
        <SchemaObjectComponent key={field} title={fieldParams.title} value={finalValue} />
      )
    }
  }
}

export const parseSchemaToNewObject = (
  defaultObject: Record<string, any> | null,
  fieldBlacklist: Array<string> | null,
  schema: Record<string, any>,
) => {
  let outputObject = {}

  const setValue = (path: string, defaultObject: any, schemaDefault: any) => {
    if (defaultObject) {
      set(outputObject, path.split('_'), defaultObject)
    } else if (schemaDefault) {
      set(outputObject, path.split('_'), schemaDefault)
    }
  }

  const schemaToObject = (path: string | null, defaultObject: any, schema: Record<string, any>) => {
    const keysBlacklist = ['type', 'title', 'enum', 'enumNames', 'excludeFromCopy', 'required', 'uniqueItems']
    const keys = Object.keys(schema)
    if (keys.length <= 0 && path && defaultObject) {
      set(outputObject, path.split('_'), defaultObject)
    } else if (keys.includes('properties')) {
      schemaToObject(path, defaultObject, schema['properties'])

    } else if (keys.includes('items')) {
      if (path && schema['items']['properties']) {
        schemaToObject(`${path}_0`, defaultObject?.['0'], schema['items'])

      } else {
        schemaToObject(path, defaultObject, schema['items'])

      }
    } else {
      if (path && keys.some(key => keysBlacklist.includes(key))) {
        setValue(path, defaultObject, schema['default'])

      } else {
        keys.forEach(key => {
          const newPath = path ? path + `_${key}` : key

          if (fieldBlacklist?.includes(newPath)) {
            switch (schema[key]['type']) {
              case 'array':
                set(outputObject, newPath.split('_'), [])
                break
              case 'object':
                set(outputObject, newPath.split('_'), {})
                break
              case 'boolean':
                set(outputObject, newPath.split('_'), false)
                break
              case 'integer':
                set(outputObject, newPath.split('_'), 0)
                break
              case 'string':
                set(outputObject, newPath.split('_'), '')
                break
            }

          } else if (schema[key]['properties'] || schema[key]['items']) {
            schemaToObject(newPath, defaultObject?.[key], schema[key])

          } else if (defaultObject?.[key] || schema[key]['default']) {
            setValue(newPath, defaultObject?.[key], schema?.[key]['default'])
          }
        })
      }
    }
  }

  schemaToObject(null, defaultObject, schema)

  return outputObject
}