import type { PublicationMetadata } from '@tape.xyz/lens'

import { getAttachmentsData } from './getAttachmentsData'
import { getPublicationMediaUrl } from './getPublicationMediaUrl'
import { getThumbnailUrl } from './getThumbnailUrl'

export const getPublicationData = (
  metadata: PublicationMetadata
): {
  title?: string
  content?: string
  asset?: {
    uri: string
    cover?: string
    artist?: string
    title?: string
    duration?: number
  }
  attachments?: {
    uri: string
  }[]
} | null => {
  switch (metadata.__typename) {
    case 'ArticleMetadataV3':
      return {
        title: metadata.title,
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments)
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
        title: metadata.title,
        content: metadata.content,
        asset: {
          uri: getPublicationMediaUrl(metadata)
        },
        attachments: getAttachmentsData(metadata.attachments)
      }
    case 'AudioMetadataV3':
      return {
        title: metadata.title,
        content: metadata.content,
        asset: {
          uri: getPublicationMediaUrl(metadata),
          cover: getThumbnailUrl(metadata),
          artist: metadata.asset.artist,
          title: metadata.title,
          duration: metadata.asset.duration || 0
        }
      }
    case 'VideoMetadataV3':
      return {
        title: metadata.title,
        content: metadata.content,
        asset: {
          uri: getPublicationMediaUrl(metadata),
          duration: metadata.asset.duration || 0,
          cover: getThumbnailUrl(metadata)
        },
        attachments: getAttachmentsData(metadata.attachments)
      }
    case 'MintMetadataV3':
      return {
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments)
      }
    case 'EmbedMetadataV3':
      return {
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments)
      }
    case 'LiveStreamMetadataV3':
      return {
        title: metadata.title,
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments),
        asset: {
          uri: getPublicationMediaUrl(metadata),
          cover: getThumbnailUrl(metadata)
        }
      }
    default:
      return null
  }
}
