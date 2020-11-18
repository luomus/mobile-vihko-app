import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fi from './translations/fi.json'
import en from './translations/en.json'
import sv from './translations/sv.json'
import fi_infotext from './translations/fi_information.json'
import en_infotext from './translations/en_information.json'
import sv_infotext from './translations/sv_information.json'

i18n
  .use(initReactI18next)
  .init({
    lng: 'fi',
    fallbackLng: ['en', 'sv'],
    resources: {
      fi: {
        translation: {
          ...fi,
          ...fi_infotext,
        }
      },
      en: {
        translation: {
          ...en,
          ...en_infotext,
        }
      },
      sv: {
        translation: {
          ...sv,
          ...sv_infotext,
        }
      }
    },
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n