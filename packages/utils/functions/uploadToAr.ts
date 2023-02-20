import axios from 'axios'
import type { PublicationMetadataV2Input } from 'lens'
import toast from 'react-hot-toast'

import { BUNDLR_METADATA_UPLOAD_URL } from '../constants'
import type { ProfileMetadata } from '../custom-types'
import logger from '../logger'

const uploadToAr = async (
  data: PublicationMetadataV2Input | ProfileMetadata
): Promise<{ url: string | null }> => {
  try {
    const response = await axios.post(BUNDLR_METADATA_UPLOAD_URL, data)
    const { id } = response.data
    return { url: `ar://${id}` }
  } catch (error) {
    logger.error('[Error AR Data Upload]', error)
    toast.error('Failed to upload metadata!')
    return { url: null }
  }
}

export default uploadToAr
