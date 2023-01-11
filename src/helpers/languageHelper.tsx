import i18n from '../languages/i18n'
import storageService from '../services/storageService'
import { log } from './logger'
import { captureException } from './sentry'

export const initLanguage = async (): Promise<void> => {
  try {
    const language = await storageService.fetch('language')

    i18n.changeLanguage(language)
  } catch (error) {
    captureException(error)
    log.error({
      location: '/helpers/languageHelper.tsx initLanguage()',
      error: error
    })
  }

  return Promise.resolve()
}

export const saveLanguage = async (language: string): Promise<void> => {
  i18n.changeLanguage(language)

  try {
    await storageService.save('language', language)
  } catch (error) {
    captureException(error)
    log.error({
      location: '/helpers/languageHelper.tsx saveLanguage()',
      error: error
    })
  }

  Promise.resolve()
}