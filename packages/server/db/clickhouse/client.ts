import { createClient } from "@clickhouse/client";

const clickhouseClient = createClient({
  compression: { request: true, response: true },
  keep_alive: { enabled: true },
  username: "clickhouse",
  password: process.env.CLICKHOUSE_PASSWORD,
  url: process.env.CLICKHOUSE_URL
});

export { clickhouseClient };
