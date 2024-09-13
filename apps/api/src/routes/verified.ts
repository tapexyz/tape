import { CACHE_CONTROL, ERROR_MESSAGE, REDIS_KEYS } from "@tape.xyz/constants";
import { REDIS_EXPIRY, rGet, rSet, tapeDb } from "@tape.xyz/server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  try {
    c.header("Cache-Control", CACHE_CONTROL.FOR_FIVE_MINUTE);

    const cachedValue = await rGet(REDIS_KEYS.VERIFIED_PROFILES);
    if (cachedValue) {
      console.info("CACHE HIT");
      return c.json({ success: true, ids: JSON.parse(cachedValue) });
    }
    console.info("CACHE MISS");

    const results = await tapeDb.profile.findMany({
      where: {
        isVerified: true,
      },
      select: {
        profileId: true,
      },
    });

    const ids = results.map(({ profileId }) => profileId);

    await rSet(
      REDIS_KEYS.VERIFIED_PROFILES,
      JSON.stringify(ids),
      REDIS_EXPIRY.ONE_DAY,
    );
    return c.json({ success: true, ids });
  } catch (error) {
    console.error("[VERIFIED] Error:", error);
    return c.json({ success: false, message: ERROR_MESSAGE });
  }
});

export default app;
