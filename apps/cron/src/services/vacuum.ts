import { psql } from '@tape.xyz/server'

const vacuumPostgres = async (): Promise<void> => {
  try {
    await psql.$queryRaw`VACUUM`
    console.log('[cron] Postgres vacuum completed')
  } catch (error) {
    console.error('[cron] Error Postgres vacuum', error)
  }
}

export { vacuumPostgres }
