import { logger, transportFunctionType } from 'react-native-logs'
import storageService from '../services/storageService'

const customTransport: transportFunctionType = async (msg, level) => {
  let logs = await storageService.fetch('logs')

  if (!logs || logs.length === 0) {
    logs = []
  } else if (logs.length > 50) {
    logs.shift()
  }

  logs.push({
    date: new Date(),
    level,
    message: msg
  })

  await storageService.save('logs', logs)}

const config = {
  transport: customTransport,
}

export const log = logger.createLogger(config)