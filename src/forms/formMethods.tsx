import Form from './Form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

//called in component to initalize to any of the forms
export const initForm = (
  setForm: React.Dispatch<React.SetStateAction<(React.JSX.Element | undefined)[] | null>>,
  defaults: any,
  rules: Record<string, any> | null = null,
  schema: Record<string, any> | null = null,
  fieldScopes: Record<string, any> | null = null,
  fields: string[] | null = null,
  overrideFields: Record<string, any> | null = null,
  additionalFields: Record<string, any> | null = null,
  fieldOrder: string[] | null = null,
  lang: string,
  scrollView: React.MutableRefObject<KeyboardAwareScrollView | null>
) => {

  if (!schema) {
    setForm(null)
  } else if (rules && !fieldScopes) {
    setForm(null)
  } else if (!rules) {
    if (!fields) {
      setForm(null)
    } else {
      setForm(Form(defaults, fields, null, schema, overrideFields, additionalFields, fieldOrder, lang, scrollView))
    }
  } else {
    if (fieldScopes === null) {
      return
    }

    const fieldScope = Object.keys(fieldScopes[rules.field]).reduce((foundObject: Record<string, any> | null, key: string) => {
      const matches = new RegExp(rules.regexp).test(key)
      if (rules.complement ? !matches : matches) {
        return fieldScopes[rules.field][key]
      } else {
        return foundObject
      }
    }, null)

    const fields = fieldScope?.fields.concat(['images'])
    const blacklist = fieldScope?.blacklist

    setForm(Form(defaults, fields, blacklist, schema, overrideFields, additionalFields, fieldOrder, lang, scrollView))
  }
}