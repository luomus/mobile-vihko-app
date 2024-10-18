import i18n from 'i18next'
import { setSchema } from '..'
import { SchemaType } from './types'
import { getSchemas } from '../../services/documentService'
import storageService from '../../services/storageService'
import { parseUiSchemaToObservations } from '../../helpers/parsers/UiSchemaParser'
import { log } from '../../helpers/logger'
import { useUiSchemaFields } from '../../config/fields'
import { captureException } from '../../helpers/sentry'
import { createAsyncThunk } from '@reduxjs/toolkit'

interface schemaParams {
  formID: string,
  lang: string
}

const HUMAN_READABLE_FORM_NAMES: { [key: string]: string } = {
  'JX.519': 'trip form',
  'MHL.117': 'bird atlas',
  'JX.652': 'fungi atlas',
  'MHL.45': 'lolife',
}

const ERROR_MESSAGES: { [key: string]: string } = {
  'StorageFetch': 'failed to load schema from storage',
  'Download': 'failed to load schema from server',
  'Parse': 'failed to parse uiSchema to input',
  'StorageSave': 'failed to save schema to storage'
}

export const initSchema = createAsyncThunk<Record<string, any>, schemaParams, { rejectValue: Record<string, any> }>(
  'schema/initSchema',
  async ({ formID, lang }, { rejectWithValue }) => {
    const storageKey = formID + lang[0].toUpperCase() + lang[1]
    let schema, fetchedSchema = null

    const logErrorHelper = (error: unknown, errorString: string, msgAction: string, msgSuffix: string) => log.error({
      location: '/stores/observation/actions.tsx initSchema()',
      error: error,
      details: 'While ' + msgAction + ' ' + formID + ' ' + lang + msgSuffix + '.',
      /*user_id: userID*/
    })

    try {
      //try loading schema and uiSchema from server
      fetchedSchema = await getSchemas(lang, formID)
    } catch (downloadError) {
      captureException(downloadError)
      try {
        //try loading schema from internal storage, if success inform user
        //of use of old stored version, if error warn user of total failure
        schema = await storageService.fetch(storageKey)

        //warn user of using internally stored schema
        logErrorHelper(downloadError, 'Download', 'fetching', 'from the server')
        return rejectWithValue({
          severity: 'low',
          message: i18n.t(ERROR_MESSAGES['Download']) + '\n' + i18n.t(HUMAN_READABLE_FORM_NAMES[formID]) + ' ' + i18n.t('in languages') + ': ' + lang
        })
      } catch (storageFetchError) {
        captureException(storageFetchError)
        logErrorHelper(storageFetchError, 'StorageFetch', 'fetching', 'from the storage')
        return rejectWithValue({
          severity: 'high',
          message: i18n.t(ERROR_MESSAGES['StorageFetch']) + '\n' + i18n.t(HUMAN_READABLE_FORM_NAMES[formID]) + ' ' + i18n.t('in languages') + ': ' + lang
        })
      }
    }

    //fresh schema was fetched from net, try to parse necessary parameters and values for input creation from it
    if (fetchedSchema) {
      if (useUiSchemaFields.includes(formID)) {
        const uiSchemaParams = parseUiSchemaToObservations(fetchedSchema.uiSchema)

        //if parsing fails warn user that language is unusable
        if (!uiSchemaParams) {
          logErrorHelper(null, 'Parse', 'parsing', '')
          return rejectWithValue({
            severity: 'high',
            message: i18n.t(ERROR_MESSAGES['Parse']) + '\n' + i18n.t(HUMAN_READABLE_FORM_NAMES[formID]) + ' ' + i18n.t('in languages') + ': ' + lang
          })
        }

        schema = {
          schema: fetchedSchema.schema,
          uiSchemaParams: uiSchemaParams
        }
      } else {
        schema = {
          schema: fetchedSchema.schema,
          timestamp: Date.now()
        }
      }
    }

    //try to store schema to internal storage for use as backup, if schemas are from server (i.e. first try-catch has not set any error),
    //if fails set error message
    try {
      await storageService.save(storageKey, schema)
    } catch (storageSaveError) {
      captureException(storageSaveError)
      logErrorHelper(storageSaveError, 'StorageSave', 'saving', 'to storage')
      return rejectWithValue({
        severity: 'low',
        message: i18n.t(ERROR_MESSAGES['StorageSave']) + '\n' + i18n.t(HUMAN_READABLE_FORM_NAMES[formID]) + ' ' + i18n.t('in languages') + ': ' + lang
      })
    }

    return schema
  }
)

/*
errors.forEach(err => dispatch(setMessageState({
          type: 'err',
          messageContent: err.message
        })))
*/

export const switchSchema = createAsyncThunk<Promise<any>, schemaParams, { rejectValue: unknown }>(
  'schema/switchSchema',
  async ({ formID, lang }, { dispatch, rejectWithValue }) => {
    const schemas: SchemaType = {
      formID: formID,
      fi: null,
      en: null,
      sv: null
    }

    // attempt fetching schema from storage
    schemas[lang] = await storageService.fetch(formID + lang[0].toUpperCase() + lang[1])

    // fetch schema from the api if there was no schema in the storage, or if it has been expired
    if (
      !schemas[lang]
      || !schemas[lang].timestamp
      || (schemas[lang].timestamp && schemas[lang].timestamp < Date.now() - (24 * 60 * 60 * 1000))
    ) {
      try {
        schemas[lang] = await dispatch(initSchema({ formID, lang })).unwrap()
      } catch (error) {
        if (!schemas[lang]) {
          rejectWithValue(error)
        }
      }
    }

    dispatch(setSchema(schemas))
  }
)