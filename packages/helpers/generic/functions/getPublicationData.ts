import type { PublicationMetadata } from '@tape.xyz/lens'

import { getAttachmentsData } from './getAttachmentsData'
import { getPublicationMediaUrl } from './getPublicationMediaUrl'
import { getThumbnailUrl } from './getThumbnailUrl'

export const getPublicationData = (
  metadata: PublicationMetadata
): {
  asset?: {
    artist?: string
    cover?: string
    duration?: number
    title?: string
    uri: string
  }
  attachments?: {
    uri: string
  }[]
  content?: string
  title?: string
} | null => {
  switch (metadata.__typename) {
    case 'ArticleMetadataV3':
      return {
        attachments: getAttachmentsData(metadata.attachments),
        content: metadata.content,
        title: metadata.title
      }
    case 'TextOnlyMetadataV3':
      return {
        content: metadata.content
      }
    case 'LinkMetadataV3':
      return {
        content: metadata.sharingLink
      }
    case 'ImageMetadataV3':
      return {
        asset: {
          uri: getPublicationMediaUrl(metadata)
        },
        attachments: getAttachmentsData(metadata.attachments),
        content: metadata.content,
        title: metadata.title
      }
    case 'AudioMetadataV3':
      return {
        asset: {
          artist: metadata.asset.artist,
          cover: getThumbnailUrl(metadata),
          duration: metadata.asset.duration || 0,
          title: metadata.title,
          uri: getPublicationMediaUrl(metadata)
        },
        content: metadata.content,
        title: metadata.title
      }
    case 'VideoMetadataV3':
      return {
        asset: {
          cover: getThumbnailUrl(metadata),
          duration: metadata.asset.duration || 0,
          uri: getPublicationMediaUrl(metadata)
        },
        attachments: getAttachmentsData(metadata.attachments),
        content: metadata.content,
        title: metadata.title
      }
    case 'MintMetadataV3':
      return {
        attachments: getAttachmentsData(metadata.attachments),
        content: metadata.content
      }
    case 'EmbedMetadataV3':
      return {
        attachments: getAttachmentsData(metadata.attachments),
        content: metadata.content
      }
    case 'LiveStreamMetadataV3':
      return {
        asset: {
          cover: getThumbnailUrl(metadata),
          uri: getPublicationMediaUrl(metadata)
        },
        attachments: getAttachmentsData(metadata.attachments),
        content: metadata.content,
        title: metadata.title
      }
    default:
      return null
  }
}
