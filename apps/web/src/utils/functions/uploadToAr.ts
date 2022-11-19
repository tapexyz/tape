import logger from '@lib/logger'
import axios from 'axios'
import type { PublicationMetadataV2Input } from 'lens'
import toast from 'react-hot-toast'
import type { ProfileMetadata } from 'src/types/local'

const uploadToAr = async (
  data: PublicationMetadataV2Input | ProfileMetadata
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
