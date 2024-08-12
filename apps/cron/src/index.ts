import 'dotenv/config'

import cron from 'node-cron'

import { backupEventsToS3 } from './services/backup/events'
import { flushEvents } from './services/events'
import { vacuumPostgres } from './services/vacuum'

// Schedule the wake function to run 2 minutes before the flush job
// cron.schedule('58 */3 * * *', async () => {
//   console.log('[cron] Waking up database', new Date())
//   await wake()
// })

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

// Schedule the backupEventsToS3 function to run every 5 hour
cron.schedule('0 */5 * * *', async () => {
  console.log('[cron] Backing up events to S3', new Date())
  await backupEventsToS3()
})
