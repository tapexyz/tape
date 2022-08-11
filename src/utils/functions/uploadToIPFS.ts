import logger from '@lib/logger'
import axios from 'axios'
import { IPFSUploadResult } from 'src/types/local'

const WEB3_STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN

const uploadImageToIPFS = async (file: File): Promise<IPFSUploadResult> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const uploaded = await axios('https://api.web3.storage/upload', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${WEB3_STORAGE_TOKEN}`
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
