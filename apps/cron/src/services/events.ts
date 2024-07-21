import { TOWER_EVENTS_REDIS_KEY } from '@tape.xyz/constants'
import { clickhouseClient, rLength, rLoad, rTrim } from '@tape.xyz/server'

const QUEUE_KEY = TOWER_EVENTS_REDIS_KEY
const BATCH_SIZE = 5000

const flushEvents = async (): Promise<void> => {
  try {
    const length = await rLength(QUEUE_KEY)
    // Loop as batch of BATCH_SIZE events
    for (let i = 0; i < length; i += BATCH_SIZE) {
      // pick BATCH_SIZE events from the start of the queue
      const rawEvents = await rLoad(QUEUE_KEY, i, BATCH_SIZE - 1)
      const events: Record<string, any>[] = rawEvents.map((event) =>
        JSON.parse(event)
      )
      if (events.length > 0) {
        await clickhouseClient.insert({
          format: 'JSONEachRow',
          table: 'events',
          values: events
        })
        await rTrim(QUEUE_KEY, events.length)
      }
    }
  } catch (error) {
    console.error('[cron] Error flushing tower events', error)
  }
}

export { flushEvents }
