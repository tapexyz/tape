import pgp from 'pg-promise'

const initOptions: pgp.IInitOptions = {
  error: (err, e) => {
    console.error('[PG] Error:', err?.message || err)
    if (e.query) {
      console.log('[PG] Error Query:', e.query)
      if (e.params) {
        console.log('[PG] Error Parameters:', e.params)
      }
    }
  }
}

const db = pgp(initOptions)({
  connectionString: process.env.DATABASE_URL!,
  max: 20
})

export { db }
