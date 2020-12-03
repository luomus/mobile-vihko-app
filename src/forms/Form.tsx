import { createPicker, createInputElement, createArray, createSwitch, createHidden, createImagePicker, createAutocompleteField } from '../builders/FormComponentBuilders'
import { get } from 'lodash'
import { parseObjectForFieldParams } from '../parsers/SchemaToInputParser'

const Form = (
  register: Function,
  setValue: Function,
  watch: Function,
  errors: Object,
  unregister: Function,
  defaults: Record<string, any> | undefined,
  fields: string[],
  blacklist: Record<string, any> | null,
  schema: Record<string, any> | null,
  overrideFields: Record<string, any> | null,
  lang: string,
) => {
  let toReturn: any[] = []

  const schemaToForm = (
    path: string | null,
    defaultObject: any,
    schema: Record<string, any>,
  ) => {
    const keysBlacklist = ['type', 'title', 'enum', 'enumNames', 'excludeFromCopy', 'required']
    const keys = Object.keys(schema)
    if (keys.length <= 0 && path) {
      createField(path, defaultObject, null)
    } else if (keys.includes('properties')) {
      schemaToForm(path, defaultObject, schema['properties'])

    } else if (keys.includes('items')) {
      if (path && schema['items']['properties']) {
        schemaToForm(`${path}_0`, defaultObject?.['0'], schema['items'])

      } else {
        schemaToForm(path, defaultObject, schema['items'])

      }
    } else {
      if (path && keys.some(key => keysBlacklist.includes(key))) {
        const fieldParams = parseObjectForFieldParams(schema)
        createField(path, defaultObject, fieldParams)
        return
      }

      keys.forEach(key => {
        let newPath = ''
        if (key !== '') {
          newPath = path ? path + `_${key}` : key
        } else if (path) {
          newPath = path
        }

        if (fields.includes(newPath)) {
          const fieldParams = parseObjectForFieldParams(schema[key])
          createField(newPath, defaultObject?.[key], fieldParams)
        } else if (schema[key]['properties'] || schema[key]['items']) {
          schemaToForm(newPath, defaultObject?.[key], schema[key])
        } else if (defaultObject || schema[key]['default']) {
          const fieldParams = parseObjectForFieldParams(schema[key])
          createField(newPath, defaultObject?.[key], fieldParams)
        }
      })
    }
  }

  const createField = (path: string, defaultObject: any, fieldParams: Record<string, any> | null) => {
    if (!fieldParams) {
      toReturn.push(createHidden(path, defaultObject, register, setValue))
      return
    }

    const fieldTitle: string =  get(fieldParams, 'title') === '' ? path : get(fieldParams, 'title')
    const fieldIsArray: boolean = fieldParams.isArray
    const fieldTypeOfArray: string = fieldParams.typeOfArray
    const fieldIsEnum: boolean = fieldParams.isEnum
    const fieldEnumDict: Record<string, any> = fieldParams.enumDict
    const fieldType: string = fieldParams.type
    let fieldDefaultValue: any = fieldParams.defaultValue
    let fieldBlacklist: string[] | null = null

    if (defaultObject) {
      fieldDefaultValue = defaultObject
    }

    //if current path corresponds to any of the override fields, handle the special case
    if (overrideFields && Object.keys(overrideFields).includes(path)) {
      switch (overrideFields[path].field) {
        case 'autocomplete':
          toReturn.push(createAutocompleteField(fieldTitle, path, fieldDefaultValue, register, setValue, watch, unregister, overrideFields[path].params, lang))
          return
      }
    }

    if (fieldIsEnum && blacklist) {
      fieldBlacklist = blacklist[path]
    }

    if (!fields.includes(path) && fieldDefaultValue) {
      toReturn.push(createHidden(path, fieldDefaultValue, register, setValue))
    } else if (fields.includes(path)) {
      if (path === 'gatheringEvent_leg' && fieldIsArray) {
        toReturn.push(createArray(fieldTitle, '', path, fieldTypeOfArray, fieldDefaultValue, register, setValue, watch, errors, unregister, true, false))
      } else if (path.includes('images')) {
        toReturn.push(createImagePicker(fieldTitle, path, fieldDefaultValue, register, setValue))
      } else if (fieldIsArray) {
        toReturn.push(createArray(fieldTitle, '', path, fieldTypeOfArray, fieldDefaultValue, register, setValue, watch, errors, unregister, true, true))
      } else if (fieldIsEnum) {
        toReturn.push(createPicker(fieldTitle, path, fieldDefaultValue, register, setValue, watch, errors, unregister, fieldEnumDict, fieldBlacklist))
      } else if (fieldType === 'boolean') {
        toReturn.push(createSwitch(fieldTitle, path, fieldDefaultValue, register, setValue, watch, errors, unregister))
      } else {
        toReturn.push(createInputElement(fieldTitle, path, '', fieldType, fieldDefaultValue, register, setValue, watch, errors, unregister, false, undefined, true))
      }
    }
  }

  const createOrderedArray = () => {
    if (!fields) {
      return toReturn
    }

    let orderedToReturn = fields.includes('*') ? new Array(fields.length - 1) : new Array(fields.length)

    toReturn.forEach(element => {
      let index = fields.findIndex(field => field === element.key)
      if (index >= 0) {
        orderedToReturn[index] = element
      } else {
        orderedToReturn.push(element)
      }
    })

    return orderedToReturn
  }

  if (schema) {
    schemaToForm(null, defaults, schema)
  }

  return createOrderedArray()
}

export default Form