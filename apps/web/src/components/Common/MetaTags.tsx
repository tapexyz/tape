import type { FC } from 'react'

import {
  OG_IMAGE,
  STATIC_ASSETS,
  TAPE_API_URL,
  TAPE_APP_DESCRIPTION,
  TAPE_APP_NAME,
  TAPE_X_HANDLE
} from '@tape.xyz/constants'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {
  title?: string
}

const MetaTags: FC<Props> = (props) => {
  const router = useRouter()
  const { title } = props

  const meta = {
    description: TAPE_APP_DESCRIPTION,
    image: OG_IMAGE,
    title: title ? `${title} • ${TAPE_APP_NAME}` : TAPE_APP_NAME,
    type: 'website'
  }

  return (
    <Head>
      <title>{meta.title}</title>
      <meta content="follow, index" name="robots" />
      <meta content={meta.description} name="description" />
      <meta
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, maximum-scale=5, viewport-fit=cover"
        name="viewport"
      />
      <link href={`https://tape.xyz${router.asPath}`} rel="canonical" />
      <meta content={`https://tape.xyz${router.asPath}`} property="og:url" />
      <meta content={meta.type} property="og:type" />
      <meta content={TAPE_APP_NAME} property="og:site_name" />
      <meta content={meta.description} property="og:description" />
      <meta content={meta.title} property="og:title" />
      <meta content={meta.image} property="og:image" />
      <meta content="400" property="og:image:width" />
      <meta content="400" property="og:image:height" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="400" property="twitter:image:width" />
      <meta content="400" property="twitter:image:height" />
      <meta content="@tapexyz" name="twitter:site" />
      <meta content={meta.title} name="twitter:title" />
      <meta content={meta.description} name="twitter:description" />
      <meta content={meta.image} property="twitter:image" />
      <meta content={TAPE_X_HANDLE} property="twitter:creator" />
      {(router.pathname === '/watch/[id]' ||
        router.pathname === '/listen/[id]') &&
        router.query?.id && (
          <>
            <link
              href={`${TAPE_API_URL}/oembed?format=xml&id=${router.query?.id}`}
              rel="alternate"
              title={title}
              type="text/xml+oembed"
            />
            <link
              href={`${TAPE_API_URL}/oembed?format=json&id=${router.query?.id}`}
              rel="alternate"
              title={title}
              type="application/json+oembed"
            />
          </>
        )}
      <link href={STATIC_ASSETS} rel="preconnect" />
      <link href={STATIC_ASSETS} rel="dns-prefetch" />
    </Head>
  )
}

export default MetaTags
