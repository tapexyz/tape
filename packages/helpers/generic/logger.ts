import {
  IS_MAINNET,
  IS_PRODUCTION,
  LENSTUBE_TAIL_INGEST_URL
} from '@lenstube/constants/general'
import axios from 'axios'

const tailLog = (level: 'error' | 'log', message: string) => {
  if (IS_MAINNET && IS_PRODUCTION) {
    axios
      .post(LENSTUBE_TAIL_INGEST_URL, {
        source: 'web',
        level,
        message
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

export const logger = {
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
