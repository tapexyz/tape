import { MediaSet } from 'src/types'

const getVideoMimeType = (media: MediaSet[]) => {
  return media[0]?.original?.mimeType
}

export default getVideoMimeType
