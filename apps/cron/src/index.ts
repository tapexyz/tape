import "dotenv/config";

import cron from "node-cron";

import { backupEventsToS3 } from "./services/backup/events";
import { cleanup4Ever, vacuumPostgres } from "./services/cleanup";
import { curatePublications } from "./services/curate";
import { flushEvents } from "./services/events";
import { wakeClickHouse } from "./services/wake";

// Schedule the flushEvents function to run every 4 hour
cron.schedule("0 */4 * * *", async () => {
  console.log("[cron] Flushing tower events", new Date());
  await wakeClickHouse();
  await flushEvents();
});

// Schedule the backupEventsToS3 function to run every midnight
cron.schedule("0 0 * * *", async () => {
  console.log("[cron] Backing up events to S3", new Date());
  await wakeClickHouse();
  await backupEventsToS3();
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

// Schedule the curatePublications function to run every 4 hour
cron.schedule("0 */4 * * *", async () => {
  console.log("[cron] Curating publications", new Date());
  await curatePublications();
});
