import { WORKER_BUNDLR_METADATA_UPLOAD_URL } from '@tape.xyz/constants'
import type { PublicationMetadataV2Input } from '@tape.xyz/lens'
import type { ProfileMetadata } from '@tape.xyz/lens/custom-types'
import axios from 'axios'

import { logger } from '../logger'

export const uploadToAr = async (
  data: PublicationMetadataV2Input | ProfileMetadata
): Promise<string> => {
  try {
    const response = await axios.post(WORKER_BUNDLR_METADATA_UPLOAD_URL, data)
    const { id } = response.data
    return `ar://${id}`
  } catch (error) {
    logger.error('[Error AR Metadata Upload]', error)
    throw new Error('[Error AR Metadata Upload]')
  }
}
