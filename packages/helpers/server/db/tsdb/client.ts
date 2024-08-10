import { PrismaClient } from './generated/tsdb.ts'

const tsdb = new PrismaClient({ log: ['info'] })

export { tsdb }
