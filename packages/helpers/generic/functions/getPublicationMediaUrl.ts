import type {
  PublicationMetadata,
  PublicationMetadataMediaAudio,
  PublicationMetadataMediaVideo
} from '@tape.xyz/lens'

export const getPublicationRawMediaUrl = (
  metadata: PublicationMetadataMediaAudio | PublicationMetadataMediaVideo
) => {
  return metadata?.cover?.raw?.uri
}

export const getPublicationMediaUrl = (metadata: PublicationMetadata) => {
  let url = ''
  if (metadata.__typename === 'AudioMetadataV3' && metadata.asset.audio) {
    url = metadata.asset.audio.optimized?.uri ?? metadata.asset.audio.raw?.uri
  }
  if (metadata.__typename === 'VideoMetadataV3' && metadata.asset.video) {
    url = metadata.asset.video.optimized?.uri ?? metadata.asset.video.raw?.uri
  }
  if (metadata.__typename === 'LiveStreamMetadataV3' && metadata.playbackURL) {
    url = metadata.playbackURL
  }
  if (metadata.__typename === 'ImageMetadataV3' && metadata.asset.image) {
    url = metadata.asset.image.raw?.uri
  }
  return url
}

export const getPublicationMediaCid = (
  metadata: PublicationMetadata
): string => {
  let url = ''
  if (metadata.__typename === 'AudioMetadataV3' && metadata.asset.audio) {
    url = metadata.asset.audio.raw?.uri
  }
  if (metadata.__typename === 'VideoMetadataV3' && metadata.asset.video) {
    url = metadata.asset.video.raw?.uri
  }
  if (metadata.__typename === 'ImageMetadataV3' && metadata.asset.image) {
    url = metadata.asset.image.raw?.uri
  }
  const uri = url.replace('https://arweave.net/', 'ar://')
  return uri.replace('ipfs://', '').replace('ar://', '')
}

export const getIsIPFSUrl = (url: string) => {
  return url?.includes('ipfs')
}
