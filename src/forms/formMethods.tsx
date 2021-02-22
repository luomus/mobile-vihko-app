import Form from './Form'

//called in component to initalize to ane of the forms
export const initForm = (
  setForm: Function,
  defaults: any,
  rules: Record<string, any> | null = null,
  schema: Record<string, any> | null = null,
  fieldScopes: Record<string, any> | null = null,
  fields: string[] | null = null,
  overrideFields: Record<string, any> | null = null,
  additionalFields: Record<string, any> | null = null,
  lang: string
) => {

  if (!schema) {
    setForm(null)
  } else if (rules && !fieldScopes) {
    setForm(null)
  } else if (!rules && !fields) {
    setForm(null)
  }

  if (!rules) {
    setForm(Form(defaults, fields, null, schema, overrideFields, additionalFields, lang))
  } else {
    const fieldScope = Object.keys(fieldScopes[rules.field]).reduce((foundObject: Record<string, any> | null, key: string) => {
      const matches = new RegExp(rules.regexp).test(key)
      if (rules.complement ? !matches : matches) {
        return fieldScopes[rules.field][key]
      } else {
        return foundObject
      }
    }, null)

    if (!fieldScope) {
      return null
    }

    const fields = fieldScope?.fields.concat(['images'])
    const blacklist = fieldScope?.blacklist

    setForm(Form(defaults, fields, blacklist, schema, overrideFields, additionalFields, lang))
  }
}