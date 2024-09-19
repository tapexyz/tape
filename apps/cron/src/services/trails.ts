import { REDIS_KEYS } from "@tape.xyz/constants";
import { clickhouseClient, rLength, rLoad, rTrim } from "@tape.xyz/server";

const QUEUE_KEY = REDIS_KEYS.TRAILS;
const BATCH_SIZE = 1000;

const flushTrails = async (): Promise<void> => {
  try {
    const length = await rLength(QUEUE_KEY);
    // Loop as batch of BATCH_SIZE events
    for (let i = 0; i < length; i += BATCH_SIZE) {
      const startTime = performance.now();

      // pick BATCH_SIZE events from the start of the queue (for eg 0 to 999)
      const rawEvents = await rLoad(QUEUE_KEY, i, BATCH_SIZE - 1);
      const trails: Record<string, string>[] = rawEvents.map((trail) =>
        JSON.parse(trail)
      );

      if (trails.length > 0) {
        await clickhouseClient.insert({
          format: "JSONEachRow",
          table: "trails",
          values: trails
        });
        await rTrim(QUEUE_KEY, trails.length);
      }

      const took = performance.now() - startTime;
      console.log(
        `[cron] trails - batch inserted ${trails.length} trails to clickhouse in ${took}ms`
      );
    }
  } catch (error) {
    console.error("[cron] Error flushing trails", error);
  }
};

export { flushTrails };
