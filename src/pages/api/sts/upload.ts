import { S3 } from '@aws-sdk/client-s3'
import logger from '@lib/logger'
import {
  API_ORIGINS,
  EVER_ACCESS_KEY,
  EVER_ACCESS_SECRET,
  EVER_BUCKET_NAME,
  EVER_ENDPOINT,
  EVER_REGION,
  IS_MAINNET,
  NEXT_PUBLIC_EVER_TEMP_BUCKET_NAME
} from '@utils/constants'
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'

type Data = {
  hash?: string
  type?: string
  success: boolean
}

const s3Client = new S3({
  endpoint: EVER_ENDPOINT,
  region: EVER_REGION,
  credentials: {
    accessKeyId: EVER_ACCESS_KEY,
    secretAccessKey: EVER_ACCESS_SECRET
  },
  maxAttempts: 3
})

const upload = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const origin = req.headers.origin
  if (IS_MAINNET && (!origin || !API_ORIGINS.includes(origin))) {
    return res.status(403).json({ success: false })
  }
  if (req.method !== 'POST') return res.status(400).json({ success: false })
  try {
    const tempFilename = req.body['filePath']

    const key = uuidv4()

    await s3Client.copyObject({
      Bucket: EVER_BUCKET_NAME,
      CopySource: encodeURI(
        `/${NEXT_PUBLIC_EVER_TEMP_BUCKET_NAME}/${tempFilename}`
      ),
      Key: key
    })

    const result = await s3Client.headObject({
      Bucket: EVER_BUCKET_NAME,
      Key: key
    })

    await s3Client.deleteObject({
      Bucket: NEXT_PUBLIC_EVER_TEMP_BUCKET_NAME,
      Key: tempFilename
    })

    const metadata = result.Metadata
    return res.json({
      hash: metadata?.['ipfs-hash'],
      type: result.ContentType,
      success: true
    })
  } catch (error) {
    logger.error('[API Error Upload STS]', error)
    return res.status(200).json({ success: false })
  }
}

export default upload
