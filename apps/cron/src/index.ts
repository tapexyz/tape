import 'dotenv/config'

import cron from 'node-cron'

import { flushEvents } from './services/events'
import { vacuumPostgres } from './services/vacuum'
import { wake } from './services/wake'

// Schedule the wake function to run 5 minutes before the main job
cron.schedule('55 */3 * * *', async () => {
  console.log('[cron] Waking up database', new Date())
  await wake()
})

// Schedule the flushEvents function to run every 4 hour
cron.schedule('0 */4 * * *', async () => {
  console.log('[cron] Flushing tower events', new Date())
  await flushEvents()
})

// Schedule the vacuumPostgres function to run every sunday at midnight
cron.schedule('0 0 * * 0', async () => {
  console.log('[cron] Vacuuming postgres', new Date())
  await vacuumPostgres()
})
