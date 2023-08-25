import {
  LENSTUBE_API_URL,
  LENSTUBE_APP_DESCRIPTION,
  LENSTUBE_APP_NAME,
  LENSTUBE_EMBED_URL,
  LENSTUBE_X_HANDLE,
  OG_IMAGE,
  STATIC_ASSETS
} from '@lenstube/constants'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'

type Props = {
  title?: string
  description?: string
  image?: string
}

const MetaTags: FC<Props> = (props) => {
  const { description, title, image } = props
  const router = useRouter()

  const meta = {
    title: title ?? LENSTUBE_APP_NAME,
    description: description ?? LENSTUBE_APP_DESCRIPTION,
    image: image ?? OG_IMAGE,
    type: 'website'
  }

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="robots" content="follow, index" />
      <meta content={meta.description} name="description" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
      />
      <link rel="canonical" href={`https://lenstube.xyz${router.asPath}`} />
      <meta
        property="og:url"
        content={`https://lenstube.xyz${router.asPath}`}
      />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content="Lenstube" />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:image:width" content="400" />
      <meta property="twitter:image:height" content="400" />
      <meta name="twitter:site" content="@lenstubexyz" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta property="twitter:image" content={meta.image} />
      <meta property="twitter:creator" content={LENSTUBE_X_HANDLE} />
      {router.pathname === '/watch/[id]' && router.query?.id && (
        <>
          <link
            rel="iframely player"
            type="text/html"
            href={`${LENSTUBE_EMBED_URL}/${router.query?.id}`}
            media="(aspect-ratio: 1280/720)"
          />
          <link
            rel="alternate"
            type="text/xml+oembed"
            href={`${LENSTUBE_API_URL}/oembed?format=xml&id=${router.query?.id}`}
            title={title}
          />
          <link
            rel="alternate"
            type="application/json+oembed"
            href={`${LENSTUBE_API_URL}/oembed?format=json&id=${router.query?.id}`}
            title={title}
          />
        </>
      )}
      <link rel="preconnect" href={STATIC_ASSETS} />
      <link rel="dns-prefetch" href={STATIC_ASSETS} />
    </Head>
  )
}

export default MetaTags
