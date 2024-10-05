import { CACHE_CONTROL, ERROR_MESSAGE, REDIS_KEYS } from "@tape.xyz/constants";
import { REDIS_EXPIRY, indexerDb, rGet, rSet } from "@tape.xyz/server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  try {
    c.header("Cache-Control", CACHE_CONTROL.FOR_ONE_HOUR);

    const cachedValue = await rGet(REDIS_KEYS.FIAT_RATES);
    if (cachedValue) {
      console.info("CACHE HIT");
      return c.json({ success: true, rates: JSON.parse(cachedValue) });
    }
    console.info("CACHE MISS");

    const rates: { currency: string; fiatsymbol: string; price: number }[] =
      await indexerDb.query(
        `
            SELECT currency, fiatsymbol, price from fiat.conversion
            WHERE fiatsymbol = 'usd';
        `
      );

    await rSet(
      REDIS_KEYS.FIAT_RATES,
      JSON.stringify(rates),
      REDIS_EXPIRY.ONE_DAY
    );
    return c.json({ success: true, rates });
  } catch (error) {
    console.error("[FIAT RATES] Error:", error);
    return c.json({ success: false, message: ERROR_MESSAGE });
  }
});

export default app;
