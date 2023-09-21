import type {
  PublicationMetadataMediaAudio,
  PublicationMetadataMediaVideo
} from '@lenstube/lens'

export const getPublicationRawMediaUrl = (
  metadata: PublicationMetadataMediaAudio | PublicationMetadataMediaVideo
) => {
  return metadata?.cover?.raw?.uri
}

export const getPublicationMediaUrl = (
  metadata: PublicationMetadataMediaAudio | PublicationMetadataMediaVideo
) => {
  let url
  if (metadata.__typename === 'PublicationMetadataMediaAudio') {
    url = metadata.audio.optimized?.uri ?? metadata.audio.raw?.uri
  }
  if (metadata.__typename === 'PublicationMetadataMediaVideo') {
    url = metadata.video.optimized?.uri ?? metadata.video.raw?.uri
  }
  return url
}

export const getPublicationMediaCid = (
  metadata: PublicationMetadataMediaAudio | PublicationMetadataMediaVideo
): string => {
  let url
  if (metadata.__typename === 'PublicationMetadataMediaAudio') {
    url = metadata.audio.raw?.uri
  }
  if (metadata.__typename === 'PublicationMetadataMediaVideo') {
    url = metadata.video.raw?.uri
  }
  const uri = url.replace('https://arweave.net/', 'ar://')
  return uri.replace('ipfs://', '').replace('ar://', '')
}

export const getIsIPFSUrl = (url: string) => {
  return url?.includes('ipfs')
}
