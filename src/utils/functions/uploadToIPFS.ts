import logger from '@lib/logger'
import axios from 'axios'
import { IPFSUploadResult } from 'src/types/local'

const authKey = process.env.NEXT_PUBLIC_ESTUARY_AUTHORIZATION_KEY as string

const uploadImageToIPFS = async (file: File): Promise<IPFSUploadResult> => {
  try {
    const formData = new FormData()
    formData.append('data', file)
    const uploaded = await axios('https://shuttle-4.estuary.tech/content/add', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authKey}`
      }
    })
    const { cid }: { cid: string } = await uploaded.data

    return {
      url: `ipfs://${cid}`,
      type: file.type || 'image/jpeg'
    }
  } catch (error) {
    logger.error('[Error IPFS Image Upload]', error)
    return {
      url: '',
      type: file.type
    }
  }
}

export default uploadImageToIPFS
