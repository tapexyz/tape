import { zValidator } from "@hono/zod-validator";
import { CACHE_CONTROL, ERROR_MESSAGE, REDIS_KEYS } from "@tape.xyz/constants";
import { clickhouseClient, rPush } from "@tape.xyz/server";
import { Hono } from "hono";
import { object, string, z } from "zod";

const app = new Hono();

const getValidationSchema = object({
  pid: string()
});

app.get("/", zValidator("query", getValidationSchema), async (c) => {
  try {
    const { pid } = c.req.query();

    const rows = await clickhouseClient.query({
      format: "JSONEachRow",
      query: `
        SELECT action_item_id, item_count
        FROM total_trails_by_action_item_id_mv
        WHERE action_item_id = '${pid}';
      `
    });

    const result = await rows.json<{
      item_count: number;
    }>();

    c.header("Cache-Control", CACHE_CONTROL.FOR_FIVE_MINUTE);
    return c.json({ success: true, count: result[0]?.item_count ?? 0 });
  } catch (error) {
    console.error("[GET TRAILS] Error:", error);
    return c.json({ success: false, message: ERROR_MESSAGE });
  }
});

const postValidationSchema = object({
  pid: string(),
  action: z.enum(["play_media", "view_profile"])
});
type PostRequestInput = z.infer<typeof postValidationSchema>;

app.post("/", zValidator("json", postValidationSchema), async (c) => {
  try {
    const { pid, action } = await c.req.json<PostRequestInput>();

    const payload = {
      action_item_id: pid,
      action,
      acted: new Date().toISOString().slice(0, 19).replace("T", " ")
    };

    await rPush(REDIS_KEYS.TRAILS, JSON.stringify(payload));
    return c.json({ success: true });
  } catch (error) {
    console.error("[TRAILS POST] Error:", error);
    return c.json({ success: false, message: ERROR_MESSAGE });
  }
});

export default app;
