import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'
import { STATIC_ASSETS } from 'utils'

class LenstubeDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link
            rel="shortcut icon"
            href={`${STATIC_ASSETS}/images/favicons/favicon.ico`}
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${STATIC_ASSETS}/images/favicons/apple-icon-180x180.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${STATIC_ASSETS}/images/favicons/favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${STATIC_ASSETS}/images/favicons/favicon-16x16.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="57x57"
            href={`${STATIC_ASSETS}/images/favicons/apple-icon-57x57.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="60x60"
            href={`${STATIC_ASSETS}/images/favicons/apple-icon-60x60.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="72x72"
            href={`${STATIC_ASSETS}/images/favicons/apple-icon-72x72.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="76x76"
            href={`${STATIC_ASSETS}/images/favicons/apple-icon-76x76.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href={`${STATIC_ASSETS}/images/favicons/favicon-96x96.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href={`${STATIC_ASSETS}/images/favicons/android-icon-192x192.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="152x152"
            href={`${STATIC_ASSETS}/images/favicons/apple-icon-152x152.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="144x144"
            href={`${STATIC_ASSETS}/images/favicons/apple-icon-144x144.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="120x120"
            href={`${STATIC_ASSETS}/images/favicons/apple-icon-120x120.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="114x114"
            href={`${STATIC_ASSETS}/images/favicons/apple-icon-114x114.png`}
          />
          <link
            rel="manifest"
            href={`${STATIC_ASSETS}/images/favicons/manifest.json`}
          />
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
}

export default LenstubeDocument
