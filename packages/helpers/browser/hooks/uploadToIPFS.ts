import type { IPFSUploadResult } from '@tape.xyz/lens/custom-types'

import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import {
  EVER_ENDPOINT,
  EVER_REGION,
  WORKER_STS_TOKEN_URL
} from '@tape.xyz/constants'
import { logger } from '@tape.xyz/generic/logger'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const everland = async (
  file: File,
  onProgress?: (percentage: number) => void
) => {
  try {
    const token = await axios.get(WORKER_STS_TOKEN_URL)
    const client = new S3({
      credentials: {
        accessKeyId: token.data?.accessKeyId,
        secretAccessKey: token.data?.secretAccessKey,
        sessionToken: token.data?.sessionToken
      },
      endpoint: EVER_ENDPOINT,
      maxAttempts: 10,
      region: EVER_REGION
    })
    client.middlewareStack.addRelativeTo(
      (next: Function) => async (args: any) => {
        const { response } = await next(args)
        if (response.body == null) {
          response.body = new Uint8Array()
        }
        return {
          response
        }
      },
      {
        name: 'nullFetchResponseBodyMiddleware',
        override: true,
        relation: 'after',
        toMiddleware: 'deserializerMiddleware'
      }
    )
    const fileKey = uuidv4()
    const params = {
      Body: file,
      Bucket: 'tape',
      ContentType: file.type,
      Key: fileKey
    }
    const task = new Upload({
      client,
      params
    })
    task.on('httpUploadProgress', (e) => {
      const loaded = e.loaded ?? 0
      const total = e.total ?? 0
      const progress = (loaded / total) * 100
      onProgress?.(Math.round(progress))
    })
    await task.done()
    const result = await client.headObject(params)
    const metadata = result.Metadata
    return {
      type: file.type,
      url: `ipfs://${metadata?.['ipfs-hash']}`
    }
  } catch (error) {
    logger.error('[Error IPFS3 Media Upload]', error)
    return {
      type: file.type,
      url: ''
    }
  }
}

export const uploadToIPFS = async (
  file: File,
  onProgress?: (percentage: number) => void
): Promise<IPFSUploadResult> => {
  const { type, url } = await everland(file, onProgress)
  return { type, url }
}
