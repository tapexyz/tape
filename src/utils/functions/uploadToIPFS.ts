import logger from '@lib/logger'
import axios from 'axios'
import { IPFSUploadResult } from 'src/types/local'

const infuraSecret = process.env.NEXT_PUBLIC_INFURA_AUTHORIZATION_KEY as string
const auth = Buffer.from(infuraSecret).toString('base64')

const uploadImageToIPFS = async (file: File): Promise<IPFSUploadResult> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const uploaded = await axios('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Basic ${auth}`
      }
    })
    const { Hash }: { Hash: string } = await uploaded.data

    return {
      url: `ipfs://${Hash}`,
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
