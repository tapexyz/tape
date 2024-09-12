import type { RedisClientType } from "redis";
import { createClient } from "redis";

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("[REDIS] Connection failed", error);
  }
};

const listenToRedis = () => {
  redisClient.on("connect", () => console.log("[REDIS] Connected to Redis"));
  redisClient.on("ready", () => console.log("[REDIS] Redis is ready"));
  redisClient.on("reconnecting", () =>
    console.log("[REDIS] Redis is reconnecting"),
  );
  redisClient.on("error", (error) =>
    console.error("[REDIS] Redis error", error),
  );
  redisClient.on("end", () => console.log("[REDIS] Redis connection ended"));
};

if (redisClient) {
  connectRedis();
  listenToRedis();
}

export enum REDIS_EXPIRY {
  FOREVER = 0,
  THREE_HOURS = 3 * 60 * 60, // 3 hours in seconds
  SIX_HOURS = 6 * 60 * 60, // 6 hours in seconds
  HALF_DAY = 12 * 60 * 60, // 12 hours in seconds
  ONE_DAY = 1 * 24 * 60 * 60, // 1 day in seconds
}

/**
 * Redis Key-Value Operations
 */

const rGet = async (key: string): Promise<string | null> => {
  return await redisClient.get(key);
};

const rSet = async (
  key: string,
  value: string,
  expiry: number,
): Promise<string | null> => {
  if (expiry === REDIS_EXPIRY.FOREVER) {
    return await redisClient.set(key, value);
  }
  return await redisClient.set(key, value, { EX: expiry });
};

/**
 * Redis List Operations
 */

// Load a range of values from a list
const rLoad = async (key: string, start = 0, end = -1): Promise<string[]> => {
  return await redisClient.lRange(key, start, end);
};

// Push a value to a list
const rPush = async (key: string, value: string): Promise<void> => {
  await redisClient.rPush(key, value);
};

// Get the length of a list
const rLength = async (key: string): Promise<number> => {
  return await redisClient.lLen(key);
};

/**
 * Trims the list stored at key so that it only contains elements between count and -1
 * eg - ["a", "b", "c", "d", "e", "f", "g"] -> ["d", "e", "f", "g"]
 */
const rTrim = async (key: string, count: number): Promise<void> => {
  await redisClient.lTrim(key, count, -1);
};

// Delete a key
const rClear = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

export { rClear, rGet, rLength, rLoad, rPush, rSet, rTrim };
