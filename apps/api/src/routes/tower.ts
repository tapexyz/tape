import { zValidator } from "@hono/zod-validator";
import { ERROR_MESSAGE, REDIS_KEYS } from "@tape.xyz/constants";
import { ALL_EVENTS } from "@tape.xyz/generic/events";
import { rPush } from "@tape.xyz/server";
import type { HonoRequest } from "hono";
import { Hono } from "hono";
import { UAParser } from "ua-parser-js";
import type { z } from "zod";
import { any, array, object, string } from "zod";

import { checkEventExistence } from "@/helpers/tower/checkEventExistence";

const app = new Hono();

const objectSchema = object({
  name: string().min(1, { message: "Name is required" }),
  actor: string().nullable().optional(),
  url: string(),
  referrer: string().nullable().optional(),
  platform: string(),
  fingerprint: string().nullable().optional(),
  created: string(),
  properties: any()
});

type RequestInput = z.infer<typeof objectSchema>;

const processEvent = async (req: HonoRequest, event: RequestInput) => {
  const {
    name,
    actor,
    url,
    referrer,
    platform,
    properties,
    fingerprint,
    created
  } = event;

  if (!checkEventExistence(ALL_EVENTS, name)) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid event" })
    );
  }

  const ip = req.header("cf-connecting-ip");
  const user_agent = req.header("user-agent");

  const parser = new UAParser(user_agent || "");
  const ua = parser.getResult();
  let ipData: {
    city: string;
    country: string;
    regionName: string;
  } | null = null;

  const { IP_API_KEY } = process.env;
  try {
    const ipResponse = await fetch(
      `https://pro.ip-api.com/json/${ip}?key=${IP_API_KEY}`
    );
    ipData = (await ipResponse.json()) as {
      city: string;
      country: string;
      regionName: string;
    };
  } catch {}

  // Extract UTM parameters
  const parsedUrl = new URL(url);
  const utmSource = parsedUrl.searchParams.get("utm_source") || null;
  const utmMedium = parsedUrl.searchParams.get("utm_medium") || null;
  const utmCampaign = parsedUrl.searchParams.get("utm_campaign") || null;
  const utmTerm = parsedUrl.searchParams.get("utm_term") || null;
  const utmContent = parsedUrl.searchParams.get("utm_content") || null;

  const value = {
    name,
    actor: actor || null,
    properties: properties || null,
    url: url || null,
    city: ipData?.city || null,
    country: ipData?.country || null,
    region: ipData?.regionName || null,
    referrer: referrer || null,
    platform: platform || null,
    browser: ua.browser.name || null,
    browser_version: ua.browser.version || null,
    os: ua.os.name || null,
    utm_source: utmSource || null,
    utm_medium: utmMedium || null,
    utm_campaign: utmCampaign || null,
    utm_term: utmTerm || null,
    utm_content: utmContent || null,
    fingerprint: fingerprint || null,
    created
  };

  await rPush(REDIS_KEYS.TOWER_EVENTS, JSON.stringify(value));
};

app.post("/", zValidator("json", objectSchema), async (c) => {
  try {
    const event = await c.req.json<RequestInput>();

    await processEvent(c.req, event);

    return c.json({ success: true });
  } catch (error) {
    console.error("[TOWER] Error:", error);
    return c.json({ success: false, message: ERROR_MESSAGE });
  }
});

const batchValidationSchema = object({
  events: array(objectSchema)
});
type BatchRequestInput = z.infer<typeof batchValidationSchema>;

app.post("/batch", zValidator("json", batchValidationSchema), async (c) => {
  try {
    const reqBody = await c.req.json<BatchRequestInput>();

    const parsed = batchValidationSchema.safeParse(reqBody);
    if (!parsed.success) {
      return c.json({ success: false, error: "Invalid request event" });
    }

    const { events } = reqBody;

    for (const event of events) {
      await processEvent(c.req, event);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("[BATCH TOWER] Error:", error);
    return c.json({ success: false, message: ERROR_MESSAGE });
  }
});

export default app;
