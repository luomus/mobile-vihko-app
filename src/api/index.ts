import { lajiApi, atlasApi } from './clients'
import { attachApiVersionInterceptor, attachAuthInterceptor, attachErrorInterceptor,
  attachLangInterceptor, attachPersonTokenInterceptor } from './interceptors'
import { store } from '../stores'
import Config from '../config/env'

attachApiVersionInterceptor(lajiApi)
attachAuthInterceptor(lajiApi, Config.ACCESS_TOKEN)
attachPersonTokenInterceptor(lajiApi, () => store.getState().credentials.token)
attachErrorInterceptor(lajiApi)
attachLangInterceptor(lajiApi)
attachErrorInterceptor(atlasApi)

export { lajiApi, atlasApi }
