import {
  LENSTER_WEBSITE_URL,
  LENSTUBE_APP_NAME,
  LENSTUBE_TWITTER_HANDLE,
  LENSTUBE_WEBSITE_URL
} from '../constants'
import type { LenstubePublication } from '../custom-types'

const getVideoUrl = (video: LenstubePublication) => {
  return `${LENSTUBE_WEBSITE_URL}/watch/${video.id}`
}

type Link = 'lenster' | 'twitter' | 'reddit' | 'linkedin'

export const getSharableLink = (link: Link, video: LenstubePublication) => {
  if (link === 'lenster') {
    return `${LENSTER_WEBSITE_URL}/?url=${getVideoUrl(video)}&text=${
      video.metadata?.name as string
    }&hashtags=Lenstube&preview=true`
  } else if (link === 'twitter') {
    return encodeURI(
      `https://twitter.com/intent/tweet?url=${getVideoUrl(video)}&text=${
        video.metadata?.name as string
      }&via=${LENSTUBE_TWITTER_HANDLE}&related=Lenstube&hashtags=Lenstube`
    )
  } else if (link === 'reddit') {
    return `https://www.reddit.com/submit?url=${getVideoUrl(video)}&title=${
      video.metadata?.name as string
    }`
  } else if (link === 'linkedin') {
    return `https://www.linkedin.com/shareArticle/?url=${getVideoUrl(
      video
    )}&title=${video.metadata?.name as string}&summary=${
      video.metadata?.description as string
    }&source=${LENSTUBE_APP_NAME}`
  }
  return ''
}
