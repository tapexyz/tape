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
    const currentDate = new Date()
    const dateDaysAgo = new Date(
      currentDate.setDate(currentDate.getDate() - daysToSubtract)
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
          (object) => new Date(object.LastModified!) < dateDaysAgo
        )
        objectsToDelete = objectsToDelete.concat(
          oldObjects.map((object) => ({ Key: object.Key! }))
        )
      }

      continuationToken = IsTruncated ? NextContinuationToken : undefined
    } while (continuationToken)

    if (objectsToDelete.length > 0) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: EVER_BUCKET_NAME,
        Delete: {
          Objects: objectsToDelete
        }
      })

      await s3Client.send(deleteCommand)
      console.log(
        `[4ever cleanup] Deleted ${objectsToDelete.length} objects older than 15 days.`
      )
      return
    }

    console.log('[4ever cleanup] No objects older than 15 days found.')
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
