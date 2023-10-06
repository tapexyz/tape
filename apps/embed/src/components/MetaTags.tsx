import {
  OG_IMAGE,
  TAPE_APP_DESCRIPTION,
  TAPE_APP_NAME,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
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
    title: title ?? TAPE_APP_NAME,
    description: description ?? TAPE_APP_DESCRIPTION,
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
        href={`${TAPE_WEBSITE_URL}/watch${router.asPath}`}
      />
    </Head>
  )
}

export default MetaTags
