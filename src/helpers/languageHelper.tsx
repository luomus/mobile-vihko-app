import i18n from '../languages/i18n'
import storageService from '../services/storageService'
import { log } from './logger'

export const initLanguage = async (): Promise<void> => {
  try {
    const language = await storageService.fetch('language')

    if (language) {
      await saveLanguage(language)
    }
  } catch (error) {
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
    log.error({
      location: '/helpers/languageHelper.tsx saveLanguage()',
      error: error
    })
  }

  Promise.resolve()
}