
interface MyObject {
  [key: string]: any
}

export const parseSchemaToJSONObject = (data: MyObject = {}) => {
  const finalObject = {}
  Object.keys(data).forEach((key: string) => {
    if (typeof(data[key]) === 'object') {
      let objectKey = key
      Object.keys(data[key]).forEach((key: string) => {
        handleKeysAndValues(key, objectKey, data[objectKey], finalObject)
      })
    }
  })
  return finalObject
}

const handleKeysAndValues = (key: string, objectKey: string, data: MyObject = {}, currentObject: MyObject = {}) => {
  switch (key) {
    case 'type':
      switch (data[key]) {
        case 'array':
          currentObject[objectKey] = []
          break
        case 'boolean':
          currentObject[objectKey] = false
          break
        case 'integer':
          currentObject[objectKey] = 0
          break
        case 'object':
          currentObject[objectKey] = {}
          break
        case 'string':
          currentObject[objectKey] = ''
          break
      }
      break
    case 'properties':
      //this should happen only when there is object(s) inside object
      data = data[key]
      Object.keys(data).forEach((subKey: string) => {
        handleKeysAndValues(subKey, objectKey, data, currentObject[objectKey])
      })
      break
    case 'title':
      //no need to handle
      break
    case 'items':
      //no need to handle
      break
    case 'default':
      switch (typeof(currentObject[objectKey])) {
        case 'boolean':
        case 'number':
        case 'string':
          currentObject[objectKey] = data[key]
          break
        case 'object':
          if (Array.isArray(currentObject[objectKey])) {
            currentObject[objectKey].push(data[key])
          }
          break
      }
      break
    case 'enum':
      //no need to handle
      break
    case 'enumNames':
      //no need to handle
      break
    case 'excludeFromCopy':
      //no need to handle
      break
    case 'required':
      //no need to handle
      break
    default:
      //new object that should be added to final object
      if (typeof(data[key]) === 'object' && !Array.isArray(data[key])) {
        let objectKey = key
        Object.keys(data[key]).forEach((subKey: string) => {
          handleKeysAndValues(subKey, objectKey, data[key], currentObject)
        })
      }
  }
}