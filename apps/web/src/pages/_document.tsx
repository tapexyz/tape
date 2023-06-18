import { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'
import { FALLBACK_COVER_URL } from 'utils'

const DragverseDocument: React.FC = () => {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="icon" href={`${FALLBACK_COVER_URL}`} type="image/svg+xml" />
        <link rel="icon" href={`${FALLBACK_COVER_URL}`} type="image/x-icon" />
        <link rel="shortcut icon" href={`${FALLBACK_COVER_URL}`} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${FALLBACK_COVER_URL}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${FALLBACK_COVER_URL}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${FALLBACK_COVER_URL}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="57x57"
          href={`${FALLBACK_COVER_URL}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="60x60"
          href={`${FALLBACK_COVER_URL}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="72x72"
          href={`${FALLBACK_COVER_URL}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="76x76"
          href={`${FALLBACK_COVER_URL}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href={`${FALLBACK_COVER_URL}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={`${FALLBACK_COVER_URL}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="152x152"
          href={`${FALLBACK_COVER_URL}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="144x144"
          href={`${FALLBACK_COVER_URL}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="120x120"
          href={`${FALLBACK_COVER_URL}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="114x114"
          href={`${FALLBACK_COVER_URL}`}
        />
        <link rel="manifest" href={`${FALLBACK_COVER_URL}`} />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default DragverseDocument
