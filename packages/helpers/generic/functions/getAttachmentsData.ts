import type { Maybe, PublicationMetadataMedia } from '@tape.xyz/lens'

export const getAttachmentsData = (
  attachments?: Maybe<PublicationMetadataMedia[]>
): any => {
  if (!attachments) {
    return []
  }

  return attachments.map((attachment) => {
    switch (attachment.__typename) {
      case 'PublicationMetadataMediaImage':
        return {
          type: 'Image',
          uri: attachment.image.optimized?.uri
        }
      case 'PublicationMetadataMediaVideo':
        return {
          type: 'Video',
          uri: attachment.video.optimized?.uri
        }
      case 'PublicationMetadataMediaAudio':
        return {
          type: 'Audio',
          uri: attachment.audio.optimized?.uri
        }
      default:
        return []
    }
  })
}
