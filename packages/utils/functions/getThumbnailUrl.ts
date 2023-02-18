import type { Publication } from 'lens'

import { STATIC_ASSETS } from '../constants'
import sanitizeDStorageUrl from './sanitizeDStorageUrl'

const getThumbnailUrl = (video: Publication): string => {
  const url =
    video.metadata?.cover?.original.url ||
    video.metadata?.image ||
    `${STATIC_ASSETS}/images/fallbackThumbnail.png`

  return sanitizeDStorageUrl(url)
}

export default getThumbnailUrl
