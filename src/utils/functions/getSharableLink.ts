import { LENSTUBE_TWITTER_HANDLE, LENSTUBE_URL } from '@utils/constants'
import { LenstubePublication } from 'src/types/local'

const getVideoUrl = (video: LenstubePublication) => {
  return `${LENSTUBE_URL}/watch/${video.id}`
}

export const getSharableLink = (link: string, video: LenstubePublication) => {
  if (link === 'twitter') {
    return `https://twitter.com/intent/tweet?url=${getVideoUrl(video)}&text=${
      video.metadata?.name as string
    }&via=${LENSTUBE_TWITTER_HANDLE}&related=Lenstube&hashtags=Lenstube`
  }
  if (link === 'reddit') {
    return `https://www.reddit.com/submit?url=${getVideoUrl(video)}&title=${
      video.metadata?.name as string
    }`
  }
  if (link === 'linkedin') {
    return `https://www.linkedin.com/shareArticle/?url=${getVideoUrl(
      video
    )}&title=${video.metadata?.name as string}&summary=${
      video.metadata?.description as string
    }&source=Lenstube`
  }
}
