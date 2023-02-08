import axios from 'axios'
import { v4 as uuid } from 'uuid'

import { DATADOG_API_KEY, IS_MAINNET } from './constants'

const enabled = DATADOG_API_KEY && IS_MAINNET
const isBrowser = typeof window !== 'undefined'

const sendError = (error: string) => {
  if (isBrowser && enabled) {
    const reqId = uuid()
    axios('https://http-intake.logs.datadoghq.com/api/v2/logs', {
      method: 'POST',
      params: {
        'dd-api-key': DATADOG_API_KEY,
        'dd-request-id': reqId
      },
      data: {
        ddsource: 'browser',
        status: 'error',
        error,
        url: location.href,
        sha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
      }
    })
      .then(() => reqId)
      .catch(() => {
        console.error('Error while sending error to Datadog')
      })
  }
}

const logger = {
  log: (message: string, info: any) => {
    console.log(message, info)
  },
  warn: (...args: any) => {
    console.warn(...args)
  },
  error: (message: string, error: any) => {
    sendError(`${message} - ${JSON.stringify(error)}`)
    console.error(message, error)
  }
}

export default logger
