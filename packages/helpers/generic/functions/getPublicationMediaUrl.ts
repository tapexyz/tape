import type {
  PublicationMetadata,
  PublicationMetadataMediaAudio,
  PublicationMetadataMediaVideo
} from '@lenstube/lens'

export const getPublicationRawMediaUrl = (
  metadata: PublicationMetadataMediaAudio | PublicationMetadataMediaVideo
) => {
  return metadata?.cover?.raw?.uri
}

export const getPublicationMediaUrl = (metadata: PublicationMetadata) => {
  let url
  if (
    metadata.__typename === 'AudioMetadataV3' &&
    metadata.attachments?.[0].__typename === 'PublicationMetadataMediaAudio'
  ) {
    url =
      metadata.attachments?.[0].audio.optimized?.uri ??
      metadata.attachments?.[0].audio.raw?.uri
  }
  if (
    metadata.__typename === 'AudioMetadataV3' &&
    metadata.attachments?.[0].__typename === 'PublicationMetadataMediaVideo'
  ) {
    url =
      metadata.attachments?.[0].video.optimized?.uri ??
      metadata.attachments?.[0].video.raw?.uri
  }
  return url
}

export const getPublicationMediaCid = (
  metadata: PublicationMetadata
): string => {
  let url
  if (
    metadata.__typename === 'AudioMetadataV3' &&
    metadata.attachments?.[0].__typename === 'PublicationMetadataMediaAudio'
  ) {
    url = metadata.attachments?.[0].audio.raw?.uri
  }
  if (
    metadata.__typename === 'VideoMetadataV3' &&
    metadata.attachments?.[0].__typename === 'PublicationMetadataMediaVideo'
  ) {
    url = metadata.attachments?.[0].video.raw?.uri
  }
  const uri = url.replace('https://arweave.net/', 'ar://')
  return uri.replace('ipfs://', '').replace('ar://', '')
}

export const getIsIPFSUrl = (url: string) => {
  return url?.includes('ipfs')
}
