import {
  schemaActionTypes,
  SchemaType,
  SET_SCHEMA
} from './types'

const initSchemaState: SchemaType = {
  fi: null,
  en: null,
  sv: null,
  formID: ''
}

const schemaReducer = (state = initSchemaState, action : schemaActionTypes) => {
  switch (action.type) {
    case SET_SCHEMA:
      return {
        ...action.payload,
      }
    default:
      return state
  }
}

export {
  schemaReducer
}