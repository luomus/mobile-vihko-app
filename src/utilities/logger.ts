import { logger, transportFunctionType } from 'react-native-logs'
import storageController from '../controllers/storageController'

const customTransport: transportFunctionType = async (msg, level) => {
  let logs = await storageController.fetch('logs')

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

  await storageController.save('logs', logs)}

const config = {
  transport: customTransport,
}

export const log = logger.createLogger(config)