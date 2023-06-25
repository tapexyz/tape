import { FALLBACK_COVER_URL } from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'

import sanitizeDStorageUrl from './sanitizeDStorageUrl'

const getThumbnailUrl = (
  video: Publication,
  withFallback?: boolean
): string => {
  let url = video?.metadata?.cover?.original.url || video?.metadata?.image

  if (withFallback) {
    url = url || FALLBACK_COVER_URL
  }

  return sanitizeDStorageUrl(url)
}

export default getThumbnailUrl
