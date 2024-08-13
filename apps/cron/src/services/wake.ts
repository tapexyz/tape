import { clickhouseClient } from '@tape.xyz/server'

const wake = async () => {
  try {
    let attempt = 0
    let maxAttempts = 5
    let delay = 2000 // 2 seconds delay between attempts

    while (attempt < maxAttempts) {
      const result = await clickhouseClient.ping()
      if (result.success) {
        console.log('[wake] ClickHouse database is awake!')
        return
      } else {
        console.log(
          `[wake] Attempt ${attempt + 1} failed, retrying in ${delay / 1000} seconds...`
        )
        // Wait for a short period of time before retrying
        await new Promise((resolve) => setTimeout(resolve, delay))
        attempt++
      }
    }
    console.error(
      '[wake] Failed to wake up ClickHouse database after multiple attempts.'
    )
  } catch (error) {
    console.error('[wake] Error waking up ClickHouse database:', error)
  }
}

export { wake }
