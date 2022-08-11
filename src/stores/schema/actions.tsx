import { ThunkAction } from 'redux-thunk'
import i18n from 'i18next'
import {
  schemaActionTypes,
  SET_SCHEMA
} from './types'
import { getSchemas } from '../../services/documentService'
import storageService from '../../services/storageService'
import { parseUiSchemaToObservations } from '../../helpers/parsers/UiSchemaParser'
import { netStatusChecker } from '../../helpers/netStatusHelper'
import { log } from '../../helpers/logger'

export const setSchema = (schemas: Record<string, any>): schemaActionTypes => ({
  type: SET_SCHEMA,
  payload: schemas
})

export const initSchema = (useUiSchema: boolean, formId: string): ThunkAction<Promise<void>, any, void, schemaActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials } = getState()

    let languages: string[] = ['fi', 'en', 'sv']
    let schemas: Record<string, any> = {
      formID: formId,
      fi: null,
      en: null,
      sv: null
    }
    let storageKeys: Record<string, string> = {
      fi: `${formId}Fi`,
      en: `${formId}En`,
      sv: `${formId}Sv`
    }

    //try to load schemas from server, else case if error try to load schemas
    //from internal storage
    let errors: Record<string, any>[] = []
    let errorFatal: Record<string, boolean> = {
      fi: false,
      en: false,
      sv: false
    }

    //check that internet can be reached
    try {
      await netStatusChecker()
    } catch (error) {
      log.error({
        location: '/stores/schema/actions.tsx initSchema()/netStatusChecker()',
        error: 'Network error (no connection)',
        user_id: credentials.user.id
      })
      return Promise.reject([{
        severity: 'fatal',
        message: error.message
      }])
    }

    //loop over each language initializing field parameters for each and schema for first existing
    for (let lang of languages) {
      let tempSchemas = null
      let langError: Record<string, string> | null = null

      try {
        //try loading schema and uiSchema from server
        tempSchemas = await getSchemas(lang, formId)

        //fresh schema was fetched from net, try to parse necessary parameters and values for input creation from it
        if (tempSchemas) {
          let uiSchemaParams

          if (useUiSchema) {
            uiSchemaParams = parseUiSchemaToObservations(tempSchemas.uiSchema)

            //if parsing fails warn user that language is unusable
            if (!uiSchemaParams) {
              errors.push({
                severity: 'high',
                message: i18n.t(`could not parse ${lang} uiSchema to input`)
              })

              errorFatal[lang] = true
              continue
            }
          }

          if (useUiSchema) {
            schemas[lang] = {
              schema: tempSchemas.schema,
              uiSchemaParams: uiSchemaParams
            }
          } else {
            schemas[lang] = {
              schema: tempSchemas.schema,
            }
          }
        }

        //try to store schema to internal storage for use as backup, if schemas are from server (i.e. first try-catch has not set any error),
        //if fails set error message
        try {
          await storageService.save(storageKeys[lang], schemas[lang])
        } catch (error) {
          langError = {
            severity: 'low',
            message: i18n.t(`${lang} schema save to async failed`)
          }
          log.error({
            location: '/stores/observation/actions.tsx initSchema()',
            error: error,
            details: 'While saving ' + lang + ' to AsyncStorage.',
            user_id: credentials.user.id
          })
        }

        //if error was met push into errors-array for eventual return to user
        if (langError) {
          errors.push(langError)
        }

      } catch (netError) {
        try {
          //try loading schema from internal storage, if success inform user
          //of use of old stored version, if error warn user of total failure
          schemas[lang] = await storageService.fetch(storageKeys[lang])

          //warn user of using internally stored schema
          langError = {
            severity: 'low',
            message: `${i18n.t(`error loading ${lang} schema from server`)} ${netError.message}`
          }
          log.error({
            location: '/stores/observation/actions.tsx initSchema()',
            error: netError,
            details: 'While downloading ' + lang + ' schema.',
            user_id: credentials.user.id
          })

          errors.push(langError)

        } catch (locError) {

          langError = {
            severity: 'high',
            message: `${i18n.t(`error loading ${lang} schema from server and internal`)} ${netError.message}`
          }
          log.error({
            location: '/stores/observation/actions.tsx initSchema()',
            error: locError,
            details: 'While fetching ' + lang + ' from AsyncStorage.',
            user_id: credentials.user.id
          })

          errors.push(langError)
          errorFatal[lang] = true
          continue
        }
      }
    }

    //check if every language suffered fatal errors resulting in no usable schemas or form parameter collections
    if (Object.keys(errorFatal).every(key => errorFatal[key])) {
      let fatalError: Record<string, any> = [{
        severity: 'fatal',
        message: i18n.t('could not load any schemas')
      }]

      errors = errors.concat(fatalError)

      return Promise.reject(errors)
    }

    //schema and field parameters to correct language choice
    dispatch(setSchema(schemas))

    //if non-fatal errors present reject and send errors
    if (errors.length > 0) {
      return Promise.reject(errors)
    }
    return Promise.resolve()
  }
}

export const switchSchema = (formId: string): ThunkAction<Promise<void>, any, void, schemaActionTypes> => {
  return async dispatch => {
    let languages: string[] = ['Fi', 'En', 'Sv']

    let schemas: Record<string, any> = {
      formID: formId,
      fi: null,
      en: null,
      sv: null
    }

    for (let lang of languages) {
      schemas[lang.toLowerCase()] = await storageService.fetch(`${formId}${lang}`)
    }

    dispatch(setSchema(schemas))
    Promise.resolve()
  }
}