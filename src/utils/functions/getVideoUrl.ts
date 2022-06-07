import { LenstubePublication } from 'src/types/local'

export const getVideoUrl = (video: LenstubePublication) => {
  return (
    video?.metadata?.media[1]?.original.url ||
    video?.metadata?.media[0]?.original.url
  )
}
