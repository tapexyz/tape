import { STATIC_ASSETS } from '@utils/constants'
import { LenstubePublication } from 'src/types/local'

import { sanitizeIpfsUrl } from './sanitizeIpfsUrl'

const getThumbnailUrl = (video: LenstubePublication): string => {
  const url =
    video.metadata?.cover?.original.url ||
    video.metadata?.image ||
    `${STATIC_ASSETS}/images/fallbackThumbnail.png`

  return sanitizeIpfsUrl(url)
}

export default getThumbnailUrl
