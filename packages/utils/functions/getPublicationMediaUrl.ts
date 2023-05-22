import type { Publication } from 'lens'

import { FALLBACK_COVER_URL } from '../constants'
import sanitizeDStorageUrl from './sanitizeDStorageUrl'

export const getPublicationMediaUrl = (video: Publication) => {
  const url = video?.metadata?.media[0]?.original.url
  if (!url) {
    return FALLBACK_COVER_URL
  }
  return sanitizeDStorageUrl(url)
}

export const getPublicationMediaRawUrl = (video: Publication): string => {
  const url = video?.metadata?.media[0]?.original.url
  return url.replace('https://arweave.net/', 'ar://')
}

export const getPublicationMediaCid = (video: Publication): string => {
  const uri = getPublicationMediaRawUrl(video)
  return uri.replace('ipfs://', '').replace('ar://', '')
}

export const getIsIPFSUrl = (url: string) => {
  return url?.includes('ipfs')
}
