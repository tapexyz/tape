import { FALLBACK_COVER_URL } from '@lenstube/constants'
import type { AnyPublication } from '@lenstube/lens'

import { sanitizeDStorageUrl } from './sanitizeDStorageUrl'

export const getThumbnailUrl = (
  video: AnyPublication,
  withFallback?: boolean
): string => {
  let url = video?.metadata?.cover?.original.url || video?.metadata?.image

  if (withFallback) {
    url = url || FALLBACK_COVER_URL
  }

  return sanitizeDStorageUrl(url)
}
