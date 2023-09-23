import type {
  AudioMetadata,
  ProfileMetadata,
  VideoMetadata
} from '@lens-protocol/metadata'
import { BUNDLR_METADATA_UPLOAD_URL } from '@lenstube/constants'
import axios from 'axios'

import { logger } from '../logger'

export const uploadToAr = async (
  data: VideoMetadata | AudioMetadata | ProfileMetadata
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
