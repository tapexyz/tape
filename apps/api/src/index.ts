import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";

import { cors, ipRestriction } from "./middlewares";
import allowedTokens from "./routes/allowed-tokens";
import avatar from "./routes/avatar";
import curated from "./routes/curated";
import did from "./routes/did";
import gateway from "./routes/gateway";
import metadata from "./routes/metadata";
import oembed from "./routes/oembed";
import sts from "./routes/sts";
import tail from "./routes/tail";
import toggles from "./routes/toggles";
import tower from "./routes/tower";
import trails from "./routes/trails";
import verified from "./routes/verified";

const app = new Hono();

app.use(logger());
app.use(ipRestriction);
app.use("*", cors);

app.get("/", (c) => c.text("nothing to see here, visit tape.xyz"));

app.route("/did", did);
app.route("/sts", sts);
app.route("/tail", tail);
app.route("/tower", tower);
app.route("/oembed", oembed);
app.route("/trails", trails);
app.route("/avatar", avatar);
app.route("/gateway", gateway);
app.route("/curated", curated);
app.route("/toggles", toggles);
app.route("/metadata", metadata);
app.route("/verified", verified);
app.route("/allowed-tokens", allowedTokens);

serve(app, (info) => {
  console.log(`API listening on http://localhost:${info.port}`);
});
