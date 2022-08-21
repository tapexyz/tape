import logger from '@lib/logger'
import axios from 'axios'
import { IPFSUploadResult } from 'src/types/local'
import { v4 as uuidv4 } from 'uuid'

const authKey = process.env.NEXT_PUBLIC_ESTUARY_AUTHORIZATION_KEY as string

const uploadMediaToIPFS = async (
  file: File,
  // eslint-disable-next-line no-unused-vars
  onProgress?: (percentage: number) => void
): Promise<IPFSUploadResult> => {
  try {
    const formData = new FormData()
    formData.append('data', file, uuidv4())
    const uploaded = await axios.post(
      `https://shuttle-5.estuary.tech/content/add`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authKey}`
        },
        onUploadProgress: function (progressEvent) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress?.(percentCompleted)
        }
      }
    })
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

export default uploadMediaToIPFS
