export const SET_SCHEMA = 'SET_SCHEMA_SUCCESS'

export interface SchemaType extends Record<string, any> {
  formID: string,
  fi: Record<string, any> | null,
  sv: Record<string, any> | null,
  en: Record<string, any> | null,
}

interface setSchema {
  type: typeof SET_SCHEMA,
  payload: Record<string, any>,
}

export type schemaActionTypes =
  setSchema