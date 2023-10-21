import { FALLBACK_COVER_URL } from '@tape.xyz/constants'
import type { PublicationMetadata } from '@tape.xyz/lens'

import { sanitizeDStorageUrl } from './sanitizeDStorageUrl'

const getCover = (metadata: PublicationMetadata) => {
  switch (metadata.__typename) {
    case 'VideoMetadataV3':
      return (
        metadata.asset.cover?.optimized?.uri || metadata.asset.cover?.raw?.uri
      )
    case 'LiveStreamMetadataV3':
      return metadata.playbackURL
    case 'AudioMetadataV3':
      return (
        metadata.asset.cover?.optimized?.uri || metadata.asset.cover?.raw?.uri
      )
    default:
      return ''
  }
}

export const getThumbnailUrl = (
  metadata: PublicationMetadata,
  withFallback?: boolean
): string => {
  let url = getCover(metadata)

  if (withFallback) {
    url = url || FALLBACK_COVER_URL
  }

  return sanitizeDStorageUrl(url)
}
