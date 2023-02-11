import axios from 'axios'

import { IS_MAINNET, LENSTUBE_TAIL_URL } from './constants'

const tailLog = (level: 'error' | 'log', message: string) => {
  if (IS_MAINNET) {
    axios
      .post(LENSTUBE_TAIL_URL, {
        source: 'web',
        level,
        message,
        url: location.href
      })
      .catch((error) => {
        console.error(error)
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
    tailLog('error', `${message} ${JSON.stringify(error)}`)
    console.error(message, error)
  }
}

export default logger
