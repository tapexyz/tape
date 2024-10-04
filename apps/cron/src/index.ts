import "dotenv/config";

import cron from "node-cron";

import { backupEventsToS3 } from "./services/backup/events";
import { backupTrailsToS3 } from "./services/backup/trails";
import {
  cleanup4Ever,
  cleanupClickhouse,
  vacuumPostgres
} from "./services/cleanup";
import { computePlatformStats } from "./services/stats";
import { flushEvents } from "./services/tower";
import { flushTrails } from "./services/trails";
import { wakeClickHouse } from "./services/wake";

// Schedule the flushEvents and flushTrails function to run every 4 hour
cron.schedule("0 */4 * * *", async () => {
  await wakeClickHouse();
  console.log(
    "[cron] Batch inserting tower events to clickhouse/events",
    new Date()
  );
  await flushEvents();
  console.log("[cron] Batch inserting trails to clickhouse/trails", new Date());
  await flushTrails();
});

// Schedule the functions to run every day at midnight
cron.schedule("0 0 * * *", async () => {
  await wakeClickHouse();
  console.log("[cron] Backing up Clickhouse to S3", new Date());
  await backupEventsToS3();
  await backupTrailsToS3();
  console.log("[cron] Cleaning up Clickhouse", new Date());
  await cleanupClickhouse();
  console.log("[cron] Cleaning up 4Ever", new Date());
  await cleanup4Ever();
  console.log("[cron] Computing platform stats", new Date());
  await computePlatformStats();
});

// Schedule the vacuumPostgres function to run every sunday at midnight
cron.schedule("0 0 * * 0", async () => {
  console.log("[cron] Vacuuming postgres", new Date());
  await vacuumPostgres();
});

// Schedule the curatePublications function to run every 5 hour
// cron.schedule("0 */5 * * *", async () => {
//   console.log("[cron] Curating publications", new Date());
//   await curatePublications("VIDEO");
// });
