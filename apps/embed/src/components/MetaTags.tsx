import type { FC } from 'react'

import {
  OG_IMAGE,
  TAPE_APP_DESCRIPTION,
  TAPE_APP_NAME,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {
  description?: string
  image?: string
  title?: string
}

const MetaTags: FC<Props> = (props) => {
  const { description, image, title } = props
  const router = useRouter()

  const meta = {
    description: description ?? TAPE_APP_DESCRIPTION,
    image: image ?? OG_IMAGE,
    title: title ?? TAPE_APP_NAME,
    type: 'video.other'
  }

  return (
    <Head>
      <title>{meta.title}</title>
      <meta content="noindex" name="robots" />
      <meta content={meta.description} name="description" />
      <meta
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, maximum-scale=5, viewport-fit=cover"
        name="viewport"
      />
      <link
        href={`${TAPE_WEBSITE_URL}/watch${router.asPath}`}
        rel="canonical"
      />
    </Head>
  )
}

export default MetaTags
