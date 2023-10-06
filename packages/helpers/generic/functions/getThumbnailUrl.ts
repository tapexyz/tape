import { FALLBACK_COVER_URL } from '@tape.xyz/constants'
import type { MirrorablePublication } from '@tape.xyz/lens'

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
