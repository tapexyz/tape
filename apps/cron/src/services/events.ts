import { REDIS_KEYS } from "@tape.xyz/constants";
import { clickhouseClient, rLength, rLoad, rTrim } from "@tape.xyz/server";

const QUEUE_KEY = REDIS_KEYS.TOWER;
const BATCH_SIZE = 5000;

const flushEvents = async (): Promise<void> => {
  try {
    const length = await rLength(QUEUE_KEY);
    // Loop as batch of BATCH_SIZE events
    for (let i = 0; i < length; i += BATCH_SIZE) {
      const startTime = performance.now();

      // pick BATCH_SIZE events from the start of the queue (for eg 0 to 4999)
      const rawEvents = await rLoad(QUEUE_KEY, i, BATCH_SIZE - 1);
      const events: Record<string, string>[] = rawEvents.map((event) =>
        JSON.parse(event)
      );

      if (events.length > 0) {
        await clickhouseClient.insert({
          format: "JSONEachRow",
          table: "events",
          values: events
        });
        await rTrim(QUEUE_KEY, events.length);
      }

      const took = performance.now() - startTime;
      console.log(
        `[cron] tower events - batch inserted ${events.length} events to clickhouse in ${took}ms`
      );
    }
  } catch (error) {
    console.error("[cron] Error flushing tower events", error);
  }
};

export { flushEvents };
