import { clickhouseClient } from '@tape.xyz/server'

const wake = async () => {
  try {
    const result = await clickhouseClient.ping()
    if (result.success) {
      console.log('[wake] ClickHouse database is awake!')
    }
  } catch (error) {
    console.error('[wake] Error waking up ClickHouse database:', error)
  }
}

export { wake }
