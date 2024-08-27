import { clickhouseClient, REDIS_EXPIRY, rGet, rSet } from '@tape.xyz/server'

const { S3_BUCKET_URL } = process.env
const { S3_ACCESS_KEY_ID } = process.env
const { S3_SECRET_ACCESS_KEY } = process.env

const backupEventsToS3 = async () => {
  try {
    const cacheKey = 'backups:events:offset'
    const batchSize = 100000

    // Get the last offset from Redis (or start from 0 if no offset is stored)
    let offset = parseInt((await rGet(cacheKey)) || '0', 10)

    // Calculate the range for the current batch
    const startRange = offset
    const endRange = offset + batchSize

    const fileName = `events-${startRange}-${endRange}.csv`

    // Check the number of rows in the current batch
    const rowsCountResult = await clickhouseClient.query({
      format: 'JSONEachRow',
      query: `
        SELECT count(*) as count
        FROM (
            SELECT *
            FROM events
            ORDER BY created
            LIMIT ${batchSize} OFFSET ${offset}
        ) as subquery;
      `
    })

    const rowsCount = await rowsCountResult.json<{ count: string }>()
    const eventsCount = parseInt(rowsCount[0].count)

    if (eventsCount === batchSize) {
      // Proceed with the backup if there are rows to back up
      await clickhouseClient.query({
        format: 'JSONEachRow',
        query: `
          INSERT INTO FUNCTION
          s3(
            '${S3_BUCKET_URL}/tape-clickhouse-backups/${fileName}',
            '${S3_ACCESS_KEY_ID}',
            '${S3_SECRET_ACCESS_KEY}',
            'CSV'
          )
          SETTINGS s3_truncate_on_insert=1
          SELECT * FROM events
          ORDER BY created
          LIMIT ${batchSize} OFFSET ${offset};
        `
      })

      // Increment the offset
      offset += batchSize
      await rSet(cacheKey, offset.toString(), REDIS_EXPIRY.FOREVER)

      console.info(
        `[Cron] Backup completed successfully for ${fileName} with offset ${offset}`
      )
      return
    }

    const eventsRequired = batchSize - eventsCount

    console.info(
      `[Cron] Current batch contains ${eventsCount} events at offset ${offset}. ${eventsRequired} more events are required to complete the batch size of ${batchSize}.`
    )
  } catch (error) {
    console.error('[Cron] backupEventsToS3 - Error processing events', error)
  }
}

export { backupEventsToS3 }
