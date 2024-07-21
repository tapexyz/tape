import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

const rSave = async (key: string, value: string): Promise<void> => {
  await redis.rpush(key, value)
}
const rLoad = async (
  key: string,
  start: number = 0,
  end: number = -1
): Promise<string[]> => {
  return await redis.lrange(key, start, end)
}

const rClear = async (key: string): Promise<void> => {
  await redis.del(key)
}

const rLength = async (key: string): Promise<number> => {
  return redis.llen(key)
}

const rTrim = async (key: string, count: number): Promise<void> => {
  await redis.ltrim(key, count, -1)
}

export { rClear, redis, rLength, rLoad, rSave, rTrim }
