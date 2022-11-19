import type { MediaSet } from 'lens'

const getVideoMimeType = (media: MediaSet[]) => {
  return media[0]?.original?.mimeType
}

export default getVideoMimeType
