import { zValidator } from "@hono/zod-validator";
import { CACHE_CONTROL, ERROR_MESSAGE } from "@tape.xyz/constants";
import { clickhouseClient } from "@tape.xyz/server";
import { Hono } from "hono";
import { object, string } from "zod";

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
      count: number;
    }>();

    c.header("Cache-Control", CACHE_CONTROL.FOR_FIVE_MINUTE);
    return c.json({ success: true, count: result[0]?.count ?? 0 });
  } catch (error) {
    console.error("[GET TRAILS] Error:", error);
    return c.json({ success: false, message: ERROR_MESSAGE });
  }
});

// const validationSchema = object({
//   pid: string(),
//   action: z.enum(["media_play", "profile_view"])
// });
// type RequestInput = z.infer<typeof validationSchema>;

// app.post("/", zValidator("json", validationSchema), async (c) => {
//   try {
//     const { pid, action } = await c.req.json<RequestInput>();

//     const payload = {
//       action_item_id: pid,
//       action
//     };

//     await clickhouseClient.insert({
//       format: "JSONEachRow",
//       table: "trails",
//       values: [payload]
//     });

//     return c.json({ success: true });
//   } catch (error) {
//     console.error("[TRAILS POST] Error:", error);
//     return c.json({ success: false, message: ERROR_MESSAGE });
//   }
// });

export default app;
