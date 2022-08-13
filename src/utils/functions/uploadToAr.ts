import logger from '@lib/logger'
import axios from 'axios'
import toast from 'react-hot-toast'
import { MetadataObjectType } from 'src/types/local'

const uploadToAr = async (
  data: MetadataObjectType
): Promise<{ url: string | null }> => {
  try {
    const response = await axios.post('/api/metadata/upload', data)
    const { url } = response.data
    return { url }
  } catch (error) {
    logger.error('[Error AR Data Upload]', error)
    toast.error('Failed to upload metadata!')
    return { url: null }
  }
}

export default uploadToAr
