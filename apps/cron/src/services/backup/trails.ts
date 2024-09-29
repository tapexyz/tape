import { REDIS_EXPIRY, clickhouseClient, rGet, rSet } from "@tape.xyz/server";

const { S3_BUCKET_URL, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = process.env;

const backupTrailsToS3 = async () => {
  try {
    const cacheKey = "backups:trails:offset";
    const batchSize = 100000;

    // Get the last offset from Redis (or start from 0 if no offset is stored)
    let offset = Number.parseInt((await rGet(cacheKey)) || "0", 10);

    // Calculate the range for the current batch
    const startRange = offset;
    const endRange = offset + batchSize;

    const fileName = `trails-${startRange}-${endRange}.csv`;

    // Check the number of rows in the current batch
    const rowsCountResult = await clickhouseClient.query({
      format: "JSONEachRow",
      query: `
        SELECT count(*) as count
        FROM (
            SELECT *
            FROM trails
            ORDER BY acted
            LIMIT ${batchSize} OFFSET ${offset}
        ) as subquery;
      `
    });

    const rowsCount = await rowsCountResult.json<{ count: string }>();
    const count = rowsCount[0] ? rowsCount[0].count : "0";
    const trailsCount = rowsCount.length > 0 ? Number.parseInt(count) : 0;

    if (trailsCount === batchSize) {
      // Proceed with the backup if there are rows to back up
      await clickhouseClient.query({
        format: "JSONEachRow",
        query: `
          INSERT INTO FUNCTION
          s3(
            '${S3_BUCKET_URL}/tape-clickhouse-backups/${fileName}',
            '${S3_ACCESS_KEY_ID}',
            '${S3_SECRET_ACCESS_KEY}',
            'CSV'
          )
          SETTINGS s3_truncate_on_insert=1
          SELECT * FROM trails
          ORDER BY acted
          LIMIT ${batchSize} OFFSET ${offset};
        `
      });

      // Increment the offset
      offset += batchSize;
      await rSet(cacheKey, offset.toString(), REDIS_EXPIRY.FOREVER);

      console.info(
        `[Cron] Trails backup completed successfully for ${fileName} with offset ${offset}`
      );
      return;
    }

    const trailsRequired = batchSize - trailsCount;

    console.info(
      `[Cron] Current batch contains ${trailsCount} trails at offset ${offset}. ${trailsRequired} more trails are required to complete the batch size of ${batchSize}.`
    );
  } catch (error) {
    console.error("[Cron] backupTrailsToS3 - Error processing trails", error);
  }
};

export { backupTrailsToS3 };
