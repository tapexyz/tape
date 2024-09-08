import { PrismaClient } from '@prisma/client'

const psql = new PrismaClient({ log: ['info'] })

export { psql }
