import { get } from 'lodash'

//receives a path to element in observation or observation event object, an attempts to locate it from schema,
//jumping over properties- and items-keys
export const parsePathForFieldParams = (inputObject: Record<string, any>, path: Array<string>) => {
  const target = path.reduce((outputObject: Record<string, any>, key: string) => {
    if (!outputObject[key] && outputObject['items']) {
      return get(outputObject, ['items', 'properties', key], null)
    } else if (!outputObject[key] && outputObject['properties']) {
      return get(outputObject, ['properties', key], null)
    } else {
      return outputObject[key]
    }
  }, inputObject)

  return parseObjectForFieldParams(target)
}

//parses object containing the information of a single property for field parameters required by its input field
export const parseObjectForFieldParams = (inputObject: Record<string, any>) => {
  let title: string = ''
  let type: string = ''
  let isEnum: boolean = false
  let enumDict: Record<string, any> = {}
  let isArray: boolean = false
  let typeOfArray: string = ''
  let defaultValue: string = ''

  const formEnumDict = (enumKey: string[], enumNames: string[]) => {
    let dict: { [key: string]: any} = {}
    enumKey.forEach((k: string, index: number) => {
      dict[k] = enumNames[index]
    })

    return dict
  }

  Object.keys(inputObject).forEach((key: string) => {
    if (key === 'title') {
      title = inputObject.title
    } else if (key === 'type') {
      type = inputObject.type

      if (type === 'array') {
        isArray = true
        typeOfArray = inputObject.items.type
      }
    } else if (key === 'enum') {
      isEnum = true
      if (inputObject.enumNames && inputObject.enumNames.length > 0) {
        enumDict = formEnumDict(inputObject.enum, inputObject.enumNames)
      } else {
        enumDict = formEnumDict(inputObject.enum, inputObject.enum)
      }
    } else if (key === 'default') {
      defaultValue = inputObject.default
    }
  })

  return { title, type, isEnum, enumDict, isArray, typeOfArray, defaultValue }
}