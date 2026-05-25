import { lajiApi, atlasApi } from './clients'
import { attachAuthInterceptor, attachErrorInterceptor, attachLangInterceptor } from './interceptors'
import Config from '../config/env'

attachAuthInterceptor(lajiApi, Config.ACCESS_TOKEN)
attachErrorInterceptor(lajiApi)
attachLangInterceptor(lajiApi)
attachErrorInterceptor(atlasApi)

export { lajiApi, atlasApi }
