import { CACHE_CONTROL, ERROR_MESSAGE, REDIS_KEYS } from "@tape.xyz/constants";
import { REDIS_EXPIRY, rGet, rSet, tapeDb } from "@tape.xyz/server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  try {
    c.header("Cache-Control", CACHE_CONTROL.FOR_FIFTEEN_MINUTE);

    const cachedValue = await rGet(REDIS_KEYS.PLATFORM_STATS);
    if (cachedValue) {
      console.info("CACHE HIT");
      return c.json({ success: true, stats: JSON.parse(cachedValue) });
    }
    console.info("CACHE MISS");

    const result = await tapeDb.platformStats.findFirst();

    const convertedEarnings: { [key: string]: string } = {};
    if (result?.creatorEarnings) {
      for (const [currency, amount] of Object.entries(result.creatorEarnings)) {
        convertedEarnings[currency] = BigInt(amount).toString();
      }
    }

    const stats = {
      profiles: result?.profiles,
      acts: result?.acts,
      posts: result?.posts,
      mirrors: result?.mirrors,
      comments: result?.comments,
      creatorEarnings: convertedEarnings
    };

    await rSet(
      REDIS_KEYS.PLATFORM_STATS,
      JSON.stringify(stats),
      REDIS_EXPIRY.ONE_DAY
    );
    return c.json({ success: true, stats });
  } catch (error) {
    console.error("[STATS] Error:", error);
    return c.json({ success: false, message: ERROR_MESSAGE });
  }
});

export default app;
