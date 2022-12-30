import { ThunkAction } from 'redux-thunk'
import i18n from 'i18next'
import {
  schemaActionTypes,
  SET_SCHEMA
} from './types'
import { getSchemas } from '../../services/documentService'
import storageService from '../../services/storageService'
import { parseUiSchemaToObservations } from '../../helpers/parsers/UiSchemaParser'
import { log } from '../../helpers/logger'
import { useUiSchemaFields } from '../../config/fields'
import { captureException } from '../../helpers/sentry'

export const setSchema = (schemas: Record<string, any>): schemaActionTypes => ({
  type: SET_SCHEMA,
  payload: schemas
})

export const initSchemas = (formIDs: Array<string>): ThunkAction<Promise<void>, any, void, schemaActionTypes> => {
  return async (dispatch, getState) => {
    const { credentials } = getState()

    let languages: string[] = ['fi', 'en', 'sv']

    interface schemaErrors {
      formID: string,
      errors: {
        unsuccessfullyDownloadedLanguages: Array<string>,
        unsuccessfullyStorageFetchedLanguages: Array<string>,
        unsuccessfullyParsedLanguages: Array<string>,
        unsuccessfullyStorageSavedLanguages: Array<string>
      }
    }

    let schemaErrorsList: Array<schemaErrors> = []

    let sumOfUnsuccessfullyDownloadedLanguages: number = 0
    let sumOfUnsuccessfullyStorageFetchedLanguages: number = 0
    let sumOfUnsuccessfullyParsedLanguages: number = 0
    let sumOfUnsuccessfullyStorageSavedLanguages: number = 0

    let errors: Record<string, any> = []

    for (let formID of formIDs) {

      let schemas: Record<string, any> = {
        formID: formID,
        fi: null,
        en: null,
        sv: null
      }

      let storageKeys: Record<string, string> = {
        fi: `${formID}Fi`,
        en: `${formID}En`,
        sv: `${formID}Sv`
      }

      let schemaErrors: schemaErrors = {
        formID: formID,
        errors: {
          unsuccessfullyDownloadedLanguages: [],
          unsuccessfullyStorageFetchedLanguages: [],
          unsuccessfullyParsedLanguages: [],
          unsuccessfullyStorageSavedLanguages: []
        }
      }

      const useUiSchema = useUiSchemaFields.includes(formID)

      //loop over each language initializing field parameters for each and schema for first existing
      for (let language of languages) {
        let fetchedSchema = null

        try {
          //try loading schema and uiSchema from server
          fetchedSchema = await getSchemas(language, formID)

        } catch (downloadError) {
          captureException(downloadError)
          try {
            //try loading schema from internal storage, if success inform user
            //of use of old stored version, if error warn user of total failure
            schemas[language] = await storageService.fetch(storageKeys[language])

            //warn user of using internally stored schema
            schemaErrors.errors.unsuccessfullyDownloadedLanguages.push(language)
            sumOfUnsuccessfullyDownloadedLanguages++
            log.error({
              location: '/stores/observation/actions.tsx initSchemas()',
              error: downloadError,
              details: 'While fetching ' + formID + ' ' + language + ' from the server.',
              user_id: credentials.user.id
            })
          } catch (storageFetchError) {
            captureException(storageFetchError)
            schemaErrors.errors.unsuccessfullyStorageFetchedLanguages.push(language)
            sumOfUnsuccessfullyStorageFetchedLanguages++
            log.error({
              location: '/stores/observation/actions.tsx initSchemas()',
              error: storageFetchError,
              details: 'While fetching ' + formID + ' ' + language + ' from the storage.',
              user_id: credentials.user.id
            })
            continue
          }
        }

        //fresh schema was fetched from net, try to parse necessary parameters and values for input creation from it
        if (fetchedSchema) {
          let uiSchemaParams

          if (useUiSchema) {
            uiSchemaParams = parseUiSchemaToObservations(fetchedSchema.uiSchema)

            //if parsing fails warn user that language is unusable
            if (!uiSchemaParams) {
              schemaErrors.errors.unsuccessfullyParsedLanguages.push(language)
              sumOfUnsuccessfullyParsedLanguages++
              log.error({
                location: '/stores/observation/actions.tsx initSchemas()',
                details: 'While parsing ' + formID + ' ' + language + '.',
                user_id: credentials.user.id
              })
              continue
            }

            schemas[language] = {
              schema: fetchedSchema.schema,
              uiSchemaParams: uiSchemaParams
            }

          } else {
            schemas[language] = {
              schema: fetchedSchema.schema,
            }
          }
        }

        //try to store schema to internal storage for use as backup, if schemas are from server (i.e. first try-catch has not set any error),
        //if fails set error message
        try {
          await storageService.save(storageKeys[language], schemas[language])
        } catch (storageSaveError) {
          captureException(storageSaveError)
          schemaErrors.errors.unsuccessfullyStorageSavedLanguages.push(language)
          sumOfUnsuccessfullyStorageSavedLanguages++
          log.error({
            location: '/stores/observation/actions.tsx initSchemas()',
            error: storageSaveError,
            details: 'While saving ' + formID + ' ' + language + ' to storage.',
            user_id: credentials.user.id
          })
        }
      }

      schemaErrorsList.push(schemaErrors)

      //schema and field parameters to correct language choice
      dispatch(setSchema(schemas))
    }

    if (sumOfUnsuccessfullyStorageFetchedLanguages === 12) {
      return Promise.reject([{
        severity: 'fatal',
        message: i18n.t('could not load any schemas')
      }])

    } else {

      const createErrorMessageContent = (
        tripFormLanguages?: Array<string>,
        birdAtlasLanguages?: Array<string>,
        fungiAtlasLanguages?: Array<string>,
        lolifeLanguages?: Array<string>
      ) => {
        let messageParagraphs: Array<string> = []

        const tripFormParagraph = tripFormLanguages ? (tripFormLanguages.length > 0 ? (i18n.t('trip form') + ' ' + i18n.t('in languages') + ': ' + tripFormLanguages.join(', ')) : undefined) : undefined
        const birdAtlasParagraph = birdAtlasLanguages ? (birdAtlasLanguages.length > 0 ? (i18n.t('bird atlas') + ' ' + i18n.t('in languages') + ': ' + birdAtlasLanguages.join(', ')) : undefined) : undefined
        const fungiAtlasParagraph = fungiAtlasLanguages ? (fungiAtlasLanguages.length > 0 ? (i18n.t('fungi atlas') + ' ' + i18n.t('in languages') + ': ' + fungiAtlasLanguages.join(', ')) : undefined) : undefined
        const lolifeParagraph = lolifeLanguages ? (lolifeLanguages.length > 0 ? (i18n.t('lolife') + ' ' + i18n.t('in languages') + ': ' + lolifeLanguages.join(', ')) : undefined) : undefined

        if (tripFormParagraph) messageParagraphs.push(tripFormParagraph)
        if (birdAtlasParagraph) messageParagraphs.push(birdAtlasParagraph)
        if (fungiAtlasParagraph) messageParagraphs.push(fungiAtlasParagraph)
        if (lolifeParagraph) messageParagraphs.push(lolifeParagraph)

        if (messageParagraphs.length > 0) {
          let messageContent = '\n'

          messageParagraphs.forEach(paragraph => {
            messageContent += ('\n' + paragraph)
          })

          return messageContent
        } else {
          return ''
        }
      }

      if (sumOfUnsuccessfullyStorageFetchedLanguages) {
        errors.push({
          severity: 'high',
          message: i18n.t('failed to load schema from server and storage') + createErrorMessageContent(
            schemaErrorsList.find(schema => schema.formID === 'JX.519')?.errors.unsuccessfullyStorageFetchedLanguages,
            schemaErrorsList.find(schema => schema.formID === 'MHL.117')?.errors.unsuccessfullyStorageFetchedLanguages,
            schemaErrorsList.find(schema => schema.formID === 'JX.652')?.errors.unsuccessfullyStorageFetchedLanguages,
            schemaErrorsList.find(schema => schema.formID === 'MHL.45')?.errors.unsuccessfullyStorageFetchedLanguages
          )
        })
      }
      if (sumOfUnsuccessfullyDownloadedLanguages > 0) {
        errors.push({
          severity: 'low',
          message: i18n.t('failed to load schema from server') + createErrorMessageContent(
            schemaErrorsList.find(schema => schema.formID === 'JX.519')?.errors.unsuccessfullyDownloadedLanguages,
            schemaErrorsList.find(schema => schema.formID === 'MHL.117')?.errors.unsuccessfullyDownloadedLanguages,
            schemaErrorsList.find(schema => schema.formID === 'JX.652')?.errors.unsuccessfullyDownloadedLanguages,
            schemaErrorsList.find(schema => schema.formID === 'MHL.45')?.errors.unsuccessfullyDownloadedLanguages
          )
        })
      }
      if (sumOfUnsuccessfullyParsedLanguages > 0) {
        errors.push({
          severity: 'high',
          message: i18n.t('failed to parse uiSchema to input') + createErrorMessageContent(
            schemaErrorsList.find(schema => schema.formID === 'JX.519')?.errors.unsuccessfullyParsedLanguages,
            schemaErrorsList.find(schema => schema.formID === 'MHL.117')?.errors.unsuccessfullyParsedLanguages,
            schemaErrorsList.find(schema => schema.formID === 'JX.652')?.errors.unsuccessfullyParsedLanguages,
            schemaErrorsList.find(schema => schema.formID === 'MHL.45')?.errors.unsuccessfullyParsedLanguages
          )
        })
      }
      if (sumOfUnsuccessfullyStorageSavedLanguages > 0) {
        errors.push({
          severity: 'low',
          message: i18n.t('failed to save schema to storage') + createErrorMessageContent(
            schemaErrorsList.find(schema => schema.formID === 'JX.519')?.errors.unsuccessfullyStorageSavedLanguages,
            schemaErrorsList.find(schema => schema.formID === 'MHL.117')?.errors.unsuccessfullyStorageSavedLanguages,
            schemaErrorsList.find(schema => schema.formID === 'JX.652')?.errors.unsuccessfullyStorageSavedLanguages,
            schemaErrorsList.find(schema => schema.formID === 'MHL.45')?.errors.unsuccessfullyStorageSavedLanguages
          )
        })
      }
    }

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