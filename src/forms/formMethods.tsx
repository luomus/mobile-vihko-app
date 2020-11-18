import {
  observationEventFields,
} from '../config/fields'
import Form from './Form'
import { SchemaType } from '../stores/observation/types'
import { omit } from 'lodash'

//called in component to initalize to ane of the forms
export const initForm = (
  setForm: Function,
  defaults: any,
  rules: Record<string, any> | null,
  register: Function,
  setValue: Function,
  watch: Function,
  errors: Object,
  unregister: Function,
  schemas: SchemaType,
) => {
  let schemaObject: Record<string, any> | null = {}
  let unitFieldScopes: Record<string, any> | null = null

  if (!rules) {
    schemaObject['properties'] = omit(schemas.schema?.properties, 'gatherings.items.properties.units')
  } else {
    schemaObject = schemas.schema?.properties?.gatherings?.items?.properties?.units
    unitFieldScopes = schemas.uiSchemaParams?.unitFieldScopes
  }

  if (!schemaObject) {
    setForm(null)
  } else if (rules && !unitFieldScopes) {
    setForm(null)
  }

  if (!rules) {
    setForm(Form(register, setValue, watch, errors, unregister, defaults, observationEventFields, null, schemaObject))
  } else {
    const fieldScope = Object.keys(unitFieldScopes[rules.field]).reduce((foundObject: Record<string, any> | null, key: string) => {
      const matches = new RegExp(rules.regexp).test(key)
      if (rules.complement ? !matches : matches) {
        return unitFieldScopes[rules.field][key]
      } else {
        return foundObject
      }
    }, null)

    if (!fieldScope) {
      return null
    }

    const fields = fieldScope?.fields.concat(['images'])
    const blacklist = fieldScope?.blacklist

    setForm(Form(register, setValue, watch, errors, unregister, defaults, fields, blacklist, schemaObject))
  }
}