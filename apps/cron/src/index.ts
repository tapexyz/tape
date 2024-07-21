import 'dotenv/config'

import { logger } from '@tape.xyz/generic'
import cron from 'node-cron'

import { flushEvents } from './services/events'

// Schedule the flushEvents function to run every 1 hour
cron.schedule('0 * * * *', async () => {
  logger.log('[cron] Flushing tower events', new Date())
  await flushEvents()
})
