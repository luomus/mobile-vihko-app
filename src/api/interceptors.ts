import { log } from '../helpers/logger'
import { captureException } from '../helpers/sentry'
import i18n from '../languages/i18n'

export const attachAuthInterceptor = (client: any, token: string) => {
  client.interceptors.request.use((config: any) => {
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  })
}

export const attachLangInterceptor = (client: any) => {
  client.interceptors.request.use((config: any) => {
    config.headers['Accept-Language'] = i18n.language ?? 'fi'
    return config
  })
}

export const attachErrorInterceptor = (client: any, excludeUrls: string[] = []) => {
  client.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      const url = error.config?.url ?? ''
      if (!excludeUrls.some(u => url.includes(u))) {
        log.error({ location: url, error })
        captureException(error)
      }
      return Promise.reject(error)
    }
  )
}
