import pgp from 'pg-promise'

const db = pgp()({ connectionString: process.env.DATABASE_URL, max: 10 })

export { db }
