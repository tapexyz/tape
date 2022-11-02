import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import logger from '@lib/logger'
import {
  EVER_ENDPOINT,
  EVER_REGION,
  NEXT_PUBLIC_EVER_TEMP_BUCKET_NAME
} from '@utils/constants'
import axios from 'axios'
import { IPFSUploadResult } from 'src/types/local'
import { v4 as uuidv4 } from 'uuid'

export const everland = async (
  file: File,
  onProgress?: (percentage: number) => void
) => {
  try {
    const token = await axios.post('/api/sts/token', { fileSize: file.size })
    const client = new S3({
      endpoint: EVER_ENDPOINT,
      region: EVER_REGION,
      credentials: {
        accessKeyId: token.data?.accessKeyId,
        secretAccessKey: token.data?.secretAccessKey,
        sessionToken: token.data?.sessionToken
      },
      maxAttempts: 3
    })
    const filePath = token.data?.dir + uuidv4()
    const params = {
      Bucket: NEXT_PUBLIC_EVER_TEMP_BUCKET_NAME,
      Key: filePath,
      Body: file,
      ContentType: file.type
    }
    const task = new Upload({
      client,
      queueSize: 3,
      params
    })
    task.on('httpUploadProgress', (e) => {
      const progress = ((e.loaded! / e.total!) * 100) | 0
      onProgress?.(progress)
    })
    await task.done()
    const result = await axios.post('/api/sts/upload', { filePath })
    return {
      url: `ipfs://${result.data.hash}`,
      type: result?.data?.type ?? file.type
    }
  } catch (error) {
    logger.error('[Error IPFS3 Media Upload]', error)
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
  const { url, type } = await everland(file, onProgress)
  return { url, type }
}

export default uploadToIPFS
