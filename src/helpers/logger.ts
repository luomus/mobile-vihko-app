import { logger, transportFunctionType } from 'react-native-logs'
import { sendError } from '../services/loggerService'
import storageService from '../services/storageService'

const customTransport: transportFunctionType = async (props: any) => {
  let logs = await storageService.fetch('logs')

  //maximum log size is 10
  if (!logs || logs.length === 0) {
    logs = []
  } else if (logs.length >= 10) {
    while (logs.length >= 10) {
      logs.shift()
    }
  }

  const user_id = props.rawMsg[0].user_id

  //push the error to the log
  logs.push({
    date: new Date(),
    message: props.rawMsg
  })

  //send the error to the logger endpoint, and if it fails, write that error to the local log too
  try {
    await sendError(JSON.stringify(props.rawMsg), user_id)
  } catch (error) {
    logs.shift()
    logs.push({
      date: new Date(),
      message: {
        location: '/helpers/logger.ts customTransport()',
        error: error
      }
    })
  }

  //save the modified local log into storage
  await storageService.save('logs', logs)
}

const config = {
  transport: customTransport,
}

export const log = logger.createLogger(config)