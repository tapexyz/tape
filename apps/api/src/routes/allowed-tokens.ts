import { CACHE_CONTROL, ERROR_MESSAGE, REDIS_KEYS } from "@tape.xyz/constants";
import { REDIS_EXPIRY, rGet, rSet, tapeDb } from "@tape.xyz/server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  try {
    c.header("Cache-Control", CACHE_CONTROL.FOR_FIVE_MINUTE);

    const cachedValue = await rGet(REDIS_KEYS.ALLOWED_TOKENS);
    if (cachedValue) {
      console.info("CACHE HIT");
      return c.json({ success: true, tokens: JSON.parse(cachedValue) });
    }
    console.info("CACHE MISS");

    const results = await tapeDb.allowedToken.findMany();
    const tokens = results.map((item: Record<string, unknown>) => ({
      address: item.address,
      decimals: item.decimals,
      name: item.name,
      symbol: item.symbol,
    }));

    await rSet(
      REDIS_KEYS.ALLOWED_TOKENS,
      JSON.stringify(tokens),
      REDIS_EXPIRY.ONE_DAY,
    );
    return c.json({ success: true, tokens });
  } catch (error) {
    console.error("[ALLOWED TOKENS] Error:", error);
    return c.json({ success: false, message: ERROR_MESSAGE });
  }
});

export default app;
