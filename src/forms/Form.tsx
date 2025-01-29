import { createPicker, createInputElement, createArray, createSwitch, createHidden, createImagePicker, createAutocompleteField, createImageKeywordPicker, createAtlasCodeField, createDateTimePicker, createCountSelectorField } from './formComponentBuilders'
import { get, omit, set } from 'lodash'
import { parseObjectForFieldParams } from '../helpers/parsers/SchemaToInputParser'
import { ScrollView } from 'react-native'

const Form = (
  defaults: Record<string, any> | undefined,
  secondDefaults: Record<string, any> | undefined,
  fields: string[],
  blacklist: Record<string, any> | null,
  schema: Record<string, any> | null,
  secondSchema: Record<string, any> | null,
  overrideFields: Record<string, any> | null,
  additionalFields: Record<string, any> | null,
  fieldOrder: string[] | null = null,
  lang: string,
  scrollView: React.MutableRefObject<ScrollView | null>
) => {
  const toReturn: any[] = []

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
      toReturn.push(createHidden(path, defaultObject))
      return
    }
    const index = fields.length - fields.findIndex(field => field === path)
    const fieldTitle: string = get(fieldParams, 'title') === '' ? path : get(fieldParams, 'title')
    const fieldIsArray: boolean = fieldParams.isArray
    const fieldTypeOfArray: string = fieldParams.typeOfArray
    const fieldIsEnum: boolean = fieldParams.isEnum
    let fieldEnumDict: Record<string, any> = fieldParams.enumDict
    const fieldType: string = fieldParams.type
    let fieldDefaultValue: any = fieldParams.defaultValue
    let fieldBlacklist: string[] | null = null

    if (defaultObject !== undefined) {
      fieldDefaultValue = defaultObject
    }

    //if current path corresponds to any of the override fields, handle the special case
    if (overrideFields && Object.keys(overrideFields).includes(path)) {
      switch (overrideFields[path].field) {
        case 'autocomplete':
          toReturn.push(createAutocompleteField(fieldTitle, path, fieldDefaultValue, overrideFields[path].params, lang, index))
          return
        case 'imagesKeywords':
          toReturn.push(createImageKeywordPicker(fieldTitle, path, fieldDefaultValue, overrideFields[path].params, lang))
          return
        case 'inputTitleOverridden':
          createVisibleField(path, overrideFields[path].title, fieldIsArray, fieldTypeOfArray, fieldIsEnum,
            fieldEnumDict, fieldType, fieldDefaultValue, fieldBlacklist)
          return
        case 'atlasCodeField':
          toReturn.push(createAtlasCodeField(fieldTitle, path, fieldDefaultValue, overrideFields[path].params, fieldEnumDict))
          return
        case 'completeListField':
          set(fieldEnumDict, 'empty', '')
          fieldEnumDict = omit(fieldEnumDict, 'MY.completeListTypeCompleteWithBreedingStatus')
          const objectOrder = {
            'empty': '',
          }
          fieldEnumDict = Object.assign(objectOrder, fieldEnumDict) //sets empty as default, when user has not selected complete list value before
          toReturn.push(createPicker(fieldTitle, path, fieldDefaultValue, fieldEnumDict, fieldBlacklist, overrideFields[path].params.validation))
          return
        case 'countSelectorField':
          toReturn.push(createCountSelectorField(fieldTitle, path, fieldDefaultValue))
          return
        case 'dateBegin':
        case 'dateEnd':
          let pickerType: string | undefined
          if (fields.includes('gatheringEvent_timeStart') || fields.includes('gatheringEvent_timeEnd')) {
            pickerType = 'date'
          }
          toReturn.push(createDateTimePicker(fieldTitle, path, '', pickerType, fieldDefaultValue, overrideFields[path].params.validation))
          return
      }
    }

    if (fieldIsEnum && blacklist) {
      fieldBlacklist = blacklist[path]
    }

    if (!fields.includes(path) && fieldDefaultValue) {
      toReturn.push(createHidden(path, fieldDefaultValue))
    } else if (fields.includes(path)) {
      createVisibleField(
        path,
        fieldTitle,
        fieldIsArray,
        fieldTypeOfArray,
        fieldIsEnum,
        fieldEnumDict,
        fieldType,
        fieldDefaultValue,
        fieldBlacklist
      )
    }
  }

  const createVisibleField = (
    path: string,
    title: string | Array<string>,
    isArray: boolean,
    typeOfArray: string,
    isEnum: boolean,
    enumDict: Record<string, any>,
    type: string,
    defaultValue: any,
    blacklist: string[] | null
  ) => {
    let translatedTitle = ''

    if (typeof (title) !== 'string') {
      if (lang === 'fi') {
        translatedTitle = title[0]
      } else if (lang === 'sv') {
        translatedTitle = title[1]
      } else if (lang === 'en') {
        translatedTitle = title[2]
      }
    } else {
      translatedTitle = title
    }

    if (path === 'gatheringEvent_leg' && isArray) {
      toReturn.push(createArray(translatedTitle, '', path, typeOfArray, defaultValue, true, false, scrollView))
    } else if (path.includes('images')) {
      toReturn.push(createImagePicker(translatedTitle, path, defaultValue))
    } else if (isArray) {
      toReturn.push(createArray(translatedTitle, '', path, typeOfArray, defaultValue, true, true, scrollView))
    } else if (isEnum) {
      toReturn.push(createPicker(translatedTitle, path, defaultValue, enumDict, blacklist))
    } else if (type === 'boolean') {
      toReturn.push(createSwitch(translatedTitle, path, defaultValue))
    } else if (path.includes('gatheringEvent_time')) {
      toReturn.push(createDateTimePicker(translatedTitle, path, '', 'time', defaultValue))
    } else {
      toReturn.push(createInputElement(translatedTitle, path, '', type, defaultValue, false, undefined, true))
    }
  }

  const createOrderedArray = () => {
    if (!fields) {
      return toReturn
    }
    let orderedToReturn

    if (fieldOrder) {
      orderedToReturn = fieldOrder.includes('*') ? new Array(fieldOrder.length - 1) : new Array(fieldOrder.length)
    } else {
      orderedToReturn = fields.includes('*') ? new Array(fields.length - 1) : new Array(fields.length)
    }

    toReturn.forEach(element => {
      let index = 0
      if (fieldOrder) {
        index = fieldOrder.findIndex(field => field === element.key)
      } else {
        index = fields.findIndex(field => field === element.key)
      }

      if (index >= 0) {
        orderedToReturn[index] = element
      } else {
        orderedToReturn.push(element)
      }
    })

    return orderedToReturn
  }

  if (schema && secondSchema) {
    schemaToForm(null, defaults, schema)
    schemaToForm(null, secondDefaults, secondSchema)
  } else if (schema) {
    schemaToForm(null, defaults, schema)
  }

  if (additionalFields) {
    Object.keys(additionalFields).forEach(key => {
      const { title, isArray, typeOfArray, isEnum, enumDict, type, defaultValue, blacklist } = additionalFields[key]
      let fieldDefault: any = null

      if (defaults) {
        fieldDefault = get(defaults, key.split('_'))
      }
      if (secondDefaults) {
        fieldDefault = get(secondDefaults, key.split('_'))
      }

      fieldDefault = fieldDefault || defaultValue
      createVisibleField(
        key,
        title,
        isArray,
        typeOfArray,
        isEnum,
        enumDict,
        type,
        fieldDefault,
        blacklist
      )
    })
  }

  return createOrderedArray()
}

export default Form