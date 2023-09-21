import { FALLBACK_COVER_URL } from '@lenstube/constants'
import type { MirrorablePublication } from '@lenstube/lens'

import { sanitizeDStorageUrl } from './sanitizeDStorageUrl'

export const getThumbnailUrl = (
  video: MirrorablePublication,
  withFallback?: boolean
): string => {
  let url = video?.metadata.marketplace?.image?.raw.uri

  if (withFallback) {
    url = url || FALLBACK_COVER_URL
  }

  return sanitizeDStorageUrl(url)
}
