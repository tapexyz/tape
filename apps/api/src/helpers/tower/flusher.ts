import clickhouseClient from '@/db/clickhouse'
import { rLength, rLoad, rTrim } from '@/db/redis'

const QUEUE_KEY = 'towerEvents'
const BATCH_SIZE = 5000

const flushEvents = async (): Promise<void> => {
  try {
    const length = await rLength(QUEUE_KEY)
    // Loop as batch of BATCH_SIZE events
    for (let i = 0; i < length; i += BATCH_SIZE) {
      const rawEvents = await rLoad(QUEUE_KEY, BATCH_SIZE)
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
    console.error('Error flushing events:', error)
  }
}

// Schedule the flushEvents function to run every 2 hours
setInterval(
  () => {
    flushEvents().catch(console.error)
  },
  60 * 60 * 1000
) // 2 hours in milliseconds

// Ensure any remaining events are flushed on process exit
process.on('exit', async () => {
  await flushEvents().catch(console.error)
})

flushEvents().catch(console.error)

export { flushEvents, QUEUE_KEY }
