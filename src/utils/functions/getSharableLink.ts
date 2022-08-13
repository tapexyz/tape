import {
  APP_NAME,
  LENSTER_WEBSITE_URL,
  LENSTUBE_TWITTER_HANDLE,
  LENSTUBE_URL
} from '@utils/constants'
import { LenstubePublication } from 'src/types/local'

const getVideoUrl = (video: LenstubePublication) => {
  return `${LENSTUBE_URL}/watch/${video.id}`
}

type Link = 'lenster' | 'twitter' | 'reddit' | 'linkedin'

export const getSharableLink = (link: Link, video: LenstubePublication) => {
  if (link === 'lenster') {
    return `${LENSTER_WEBSITE_URL}/?url=${getVideoUrl(video)}&text=${
      video.metadata?.name as string
    }&hashtags=Lenstube&preview=true`
  } else if (link === 'twitter') {
    return `https://twitter.com/intent/tweet?url=${getVideoUrl(video)}&text=${
      video.metadata?.name as string
    }&via=${LENSTUBE_TWITTER_HANDLE}&related=Lenstube&hashtags=Lenstube`
  } else if (link === 'reddit') {
    return `https://www.reddit.com/submit?url=${getVideoUrl(video)}&title=${
      video.metadata?.name as string
    }`
  } else if (link === 'linkedin') {
    return `https://www.linkedin.com/shareArticle/?url=${getVideoUrl(
      video
    )}&title=${video.metadata?.name as string}&summary=${
      video.metadata?.description as string
    }&source=${APP_NAME}`
  }
}
