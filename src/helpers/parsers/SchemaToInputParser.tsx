import { get } from 'lodash'

//receives a path to element in observation or observation event object, an attempts to locate it from schema,
//jumping over properties- and items-keys
export const parsePathForFieldParams = (inputObject: Record<string, any>, path: Array<string>) => {

  const target = path.reduce((outputObject: Record<string, any>, key: string) => {

    if (key === '0') {
      return get(outputObject, ['items', 'properties'], null)
    } else if (!outputObject[key] && outputObject['items']) {
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
export const parseObjectForFieldParams = (inputObject: Record<string, any>, parentTitle?: string) => {
  let title = ''
  let type = ''
  let isEnum = false
  let enumDict: Record<string, any> = {}
  let isArray = false
  let typeOfArray = ''
  let defaultValue: string | number | boolean = ''

  const formEnumDict = (oneOf: { const: string, title: string }[]) => {
    const dict: { [key: string]: any } = {}
    oneOf.forEach((entry: { const: string, title: string }) => {
      dict[entry.const] = entry.title
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
    } else if (key === 'oneOf') {
      isEnum = true
      enumDict = formEnumDict(inputObject.oneOf)
    } else if (key === 'default') {
      defaultValue = inputObject.default
    }
  })

  if (title === '' && parentTitle) title = parentTitle

  return { title, type, isEnum, enumDict, isArray, typeOfArray, defaultValue }
}