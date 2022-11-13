import type { LenstubePublication } from 'src/types/local'

export const isAlreadyAddedToWatchLater = (
  currentVideo: LenstubePublication,
  videos: LenstubePublication[]
) => {
  const alreadyExists = videos.find((el) => el.id === currentVideo.id)
  return !!alreadyExists
}
