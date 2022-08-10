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
      ipfsUrl: `https://${cid}.ipfs.dweb.link`,
      url: `https://${cid}.ipfs.dweb.link`,
      type: file.type || 'image/jpeg',
      hash: ''
    }
  } catch (error) {
    logger.error('[Error IPFS Image Upload]', error)
    return {
      ipfsUrl: '',
      url: '',
      hash: '',
      type: file.type
    }
  }
}

export { uploadImageToIPFS }
