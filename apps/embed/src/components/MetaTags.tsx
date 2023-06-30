import {
  LENSTUBE_APP_NAME,
  LENSTUBE_WEBSITE_URL,
  OG_IMAGE
} from '@lenstube/constants'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'

type Props = {
  title?: string
  description?: string
  image?: string
  videoUrl: string
}

const MetaTags: FC<Props> = (props) => {
  const { description, title, image, videoUrl } = props
  const router = useRouter()

  const meta = {
    title: `${title} • Lenstube` ?? LENSTUBE_APP_NAME,
    description:
      description ??
      'Lenstube is a decentralized video-sharing social media platform built with Lens protocol.',
    image: image ?? OG_IMAGE,
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
