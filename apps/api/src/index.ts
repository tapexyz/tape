import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";

import { cors, originLogger } from "./middlewares";
import allowedTokens from "./routes/allowed-tokens";
import avatar from "./routes/avatar";
import curated from "./routes/curated";
import did from "./routes/did";
import gateway from "./routes/gateway";
import metadata from "./routes/metadata";
import oembed from "./routes/oembed";
// import rates from "./routes/rates";
import stats from "./routes/stats";
import sts from "./routes/sts";
import tail from "./routes/tail";
import toggles from "./routes/toggles";
import tower from "./routes/tower";
import trails from "./routes/trails";
import verified from "./routes/verified";

const app = new Hono();

app.use(logger()).use(originLogger).use("*", cors);

app
  .get("/", (c) => c.text("nothing to see here, visit tape.xyz"))
  .route("/did", did)
  .route("/sts", sts)
  .route("/tail", tail)
  // .route("/rates", rates)
  .route("/tower", tower)
  .route("/stats", stats)
  .route("/oembed", oembed)
  .route("/trails", trails)
  .route("/avatar", avatar)
  .route("/gateway", gateway)
  .route("/curated", curated)
  .route("/toggles", toggles)
  .route("/metadata", metadata)
  .route("/verified", verified)
  .route("/allowed-tokens", allowedTokens);

serve(app, (info) => {
  console.info(`API listening on http://localhost:${info.port}`);
});
