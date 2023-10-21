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
    type: 'IMAGE' | 'VIDEO' | 'AUDIO'
    uri: string
    cover?: string
    artist?: string
    title?: string
  }
  attachments?: {
    uri: string
    type: 'IMAGE' | 'VIDEO' | 'AUDIO'
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
    case 'LinkMetadataV3':
      return {
        content: metadata.content
      }
    case 'ImageMetadataV3':
      return {
        title: metadata.title,
        content: metadata.content,
        asset: {
          uri: getPublicationMediaUrl(metadata),
          type: 'IMAGE'
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
          type: 'AUDIO'
        }
      }
    case 'VideoMetadataV3':
      return {
        title: metadata.title,
        content: metadata.content,
        asset: {
          uri: getPublicationMediaUrl(metadata),
          cover: getThumbnailUrl(metadata),
          type: 'VIDEO'
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
        attachments: getAttachmentsData(metadata.attachments)
      }
    default:
      return null
  }
}
