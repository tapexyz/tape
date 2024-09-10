import type { ListObjectsV2CommandOutput } from '@aws-sdk/client-s3'
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3
} from '@aws-sdk/client-s3'
import {
  EVER_BUCKET_NAME,
  EVER_ENDPOINT,
  EVER_REGION
} from '@tape.xyz/constants'
import { psql } from '@tape.xyz/server'

const accessKeyId = process.env.EVER_ACCESS_KEY!
const secretAccessKey = process.env.EVER_ACCESS_SECRET!

const s3Client = new S3({
  endpoint: EVER_ENDPOINT,
  region: EVER_REGION,
  credentials: {
    accessKeyId,
    secretAccessKey
  },
  maxAttempts: 5
})

const cleanup4Ever = async (): Promise<void> => {
  try {
    const daysToSubtract = 15
    const dateDaysAgo = new Date(
      Date.now() - daysToSubtract * 24 * 60 * 60 * 1000
    )

    let continuationToken: string | undefined = undefined
    let objectsToDelete: { Key: string }[] = []

    do {
      const response: ListObjectsV2CommandOutput = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: EVER_BUCKET_NAME,
          ContinuationToken: continuationToken
        })
      )
      const { Contents, IsTruncated, NextContinuationToken } = response

      if (Contents) {
        const oldObjects = Contents.filter(
          (object) =>
            object.LastModified && new Date(object.LastModified) < dateDaysAgo
        )
        objectsToDelete = objectsToDelete.concat(
          oldObjects
            .map((object) => ({ Key: object.Key! }))
            .filter((obj) => obj.Key)
        )
      }

      continuationToken = IsTruncated ? NextContinuationToken : undefined
    } while (continuationToken)

    if (objectsToDelete.length === 0) {
      console.log(
        `[4ever cleanup] No objects older than ${daysToSubtract} days found.`
      )
      return
    }

    const maxDeleteBatchSize = 1000
    for (let i = 0; i < objectsToDelete.length; i += maxDeleteBatchSize) {
      const batch = objectsToDelete.slice(i, i + maxDeleteBatchSize)

      const deleteCommand = new DeleteObjectsCommand({
        Bucket: EVER_BUCKET_NAME,
        Delete: {
          Objects: batch
        }
      })

      await s3Client.send(deleteCommand)
      console.log(
        `[4ever cleanup] Deleted ${batch.length} objects older than ${daysToSubtract} days in batch ${i / maxDeleteBatchSize + 1}.`
      )
    }

    console.log(
      `[4ever cleanup] Total deleted ${objectsToDelete.length} objects older than ${daysToSubtract} days.`
    )
  } catch (error) {
    console.error('[4ever cleanup] Error deleting objects:', error)
  }
}

const vacuumPostgres = async (): Promise<void> => {
  try {
    await psql.$queryRaw`VACUUM`
    console.log('[cron] Postgres vacuum completed')
  } catch (error) {
    console.error('[cron] Error Postgres vacuum', error)
  }
}

export { cleanup4Ever, vacuumPostgres }