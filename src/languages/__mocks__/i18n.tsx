let language = 'fi'

const i18n = {
  get language() {
    return language
  },
  t: (key: string) => key,
  changeLanguage: (lng: string) => {
    language = lng
    return Promise.resolve()
  },
}

export const setLanguage = (lng: string) => {
  language = lng
}

export default i18n
