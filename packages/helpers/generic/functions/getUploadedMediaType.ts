import { MediaAudioMimeType, MediaVideoMimeType } from '@lens-protocol/metadata'

export const getUploadedMediaType = (
  mimeType: string
): MediaVideoMimeType | MediaAudioMimeType => {
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
    case 'audio/mp3':
    case 'audio/mpeg':
      return MediaAudioMimeType.MP3
    case 'audio/mp4':
      return MediaAudioMimeType.MP4_AUDIO
    case 'audio/wav':
      return MediaAudioMimeType.WAV
    case 'audio/vnd.wave':
      return MediaAudioMimeType.WAV_VND
    case 'audio/webm':
      return MediaAudioMimeType.WEBM_AUDIO
    default:
      return MediaVideoMimeType.MP4
  }
}
