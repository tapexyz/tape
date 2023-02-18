import type { Publication } from 'lens'

import { STATIC_ASSETS } from '../constants'
import sanitizeDStorageUrl from './sanitizeDStorageUrl'

export const getPublicationMediaUrl = (video: Publication) => {
  const url = video?.metadata?.media[0]?.original.url
  if (!url) {
    return `${STATIC_ASSETS}/images/fallbackThumbnail.png`
  }
  return sanitizeDStorageUrl(url)
}

export const getPublicationMediaRawUrl = (video: Publication) => {
  const url = video?.metadata?.media[0]?.original.url
  return url.replace('https://arweave.net/', 'ar://')
}

export const getIsIPFSUrl = (url: string) => {
  return url?.includes('ipfs')
}
