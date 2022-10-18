import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import logger from '@lib/logger'
import { v4 as uuidv4 } from 'uuid'

const accessKeyId = process.env.NEXT_PUBLIC_EVER_API_KEY as string
const secretAccessKey = process.env.NEXT_PUBLIC_EVER_API_SECRET as string
const bucketName = process.env.NEXT_PUBLIC_EVER_BUCKET_NAME as string
const region = 'us-west-2'

const client = new S3({
  endpoint: 'https://endpoint.4everland.co',
  credentials: {
    accessKeyId,
    secretAccessKey
  },
  region
})

const uploadToIPFS3 = async (
  file: File,
  onProgress?: (percentage: number) => void
) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: `${uuidv4()}_${file.name}`,
      Body: file,
      ContentType: file.type
    }
    const task = new Upload({
      client,
      queueSize: 3, // 3 MiB
      params
    })
    task.on('httpUploadProgress', (e) => {
      const progress = ((e.loaded! / e.total!) * 100) | 0
      onProgress?.(progress)
    })
    await task.done()
    const result = await client.headObject(params)
    const metadata = result.Metadata
    return {
      url: `ipfs://${metadata?.['ipfs-hash']}`,
      type: file.type || 'image/jpeg'
    }
  } catch (error) {
    logger.error('[Error IPFS3 Media Upload]', error)
    return {
      url: '',
      type: file.type
    }
  }
}

export default uploadToIPFS3
