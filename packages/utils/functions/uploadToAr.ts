import axios from 'axios'
import type { PublicationMetadataV2Input } from 'lens'

import { BUNDLR_METADATA_UPLOAD_URL } from '../constants'
import type { ProfileMetadata } from '../custom-types'
import logger from '../logger'

const uploadToAr = async (
  data: PublicationMetadataV2Input | ProfileMetadata
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

export default uploadToAr
