import type { ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3
} from "@aws-sdk/client-s3";
import {
  EVER_BUCKET_NAME,
  EVER_ENDPOINT,
  EVER_REGION
} from "@tape.xyz/constants";
import { clickhouseClient, tapeDb } from "@tape.xyz/server";

const { EVER_ACCESS_KEY, EVER_ACCESS_SECRET } = process.env;

const s3Client = new S3({
  endpoint: EVER_ENDPOINT,
  region: EVER_REGION,
  credentials: {
    accessKeyId: EVER_ACCESS_KEY,
    secretAccessKey: EVER_ACCESS_SECRET
  },
  maxAttempts: 5
});

const cleanup4Ever = async (): Promise<void> => {
  try {
    const daysToSubtract = 5;
    const dateDaysAgo = new Date(
      Date.now() - daysToSubtract * 24 * 60 * 60 * 1000
    );

    let continuationToken: string | undefined = undefined;
    let objectsToDelete: { Key: string }[] = [];

    do {
      const response: ListObjectsV2CommandOutput = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: EVER_BUCKET_NAME,
          ContinuationToken: continuationToken
        })
      );
      const { Contents, IsTruncated, NextContinuationToken } = response;

      if (Contents) {
        const oldObjects = Contents.filter(
          (object) =>
            object.LastModified && new Date(object.LastModified) < dateDaysAgo
        );
        objectsToDelete = objectsToDelete.concat(
          oldObjects
            .map((object) => ({ Key: object.Key! }))
            .filter((obj) => obj.Key)
        );
      }

      continuationToken = IsTruncated ? NextContinuationToken : undefined;
    } while (continuationToken);

    if (objectsToDelete.length === 0) {
      console.log(
        `[4ever cleanup] No objects older than ${daysToSubtract} days found.`
      );
      return;
    }

    const maxDeleteBatchSize = 1000;
    for (let i = 0; i < objectsToDelete.length; i += maxDeleteBatchSize) {
      const batch = objectsToDelete.slice(i, i + maxDeleteBatchSize);

      const deleteCommand = new DeleteObjectsCommand({
        Bucket: EVER_BUCKET_NAME,
        Delete: {
          Objects: batch
        }
      });

      await s3Client.send(deleteCommand);
      console.log(
        `[4ever cleanup] Deleted ${batch.length} objects older than ${daysToSubtract} days in batch ${i / maxDeleteBatchSize + 1}.`
      );
    }

    console.log(
      `[4ever cleanup] Total deleted ${objectsToDelete.length} objects older than ${daysToSubtract} days 🗑️`
    );
  } catch (error) {
    console.error("[4ever cleanup] Error deleting objects:", error);
  }
};

const vacuumPostgres = async (): Promise<void> => {
  try {
    await tapeDb.$queryRaw`VACUUM`;
    console.log("[cron] Postgres vacuum completed ♻️");
  } catch (error) {
    console.error("[cron] Error Postgres vacuum", error);
  }
};

const cleanupClickhouse = async (): Promise<void> => {
  const queries = [
    "OPTIMIZE TABLE events;",
    "TRUNCATE TABLE IF EXISTS system.processors_profile_log;",
    "TRUNCATE TABLE IF EXISTS system.asynchronous_metric_log;",
    "TRUNCATE TABLE IF EXISTS system.asynchronous_metric_log_0;",
    "TRUNCATE TABLE IF EXISTS system.query_log;",
    "TRUNCATE TABLE IF EXISTS system.query_log_0;",
    "TRUNCATE TABLE IF EXISTS system.metric_log;",
    "TRUNCATE TABLE IF EXISTS system.metric_log_0;",
    "TRUNCATE TABLE IF EXISTS system.metric_log_1;",
    "TRUNCATE TABLE IF EXISTS system.trace_log;",
    "TRUNCATE TABLE IF EXISTS system.trace_log_0;",
    "TRUNCATE TABLE IF EXISTS system.opentelemetry_span_log;",
    "TRUNCATE TABLE IF EXISTS system.part_log;",
    "TRUNCATE TABLE IF EXISTS system.part_log_0;",
    "TRUNCATE TABLE IF EXISTS system.blob_storage_log;",
    "TRUNCATE TABLE IF EXISTS system.query_views_log;",
    "ALTER TABLE events DELETE WHERE url NOT LIKE '%tape.xyz%';"
  ];

  try {
    await Promise.all(
      queries.map((query) => clickhouseClient.command({ query }))
    );
    console.log("[cron] Clickhouse cleanup completed ♻️");
  } catch (error) {
    console.error("[cron] Error Clickhouse cleanup", error);
  }
};

export { cleanup4Ever, vacuumPostgres, cleanupClickhouse };
