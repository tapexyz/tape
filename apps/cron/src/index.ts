import 'dotenv/config'

import { logger } from '@tape.xyz/generic'
import cron from 'node-cron'

import { flushEvents } from './services/events'

// Schedule the flushEvents function to run every 4 hour
cron.schedule('*/5 * * * *', async () => {
  logger.log('[cron] Flushing tower events', new Date())
  await flushEvents()
})
