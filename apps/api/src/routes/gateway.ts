import { zValidator } from "@hono/zod-validator";
import { IRYS_GATEWAY_URL } from "@tape.xyz/constants";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { object, string } from "zod";

const app = new Hono();

app.use("*", prettyJSON({ space: 4 }));
app.get(
  "/ar/:id",
  zValidator(
    "param",
    object({
      id: string()
    })
  ),
  async (c) => {
    const { id } = c.req.param();
    try {
      const result = await fetch(`${IRYS_GATEWAY_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Tape"
        }
      });
      const viewsRes = (await result.json()) as JSON;
      return c.json(JSON.parse(JSON.stringify(viewsRes)));
    } catch (error) {
      console.error("[GATEWAY] Error:", error);
      return c.redirect(`${IRYS_GATEWAY_URL}/${id}`);
    }
  }
);

export default app;
