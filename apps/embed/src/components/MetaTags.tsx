import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import {
  FALLBACK_COVER_URL,
  LENSTUBE_APP_NAME,
  LENSTUBE_WEBSITE_URL
} from 'utils'

type Props = {
  title?: string
  description?: string
  image?: string
  videoUrl: string
}

const MetaTags: React.FC<Props> = (props) => {
  const { description, title, image, videoUrl } = props
  const router = useRouter()

  const meta = {
    title: `${title} • Dragverse` ?? LENSTUBE_APP_NAME,
    description:
      description ??
      'Dragverse is a livestreaming and decentralized video-sharing social media platform built with Lens protocol and inspired by the Lenstube project.',
    image: image ?? `${FALLBACK_COVER_URL}`,
    type: 'video.other',
    videoUrl
  }

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="robots" content="noindex" />
      <meta content={meta.description} name="description" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5"
      />
      <link
        rel="canonical"
        href={`${LENSTUBE_WEBSITE_URL}/watch${router.asPath}`}
      />
    </Head>
  )
}

export default MetaTags
