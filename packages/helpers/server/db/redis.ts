import type { RedisClientType } from 'redis'
import { createClient } from 'redis'

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL!
})

const connectRedis = async () => {
  try {
    await redisClient.connect()
  } catch (error) {
    console.error('[REDIS] Connection failed', error)
  }
}

const listenToRedis = () => {
  redisClient.on('connect', () => console.log('[REDIS] Connected to Redis'))
  redisClient.on('ready', () => console.log('[REDIS] Redis is ready'))
  redisClient.on('reconnecting', () =>
    console.log('[REDIS] Redis is reconnecting')
  )
  redisClient.on('error', (error) =>
    console.error('[REDIS] Redis error', error)
  )
  redisClient.on('end', () => console.log('[REDIS] Redis connection ended'))
}

if (redisClient) {
  connectRedis()
  listenToRedis()
}

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
  return await redisClient.lLen(key)
}

const rTrim = async (key: string, count: number): Promise<void> => {
  await redisClient.lTrim(key, count, -1)
}

export { rClear, rLength, rLoad, rSave, rTrim }
