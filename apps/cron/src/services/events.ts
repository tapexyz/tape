import { REDIS_KEYS } from '@tape.xyz/constants'
import { rLength, rLoad, rTrim, tsdb } from '@tape.xyz/server'

const QUEUE_KEY = REDIS_KEYS.TOWER_EVENTS
const BATCH_SIZE = 5000

const flushEvents = async (): Promise<void> => {
  try {
    const length = await rLength(QUEUE_KEY)
    // Loop as batch of BATCH_SIZE events
    for (let i = 0; i < length; i += BATCH_SIZE) {
      const startTime = performance.now()

      // pick BATCH_SIZE events from the start of the queue (for eg 0 to 4999)
      const rawEvents = await rLoad(QUEUE_KEY, i, BATCH_SIZE - 1)
      const events: any[] = rawEvents.map((event) => JSON.parse(event))

      if (events.length > 0) {
        await tsdb.event.createMany({
          data: events
        })
        await rTrim(QUEUE_KEY, events.length)
      }

      const took = performance.now() - startTime
      console.log(
        `[cron] tower events - batch inserted ${events.length} events to tsdb in ${took}ms`
      )
    }
  } catch (error) {
    console.error('[cron] Error flushing tower events', error)
  }
}

export { flushEvents }
