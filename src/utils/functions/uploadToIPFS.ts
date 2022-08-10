import logger from '@lib/logger'
import { IPFS_GATEWAY } from '@utils/constants'
import axios from 'axios'
import { IPFSUploadResult } from 'src/types/local'

const uploadImageToIPFS = async (file: File): Promise<IPFSUploadResult> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const uploaded = await axios('https://api.web3.storage/upload', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
        // Authorization: `Bearer <token>`
      }
    })
    const { hash }: { hash: string } = await uploaded.data

    return {
      ipfsUrl: `${IPFS_GATEWAY}/${hash}`,
      url: `${IPFS_GATEWAY}/${hash}`,
      type: file.type || 'image/jpeg',
      hash
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
