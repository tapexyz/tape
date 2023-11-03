import {
  HEY_WEBSITE_URL,
  TAPE_APP_NAME,
  TAPE_WEBSITE_URL,
  TAPE_X_HANDLE
} from '@tape.xyz/constants'
import type { AnyPublication, MirrorablePublication } from '@tape.xyz/lens'

import { getPublicationData } from './getPublicationData'

const getViewUrl = (video: AnyPublication) => {
  return `${TAPE_WEBSITE_URL}/watch/${video.id}`
}

type Link = 'tape' | 'hey' | 'x' | 'reddit' | 'linkedin'

export const getSharableLink = (link: Link, video: MirrorablePublication) => {
  const { handle } = video.by
  const { metadata } = video

  if (link === 'tape') {
    return `${TAPE_WEBSITE_URL}/watch/${video.id}`
  } else if (link === 'hey') {
    return `${HEY_WEBSITE_URL}/?url=${getViewUrl(video)}&text=${
      (getPublicationData(metadata)?.title as string) ?? ''
    } by @${handle}&hashtags=${TAPE_APP_NAME}&preview=true`
  } else if (link === 'x') {
    return encodeURI(
      `https://x.com/intent/tweet?url=${getViewUrl(video)}&text=${
        (getPublicationData(metadata)?.title as string) ?? ''
      } by @${handle}&via=${TAPE_X_HANDLE}&related=${TAPE_APP_NAME}&hashtags=${TAPE_APP_NAME}`
    )
  } else if (link === 'reddit') {
    return `https://www.reddit.com/submit?url=${getViewUrl(video)}&title=${
      (getPublicationData(metadata)?.title as string) ?? ''
    } by @${handle}`
  } else if (link === 'linkedin') {
    return `https://www.linkedin.com/shareArticle/?url=${getViewUrl(
      video
    )} by @${handle}&title=${
      (getPublicationData(metadata)?.title as string) ?? ''
    }&summary=${
      getPublicationData(metadata)?.content as string
    }&source=${TAPE_APP_NAME}`
  }
  return ''
}
