import type { Publication } from 'lens'

import { STATIC_ASSETS } from '../constants'
import sanitizeIpfsUrl from './sanitizeIpfsUrl'

const getThumbnailUrl = (video: Publication): string => {
  const url =
    video.metadata?.cover?.original.url ||
    video.metadata?.image ||
    `${STATIC_ASSETS}/images/fallbackThumbnail.png`

  return sanitizeIpfsUrl(url)
}

export default getThumbnailUrl
