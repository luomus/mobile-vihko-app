export interface SchemaType extends Record<string, any> {
  formID: string,
  fi: Record<string, any> | null,
  sv: Record<string, any> | null,
  en: Record<string, any> | null,
}