import { db } from '@tape.xyz/server'

const vacuumPostgres = async (): Promise<void> => {
  try {
    await db.query('VACUUM;')
    console.log('[cron] Postgres vacuum completed')
  } catch (error) {
    console.error('[cron] Error Postgres vacuum', error)
  }
}

export { vacuumPostgres }
