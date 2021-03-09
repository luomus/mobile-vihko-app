import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fi from './translations/fi.json'
import en from './translations/en.json'
import sv from './translations/sv.json'

i18n
  .use(initReactI18next)
  .init({
    lng: 'fi',
    fallbackLng: ['en', 'sv'],
    resources: {
      fi: {
        translation: {
          ...fi
        }
      },
      en: {
        translation: {
          ...en
        }
      },
      sv: {
        translation: {
          ...sv
        }
      }
    },
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n