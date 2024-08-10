import { PrismaClient } from './generated/psql.ts'

const psql = new PrismaClient({ log: ['info'] })

export { psql }
