import Head from 'next/head'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'
import {
  LENSTUBE_APP_NAME,
  LENSTUBE_EMBED_URL,
  LENSTUBE_TWITTER_HANDLE,
  LENSTUBE_WEBSITE_URL,
  STATIC_ASSETS
} from 'utils'

type Props = {
  title?: string
  description?: string
  image?: string
  videoUrl?: string
}

const MetaTags: FC<Props> = (props) => {
  const { description, title, image, videoUrl } = props
  const router = useRouter()

  const meta = {
    title: `${title} ~ Lenstube` ?? LENSTUBE_APP_NAME,
    description:
      description ??
      'Lenstube is a decentralized video-sharing social media platform built with Lens protocol.',
    image: image ?? `${STATIC_ASSETS}/images/seo/og.png`,
    type: 'video.other',
    videoUrl: videoUrl
  }

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="robots" content="follow, index" />
      <meta content={meta.description} name="description" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5"
      />
      <link
        rel="canonical"
        href={
          videoUrl
            ? `${LENSTUBE_WEBSITE_URL}/watch${router.asPath}`
            : `${LENSTUBE_WEBSITE_URL}${router.asPath}`
        }
      />
      <meta
        property="og:url"
        content={
          videoUrl
            ? `${LENSTUBE_WEBSITE_URL}/watch${router.asPath}`
            : `${LENSTUBE_WEBSITE_URL}${router.asPath}`
        }
      />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content="Lenstube" />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:width" content={videoUrl ? '480' : '400'} />
      <meta property="og:image:height" content={videoUrl ? '360' : '400'} />

      <meta property="twitter:image:width" content={videoUrl ? '480' : '400'} />
      <meta
        property="twitter:image:height"
        content={videoUrl ? '360' : '400'}
      />
      <meta name="twitter:site" content="@lenstubexyz" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta property="twitter:image" content={meta.image} />
      <meta property="twitter:creator" content={LENSTUBE_TWITTER_HANDLE} />
      <meta
        name="twitter:card"
        content={videoUrl ? 'summary_large_image' : 'summary'}
      />

      {videoUrl && (
        <>
          <meta property="og:video" content={meta.videoUrl} />
          <meta property="og:video:width" content="1280" />
          <meta property="og:video:height" content="720" />
          <meta
            property="og:video:url"
            content={`${LENSTUBE_WEBSITE_URL}/watch${router.asPath}`}
          />
          <meta property="og:video:type" content="text/html" />
          <meta
            property="og:video:secure_url"
            content={`${LENSTUBE_WEBSITE_URL}/watch${router.asPath}`}
          />
          <meta name="twitter:card" content="player" />
          <meta
            name="twitter:player"
            content={`${LENSTUBE_EMBED_URL}${router.asPath}`}
          />
          <meta property="twitter:player:width" content="1280" />
          <meta property="twitter:player:height" content="720" />
        </>
      )}

      <link rel="preconnect" href={STATIC_ASSETS} />
      <link rel="dns-prefetch" href={STATIC_ASSETS} />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link
        rel="iframely player"
        type="text/html"
        href={`${LENSTUBE_EMBED_URL}${router.asPath}`}
        media="(aspect-ratio: 1280/720)"
      />
    </Head>
  )
}

export default MetaTags
