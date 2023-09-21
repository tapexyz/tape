import { BUNDLR_METADATA_UPLOAD_URL } from '@lenstube/constants'
import type { PublicationMetadata } from '@lenstube/lens'
import type { ProfileMetadata } from '@lenstube/lens/custom-types'
import axios from 'axios'

import { logger } from '../logger'

export const uploadToAr = async (
  data: PublicationMetadata | ProfileMetadata
): Promise<string> => {
  try {
    const response = await axios.post(BUNDLR_METADATA_UPLOAD_URL, data)
    const { id } = response.data
    return `ar://${id}`
  } catch (error) {
    logger.error('[Error AR Metadata Upload]', error)
    throw new Error('[Error AR Metadata Upload]')
  }
}
