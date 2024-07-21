import 'dotenv/config'

import cron from 'node-cron'

import { flushEvents } from './services/events'

const run = () => {
  // Schedule the flushEvents function to run every 4 hour
  cron.schedule('* * * * *', async () => {
    // cron.schedule('0 */4 * * *', async () => {
    console.log('[cron] Flushing tower events', new Date())
    await flushEvents()
  })
}

run()
