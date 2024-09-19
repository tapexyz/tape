import "dotenv/config";

import cron from "node-cron";

import { backupEventsToS3 } from "./services/backup/events";
import {
  cleanup4Ever,
  cleanupClickhouse,
  vacuumPostgres
} from "./services/cleanup";
import { flushEvents } from "./services/tower";
import { flushTrails } from "./services/trails";
import { wakeClickHouse } from "./services/wake";

// Schedule the flushEvents and flushTrails function to run every 4 hour
cron.schedule("0 */4 * * *", async () => {
  console.log("[cron] Flushing tower events and trails", new Date());
  await wakeClickHouse();
  await flushEvents();
  await flushTrails();
});

// Schedule the backupEventsToS3 function to run every midnight
cron.schedule("0 0 * * *", async () => {
  console.log("[cron] Backing up events to S3", new Date());
  await wakeClickHouse();
  await backupEventsToS3();
});

// Schedule the cleanupClickhouse function to run every day
cron.schedule("0 0 * * *", async () => {
  console.log("[cron] Cleaning up Clickhouse", new Date());
  await wakeClickHouse();
  await cleanupClickhouse();
});

// Schedule the vacuumPostgres function to run every sunday at midnight
cron.schedule("0 0 * * 0", async () => {
  console.log("[cron] Vacuuming postgres", new Date());
  await vacuumPostgres();
});

// Schedule the cleanup4Ever function to run every day
cron.schedule("0 0 * * *", async () => {
  console.log("[cron] Cleaning up 4ever", new Date());
  await cleanup4Ever();
});

// Schedule the curatePublications function to run every 5 hour
// cron.schedule("0 */5 * * *", async () => {
//   console.log("[cron] Curating publications", new Date());
//   await curatePublications("VIDEO");
// });
