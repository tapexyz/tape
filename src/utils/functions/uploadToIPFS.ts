import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import logger from '@lib/logger'
import { IS_MAINNET } from '@utils/constants'
import axios from 'axios'
import { IPFSUploadResult } from 'src/types/local'
import { v4 as uuidv4 } from 'uuid'

const estuaryAuthKey = process.env
  .NEXT_PUBLIC_ESTUARY_AUTHORIZATION_KEY as string

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

export const everland = async (
  file: File,
  onProgress?: (percentage: number) => void
) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: uuidv4(),
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

export const estuary = async (
  file: File,
  onProgress?: (percentage: number) => void
) => {
  try {
    const formData = new FormData()
    formData.append('data', file, uuidv4())
    const uploaded = await axios.post(
      `https://shuttle-5.estuary.tech/content/add`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${estuaryAuthKey}`
        },
        onUploadProgress: function (progressEvent) {
          const total = progressEvent.total ?? 0
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / total
          )
          onProgress?.(percentCompleted)
        }
      }
    )
    const { cid }: { cid: string } = await uploaded.data

    return {
      url: `ipfs://${cid}`,
      type: file.type || 'image/jpeg'
    }
  } catch (error) {
    logger.error('[Error IPFS Media Upload]', error)
    return {
      url: '',
      type: file.type
    }
  }
}

const uploadToIPFS = async (
  file: File,
  onProgress?: (percentage: number) => void
): Promise<IPFSUploadResult> => {
  const { url, type } = IS_MAINNET
    ? await everland(file, onProgress)
    : await estuary(file, onProgress)
  return { url, type }
}

export default uploadToIPFS
