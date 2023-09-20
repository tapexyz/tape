import {
  LENSTER_WEBSITE_URL,
  LENSTUBE_APP_NAME,
  LENSTUBE_WEBSITE_URL,
  LENSTUBE_X_HANDLE
} from '@lenstube/constants'
import type { MirrorablePublication } from '@lenstube/lens'

const getViewUrl = (video: MirrorablePublication) => {
  return `${LENSTUBE_WEBSITE_URL}/watch/${video.id}`
}

type Link = 'lenstube' | 'lenster' | 'x' | 'reddit' | 'linkedin'

export const getSharableLink = (link: Link, video: MirrorablePublication) => {
  const { handle } = video.by
  const { metadata } = video

  if (link === 'lenstube') {
    return `${LENSTUBE_WEBSITE_URL}/watch/${video.id}`
  } else if (link === 'lenster') {
    return `${LENSTER_WEBSITE_URL}/?url=${getViewUrl(video)}&text=${
      (metadata.marketplace?.name as string) ?? ''
    } by @${handle}&hashtags=Lenstube&preview=true`
  } else if (link === 'x') {
    return encodeURI(
      `https://x.com/intent/tweet?url=${getViewUrl(video)}&text=${
        (metadata.marketplace?.name as string) ?? ''
      } by @${handle}&via=${LENSTUBE_X_HANDLE}&related=Lenstube&hashtags=Lenstube`
    )
  } else if (link === 'reddit') {
    return `https://www.reddit.com/submit?url=${getViewUrl(video)}&title=${
      (metadata.marketplace?.name as string) ?? ''
    } by @${handle}`
  } else if (link === 'linkedin') {
    return `https://www.linkedin.com/shareArticle/?url=${getViewUrl(
      video
    )} by @${handle}&title=${
      (metadata.marketplace?.name as string) ?? ''
    }&summary=${
      metadata?.marketplace?.description as string
    }&source=${LENSTUBE_APP_NAME}`
  }
  return ''
}
