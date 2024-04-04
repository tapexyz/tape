import { MediaVideoMimeType } from '@lens-protocol/metadata'

export const getUploadedMediaType = (mimeType: string): MediaVideoMimeType => {
  switch (mimeType) {
    case 'video/mp4':
      return MediaVideoMimeType.MP4
    case 'video/mpeg':
      return MediaVideoMimeType.MPEG
    case 'video/webm':
      return MediaVideoMimeType.WEBM
    case 'video/quicktime':
      return MediaVideoMimeType.QUICKTIME
    case 'video/mov':
      return MediaVideoMimeType.MOV
    default:
      return MediaVideoMimeType.MP4
  }
}
