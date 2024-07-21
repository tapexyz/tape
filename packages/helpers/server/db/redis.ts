import type { RedisClientType } from 'redis'
import { createClient } from 'redis'

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL!
})

const rSave = async (key: string, value: string): Promise<void> => {
  await redisClient.rPush(key, value)
}
const rLoad = async (
  key: string,
  start: number = 0,
  end: number = -1
): Promise<string[]> => {
  return await redisClient.lRange(key, start, end)
}

const rClear = async (key: string): Promise<void> => {
  await redisClient.del(key)
}

const rLength = async (key: string): Promise<number> => {
  return redisClient.lLen(key)
}

const rTrim = async (key: string, count: number): Promise<void> => {
  await redisClient.lTrim(key, count, -1)
}

export { rClear, redisClient, rLength, rLoad, rSave, rTrim }
