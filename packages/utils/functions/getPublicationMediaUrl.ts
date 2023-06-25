import type { Publication } from '@lenstube/lens'

import { FALLBACK_COVER_URL } from '../constants'
import sanitizeDStorageUrl from './sanitizeDStorageUrl'

export const getPublicationMediaUrl = (video: Publication) => {
  const url = video?.metadata?.media[0]?.original.url
  if (!url) {
    return FALLBACK_COVER_URL
  }
  return sanitizeDStorageUrl(url)
}

export const getPublicationRawMediaUrl = (video: Publication) => {
  return video?.metadata?.media[0]?.onChain.url
}

export const getPublicationHlsUrl = (video: Publication) => {
  const url = video?.metadata?.media[0]?.optimized?.url
  if (!url) {
    return getPublicationMediaUrl(video)
  }
  return url
}

export const getPublicationMediaCid = (video: Publication): string => {
  const url = video?.metadata?.media[0]?.onChain.url
  const uri = url.replace('https://arweave.net/', 'ar://')
  return uri.replace('ipfs://', '').replace('ar://', '')
}

export const getIsIPFSUrl = (url: string) => {
  return url?.includes('ipfs')
}
